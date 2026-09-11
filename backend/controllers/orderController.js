import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Coupon helper for Indian localization
const applyCouponDiscount = (code, subtotal) => {
  if (!code) return 0;
  const upper = code.trim().toUpperCase();
  if (upper === 'SAVE10') {
    return Math.round(subtotal * 0.1);
  }
  if (upper === 'SPHERE20') {
    return Math.round(subtotal * 0.2);
  }
  if (upper === 'FESTIVE15') {
    return Math.round(subtotal * 0.15);
  }
  if (upper === 'WELCOME500' && subtotal >= 2499) {
    return 500;
  }
  return 0;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      paymentResult
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Verify stock and fetch accurate prices
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} is no longer available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const currentPrice = product.price;
      const currentDiscountPrice = product.discountPrice;
      const effectiveUnitPrice = currentDiscountPrice || currentPrice;

      itemsPrice += effectiveUnitPrice * item.quantity;

      validatedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        image: product.images[0] || item.image,
        price: currentPrice,
        discountPrice: currentDiscountPrice,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || ''
      });
    }

    const discountAmount = applyCouponDiscount(couponCode, itemsPrice);
    const discountedItemsPrice = Math.max(0, itemsPrice - discountAmount);
    const shippingPrice = discountedItemsPrice >= 999 ? 0 : 99;
    const taxPrice = Number((discountedItemsPrice * 0.18).toFixed(2));
    const totalPrice = Number((discountedItemsPrice + shippingPrice + taxPrice).toFixed(2));

    const isPaid = paymentMethod !== 'COD' && paymentResult?.status === 'COMPLETED';

    const order = new Order({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentResult: isPaid ? paymentResult : undefined,
      itemsPrice: Number(itemsPrice.toFixed(2)),
      discountAmount,
      couponCode: couponCode || '',
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt: isPaid ? Date.now() : undefined,
      orderStatus: 'Pending',
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order successfully created and received'
        }
      ]
    });

    const createdOrder = await order.save();

    // Decrement stock for purchased products
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    let order;
    if (req.params.id.startsWith('SS-')) {
      order = await Order.findOne({ orderNumber: req.params.id })
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'slug');
    } else {
      order = await Order.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('orderItems.product', 'slug');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: User must own the order or be an Admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order by User (if Pending or Processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Shipped') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order that has already been ${order.orderStatus.toLowerCase()}`
      });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    order.trackingHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Cancelled by customer'
    });

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'all') {
      query.orderStatus = req.query.status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order payment status (Admin)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `MANUAL-${Date.now()}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.body.email_address || req.user.email
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

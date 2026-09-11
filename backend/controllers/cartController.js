import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to calculate totals
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalDiscount = 0;

  const validItems = cart.items.filter((item) => item.product != null);

  validItems.forEach((item) => {
    const prod = item.product;
    const effectivePrice = prod.discountPrice || prod.price;
    subtotal += prod.price * item.quantity;
    if (prod.discountPrice && prod.discountPrice < prod.price) {
      totalDiscount += (prod.price - prod.discountPrice) * item.quantity;
    }
  });

  const finalItemsPrice = subtotal - totalDiscount;
  const shippingPrice = finalItemsPrice >= 999 || validItems.length === 0 ? 0 : 99;
  const taxPrice = Number((finalItemsPrice * 0.18).toFixed(2));
  const totalPrice = Number((finalItemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    _id: cart._id,
    items: validItems,
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    shippingPrice,
    taxPrice,
    totalPrice,
    itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor = '', selectedSize = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item with same product + color + size exists
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    const price = product.discountPrice || product.price;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Total in cart would exceed stock (${product.stock})`
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price,
        selectedColor,
        selectedSize
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.json({
      success: true,
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product no longer available' });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`
      });
    }

    item.quantity = qty;
    item.price = product.discountPrice || product.price;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.json({
      success: true,
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.json({
      success: true,
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        subtotal: 0,
        totalDiscount: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Merge guest cart with user cart upon login
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = async (req, res) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const productId = guestItem.product?._id || guestItem.product || guestItem.productId;
      if (!productId) continue;

      const product = await Product.findById(productId);
      if (!product || product.stock < 1) continue;

      const color = guestItem.selectedColor || '';
      const size = guestItem.selectedSize || '';
      const requestedQty = Number(guestItem.quantity) || 1;

      const existingIndex = cart.items.findIndex(
        (i) =>
          i.product.toString() === productId.toString() &&
          i.selectedColor === color &&
          i.selectedSize === size
      );

      const price = product.discountPrice || product.price;

      if (existingIndex > -1) {
        const combinedQty = Math.min(
          cart.items[existingIndex].quantity + requestedQty,
          product.stock
        );
        cart.items[existingIndex].quantity = combinedQty;
        cart.items[existingIndex].price = price;
      } else {
        cart.items.push({
          product: productId,
          quantity: Math.min(requestedQty, product.stock),
          price,
          selectedColor: color,
          selectedSize: size
        });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.json({
      success: true,
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

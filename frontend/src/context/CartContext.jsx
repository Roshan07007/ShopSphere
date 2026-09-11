import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('shopsphere_guest_cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [fixedDiscount, setFixedDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync server cart when authenticated
  const fetchServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.success && res.cart) {
        setItems(res.cart.items || []);
      }
    } catch (err) {
      console.warn('Could not fetch remote cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // On auth state change, merge guest items or fetch server cart
  useEffect(() => {
    if (isAuthenticated) {
      const localGuestCart = localStorage.getItem('shopsphere_guest_cart');
      if (localGuestCart) {
        try {
          const guestItems = JSON.parse(localGuestCart);
          if (guestItems.length > 0) {
            cartAPI.mergeCart(guestItems).then((res) => {
              if (res.success && res.cart) {
                setItems(res.cart.items || []);
                localStorage.removeItem('shopsphere_guest_cart');
              }
            });
            return;
          }
        } catch {
          // ignore
        }
      }
      fetchServerCart();
    }
  }, [isAuthenticated, fetchServerCart]);

  // Save guest cart in localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shopsphere_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const prod = item.product || item;
    const price = prod.price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const productDiscounts = items.reduce((sum, item) => {
    const prod = item.product || item;
    if (prod.discountPrice && prod.discountPrice < prod.price) {
      return sum + (prod.price - prod.discountPrice) * item.quantity;
    }
    return sum;
  }, 0);

  const netItemsPrice = Math.max(0, subtotal - productDiscounts);

  // Coupon discount
  let couponDiscount = 0;
  if (discountPercent > 0) {
    couponDiscount = Math.round((netItemsPrice * discountPercent) / 100);
  } else if (fixedDiscount > 0) {
    couponDiscount = Math.min(fixedDiscount, netItemsPrice);
  }

  const finalDiscount = Number((productDiscounts + couponDiscount).toFixed(2));
  const payableItemsPrice = Math.max(0, netItemsPrice - couponDiscount);
  const shippingPrice = payableItemsPrice >= 999 || items.length === 0 ? 0 : 99;
  const taxPrice = Number((payableItemsPrice * 0.18).toFixed(2));
  const totalPrice = Number((payableItemsPrice + shippingPrice + taxPrice).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code) => {
    const upper = (code || '').trim().toUpperCase();
    if (!upper) {
      toast.warning('Please enter a coupon code');
      return false;
    }

    if (upper === 'SAVE10') {
      setCouponCode(upper);
      setDiscountPercent(10);
      setFixedDiscount(0);
      toast.success('🎉 Coupon SAVE10 applied! 10% discount added.');
      return true;
    } else if (upper === 'SPHERE20') {
      setCouponCode(upper);
      setDiscountPercent(20);
      setFixedDiscount(0);
      toast.success('🎉 Coupon SPHERE20 applied! 20% discount added.');
      return true;
    } else if (upper === 'FESTIVE15') {
      setCouponCode(upper);
      setDiscountPercent(15);
      setFixedDiscount(0);
      toast.success('🎉 Coupon FESTIVE15 applied! 15% discount added.');
      return true;
    } else if (upper === 'WELCOME500') {
      if (netItemsPrice < 2499) {
        toast.warning('Coupon WELCOME500 requires a minimum order of ₹2,499');
        return false;
      }
      setCouponCode(upper);
      setDiscountPercent(0);
      setFixedDiscount(500);
      toast.success('🎉 Coupon WELCOME500 applied! ₹500 discount added.');
      return true;
    } else {
      toast.error('Invalid or expired coupon code. Try SAVE10, SPHERE20, or WELCOME500.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setFixedDiscount(0);
    toast.info('Coupon removed');
  };

  const addToCart = async (product, quantity = 1, selectedColor = '', selectedSize = '', openDrawer = false) => {
    const requestedQty = Number(quantity) || 1;

    if (product.stock < 1) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await cartAPI.addToCart({
          productId: product._id,
          quantity: requestedQty,
          selectedColor,
          selectedSize
        });
        if (res.success && res.cart) {
          setItems(res.cart.items);
          toast.success(`Added ${product.name} to cart`);
          if (openDrawer) setIsDrawerOpen(true);
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      // Guest cart logic
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            (item.product?._id || item._id) === product._id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existingIndex > -1) {
          const newQty = Math.min(
            prev[existingIndex].quantity + requestedQty,
            product.stock
          );
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: `guest-${Date.now()}-${Math.random()}`,
              product: product,
              quantity: Math.min(requestedQty, product.stock),
              price: product.discountPrice || product.price,
              selectedColor,
              selectedSize
            }
          ];
        }
      });
      toast.success(`Added ${product.name} to cart`);
      if (openDrawer) setIsDrawerOpen(true);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    const qty = Number(newQty);
    if (qty < 1) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await cartAPI.updateItem(itemId, { quantity: qty });
        if (res.success && res.cart) {
          setItems(res.cart.items);
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      setItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, quantity: qty } : item))
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartAPI.removeItem(itemId);
        if (res.success && res.cart) {
          setItems(res.cart.items);
          toast.info('Item removed from cart');
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.info('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        setItems([]);
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      setItems([]);
      localStorage.removeItem('shopsphere_guest_cart');
    }
    setCouponCode('');
    setDiscountPercent(0);
    setFixedDiscount(0);
  };

  const getCartItem = (productId) => {
    return items.find((item) => (item.product?._id || item.product || item._id) === productId);
  };

  const getItemQuantity = (productId) => {
    const item = getCartItem(productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal: Number(subtotal.toFixed(2)),
        productDiscounts: Number(productDiscounts.toFixed(2)),
        couponDiscount: Number(couponDiscount.toFixed(2)),
        discountAmount: finalDiscount,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartItem,
        getItemQuantity,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

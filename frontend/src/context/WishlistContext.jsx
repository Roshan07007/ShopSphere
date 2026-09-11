import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useCart } from './CartContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  const [items, setItems] = useState(() => {
    try {
      const local = localStorage.getItem('shopsphere_guest_wishlist');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.success && res.wishlist) {
        setItems(res.wishlist);
      }
    } catch (err) {
      console.warn('Could not fetch wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('shopsphere_guest_wishlist', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const isInWishlist = (productId) => {
    return items.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await wishlistAPI.toggleWishlist(productId);
        if (res.success) {
          setItems(res.wishlist);
          if (res.added) {
            toast.success(`Saved "${product.name || 'item'}" to your wishlist`);
          } else {
            toast.info(`Removed "${product.name || 'item'}" from wishlist`);
          }
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      // Guest local wishlist
      setItems((prev) => {
        const exists = prev.some((p) => p._id === product._id);
        if (exists) {
          toast.info(`Removed "${product.name}" from wishlist`);
          return prev.filter((p) => p._id !== product._id);
        } else {
          toast.success(`Saved "${product.name}" to wishlist`);
          return [...prev, product];
        }
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistAPI.removeItem(productId);
        if (res.success) {
          setItems(res.wishlist);
          toast.info('Item removed from wishlist');
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      setItems((prev) => prev.filter((p) => p._id !== productId));
      toast.info('Item removed from wishlist');
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

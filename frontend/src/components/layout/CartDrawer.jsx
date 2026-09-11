import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { formatPrice } from '../../utils/formatPrice.js';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    productDiscounts,
    couponDiscount,
    shippingPrice,
    totalPrice,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const netPayableItems = Math.max(0, subtotal - productDiscounts - couponDiscount);
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - netPayableItems);
  const freeShippingProgress = Math.min(100, (netPayableItems / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-up">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/80 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Shopping Bag ({itemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          <div className="px-6 py-3 bg-primary-50/60 dark:bg-primary-950/40 border-b border-primary-100 dark:border-primary-900/50">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 truncate">
                <Truck className="w-3.5 h-3.5 text-primary-600" />
                {remainingForFreeShipping > 0 ? (
                  <span>Add <strong className="text-primary-600 dark:text-primary-400">{formatPrice(remainingForFreeShipping)}</strong> for Free Delivery!</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">🎉 FREE Delivery Unlocked!</span>
                )}
              </span>
              <span className="text-slate-500 font-semibold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <EmptyState
                type="cart"
                title="Your bag is empty"
                description="Browse our trending products with realistic INR pricing."
                actionText="Explore Products"
                onAction={() => {
                  setIsDrawerOpen(false);
                  navigate('/shop');
                }}
              />
            ) : (
              items.map((item) => {
                const prod = item.product || item;
                const unitPrice = prod.discountPrice || prod.price;
                const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 transition"
                  >
                    {/* Image */}
                    <img
                      src={image}
                      alt={prod.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white dark:bg-slate-800 flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${prod.slug || prod._id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition"
                          >
                            {prod.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-black text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= prod.stock}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Delivery</span>
                  <span>{shippingPrice === 0 ? <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong> : formatPrice(shippingPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total (Inc. GST)</span>
                  <span className="text-primary-600 dark:text-primary-400 text-lg font-black">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-extrabold shadow-md shadow-primary-500/20 transition active:scale-98"
                >
                  <span>Checkout in ₹</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                >
                  View Full Bag & Coupons
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

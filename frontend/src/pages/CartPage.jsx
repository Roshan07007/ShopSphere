import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatPrice } from '../utils/formatPrice.js';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    productDiscounts,
    couponDiscount,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponCode,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(inputCoupon)) {
      setInputCoupon('');
    }
  };

  const netPayableItems = Math.max(0, subtotal - productDiscounts - couponDiscount);
  const freeShippingThreshold = 999;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - netPayableItems);
  const progressPercent = Math.min(100, Math.round((netPayableItems / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="cart"
          title="Your shopping cart is empty"
          description="Explore our premium catalog with realistic INR pricing and discover trending products."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            You have <strong className="text-slate-900 dark:text-white">{itemCount}</strong> {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-850 border border-primary-200/80 dark:border-slate-700 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <Truck className="w-4 h-4 text-primary-600" />
            {neededForFreeShipping > 0 ? (
              <span>Add <strong className="text-primary-600 dark:text-primary-400">{formatPrice(neededForFreeShipping)}</strong> more to get <strong>FREE Express Delivery!</strong></span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">🎉 Congratulations! You have unlocked FREE Express Delivery!</span>
            )}
          </span>
          <span className="text-slate-500 font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 transition-all duration-500 rounded-full"
          />
        </div>
      </div>

      {/* Main Grid: Items List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Cart Items List - 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const prod = item.product || item;
            const unitPrice = prod.discountPrice || prod.price;
            const originalPrice = prod.price;
            const hasDiscount = prod.discountPrice && prod.discountPrice < prod.price;
            const image =
              prod.images?.[0] ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={item._id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Image & Title */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={image}
                    alt={prod.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                      {prod.brand}
                    </span>
                    <Link
                      to={`/product/${prod.slug || prod._id}`}
                      className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition"
                    >
                      {prod.name}
                    </Link>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-slate-400">
                        {[item.selectedColor, item.selectedSize].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <div className="flex items-center gap-2 pt-1 sm:hidden">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatPrice(unitPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price, Controls, and Remove */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 self-stretch sm:self-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center disabled:opacity-30 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-black text-slate-800 dark:text-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= prod.stock}
                      className="w-8 h-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center disabled:opacity-30 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for Item */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {formatPrice(unitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card - 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Price Details
            </h3>

            {/* Breakdown */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>

              {productDiscounts > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Product Savings</span>
                  <span>-{formatPrice(productDiscounts)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon ({couponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Charges</span>
                <span>
                  {shippingPrice === 0 ? (
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong>
                  ) : (
                    formatPrice(shippingPrice)
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(taxPrice)}</span>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-2xl text-primary-600 dark:text-primary-400 font-black">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Available Coupon Chips */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Available Offers:
              </span>
              <div className="flex flex-wrap gap-2">
                {['SAVE10', 'SPHERE20', 'WELCOME500'].map((code) => (
                  <button
                    key={code}
                    onClick={() => applyCoupon(code)}
                    className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-mono font-bold text-[11px] border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Application */}
            <div className="pt-2">
              {couponCode ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon: {couponCode} applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-600 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white uppercase font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition active:scale-95"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout & Continue Shopping Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-sm shadow-xl shadow-primary-500/25 transition active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition active:scale-98 text-center"
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust Guarantees */}
            <div className="space-y-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Safe UPI, RuPay & COD Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>7-Day Doorstep Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;

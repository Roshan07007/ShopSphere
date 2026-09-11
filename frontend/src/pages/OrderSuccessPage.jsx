import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Truck,
  MapPin,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Printer
} from 'lucide-react';
import { formatPrice, formatIndianAddress } from '../utils/formatPrice.js';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order placed successfully!</h2>
        <p className="text-sm text-slate-500">Thank you for shopping with ShopSphere India.</p>
        <Link
          to="/shop"
          className="inline-flex px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm shadow transition"
        >
          Explore More Products
        </Link>
      </div>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      
      {/* Top Banner Celebration */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-primary-950 via-slate-900 to-accent-950 text-white text-center space-y-4 shadow-2xl border border-primary-800/40 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.4]" />
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-widest border border-primary-400/30">
          Order Confirmed & Verified
        </span>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Dhanyavaad! Your Order is Placed.
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Order Number: <strong className="text-white font-mono">{order.orderNumber}</strong>. Tracking updates will be sent to your mobile and email.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Estimated Delivery: {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {/* Order Details Breakdown Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Key Info Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Order ID</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Date</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Payment Mode</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{order.paymentMethod}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Total Amount</span>
            <p className="font-black text-primary-600 dark:text-primary-400 mt-0.5 text-sm">{formatPrice(order.totalPrice)}</p>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Items in this Shipment ({order.orderItems?.length || 0})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Qty: {item.quantity} × {formatPrice(item.discountPrice || item.price)}
                    </span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {formatPrice((item.discountPrice || item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address Summary */}
        {order.shippingAddress && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              <span>Delivering to:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-slate-500">{formatIndianAddress(order.shippingAddress)}</p>
            <p className="text-xs text-slate-500 font-mono">Mobile: {order.shippingAddress.phone}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/my-orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;

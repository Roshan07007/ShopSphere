import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  XCircle,
  ShieldCheck
} from 'lucide-react';

const STAGES = [
  { key: 'Pending', label: 'Order Placed', desc: 'Received & Queued', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', desc: 'Payment Verified', icon: ShieldCheck },
  { key: 'Processing', label: 'Processing', desc: 'Packed at Hub', icon: Package },
  { key: 'Shipped', label: 'Shipped', desc: 'In Transit via BlueDart', icon: Truck },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'With Courier Agent', icon: Truck },
  { key: 'Delivered', label: 'Delivered', desc: 'Delivered to Doorstep', icon: MapPin }
];

const STAGE_ORDER = {
  'Pending': 0,
  'Confirmed': 1,
  'Processing': 2,
  'Shipped': 3,
  'Out for Delivery': 4,
  'Delivered': 5
};

export const TimelineTracker = ({ currentStatus = 'Pending', trackingHistory = [] }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-4 text-red-700 dark:text-red-400">
        <XCircle className="w-8 h-8 flex-shrink-0 text-red-500" />
        <div>
          <h4 className="font-bold text-lg">Order Cancelled</h4>
          <p className="text-sm text-red-600 dark:text-red-300">
            This order has been cancelled and any paid funds will be refunded to your original payment method.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STAGE_ORDER[currentStatus] ?? 0;

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-0" />

          {/* Active Progress Line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-emerald-500 -z-0"
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isCompleted && idx < currentIndex ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                <div className="text-center mt-3">
                  <span className={`block text-xs font-bold ${
                    isCurrent ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    {stage.label}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[100px]">
                    {stage.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex items-start gap-4 relative">
              {idx < STAGES.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-px ${
                    idx < currentIndex ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 shrink-0 ${
                  isCompleted
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted && idx < currentIndex ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${
                  isCurrent ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineTracker;

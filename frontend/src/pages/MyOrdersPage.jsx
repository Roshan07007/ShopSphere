import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  Receipt,
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { orderAPI } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import { LoadingPage } from '../components/common/Spinner.jsx';
import { TimelineTracker } from '../components/common/TimelineTracker.jsx';
import { formatPrice, formatIndianAddress } from '../utils/formatPrice.js';
import { AmbientGlow } from '../components/common/AmbientGlow.jsx';

const MyOrdersPage = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Cancel order modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // View tracking timeline modal
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    try {
      setCancelling(true);
      const res = await orderAPI.cancelOrder(cancelModalOrder._id, cancelReason);
      if (res.success) {
        toast.success('Order has been cancelled successfully');
        setCancelModalOrder(null);
        setCancelReason('');
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return ord.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <LoadingPage text="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="orders"
          title="No Orders Found"
          description="Looks like you haven't placed any orders yet. Explore our curated collections and place your first order with exclusive Indian offers!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AmbientGlow />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Order Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Orders & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track real-time delivery milestones, download GST invoices, and manage past purchases.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Placed' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="relative z-10 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching orders</h3>
            <p className="text-xs text-slate-500">There are no orders with status &ldquo;{statusFilter}&rdquo;.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const isCancelled = order.orderStatus === 'Cancelled';
            const canCancel = ['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus);

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Top Meta */}
                <div className="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                    <div>
                      <span className="block text-slate-400 font-medium">Order Reference</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        #{order._id.slice(-8)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 font-medium">Date Placed</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 font-medium">Total Amount</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-400 font-medium">Payment</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">
                        {order.paymentMethod} • {order.isPaid ? 'Paid' : 'Pending COD'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge status={order.orderStatus} />
                    <button
                      onClick={() => setTrackingModalOrder(order)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-bold hover:bg-primary-100 transition"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Track</span>
                    </button>
                  </div>
                </div>

                {/* Items & Shipping Content */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Item List (8 Cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60"
                        >
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={item.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.product}`}
                              className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition"
                            >
                              {item.name}
                            </Link>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                              <span>Qty: {item.quantity}</span>
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>Size: {item.size}</span>}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {formatPrice(item.price)} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address & Actions (4 Cols) */}
                  <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                        <span>Delivery Destination</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.shippingAddress?.fullName || 'Valued Customer'}
                        </div>
                        <div>+91 {order.shippingAddress?.phone}</div>
                        <p className="line-clamp-2 text-slate-500 dark:text-slate-400">
                          {formatIndianAddress(order.shippingAddress)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      {canCancel && (
                        <button
                          onClick={() => setCancelModalOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          Cancel Order
                        </button>
                      )}

                      {isDelivered && (
                        <Link
                          to={`/shop`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Buy Again</span>
                        </Link>
                      )}

                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition ml-auto"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>GST Receipt</span>
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            );
          })
        )}
      </div>

      {/* Tracking Modal with Interactive 3D Timeline */}
      <Modal
        isOpen={!!trackingModalOrder}
        onClose={() => setTrackingModalOrder(null)}
        title={`Live Milestone Tracking • #${trackingModalOrder?._id.slice(-8).toUpperCase()}`}
      >
        {trackingModalOrder && (
          <div className="space-y-6 pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-950 via-slate-900 to-accent-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-primary-300 font-bold">Estimated Delivery</span>
                <h4 className="text-sm font-black text-white mt-0.5">
                  Expected within 2-3 Business Days
                </h4>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold">
                {trackingModalOrder.orderStatus}
              </div>
            </div>

            {/* Timeline Component */}
            <TimelineTracker
              currentStatus={trackingModalOrder.orderStatus}
              history={trackingModalOrder.trackingHistory || []}
            />

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary-600" />
                <span>Shipping Address</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {formatIndianAddress(trackingModalOrder.shippingAddress)}
              </p>
              <p className="text-slate-400">Phone: +91 {trackingModalOrder.shippingAddress?.phone}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        title="Cancel Your Order"
      >
        <form onSubmit={handleCancelOrder} className="space-y-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Are you sure you want to cancel?</span>
            </div>
            <p>
              Your order #{cancelModalOrder?._id.slice(-8).toUpperCase()} for {formatPrice(cancelModalOrder?.totalPrice || 0)} will be cancelled immediately. If prepaid via UPI/Card, refund will be initiated to your bank account within 24 hours.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Reason for Cancellation
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="">Select a reason</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found better price elsewhere">Found better price elsewhere</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Incorrect shipping address">Incorrect shipping address</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCancelModalOrder(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={cancelling}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default MyOrdersPage;

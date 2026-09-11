import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Edit3,
  Search,
  Filter,
  PackageCheck,
  Receipt
} from 'lucide-react';
import { orderAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import { LoadingPage } from '../../components/common/Spinner.jsx';
import { formatPrice, formatIndianAddress } from '../../utils/formatPrice.js';
import { AmbientGlow } from '../../components/common/AmbientGlow.jsx';

const AdminOrders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Status update modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await orderAPI.getAllOrders(params);
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
  }, [statusFilter]);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await orderAPI.updateOrderStatus(selectedOrder._id, newStatus, statusNote);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const id = ord._id.toLowerCase();
    const name = (ord.user?.name || ord.shippingAddress?.fullName || '').toLowerCase();
    const phone = (ord.shippingAddress?.phone || '').toLowerCase();
    return id.includes(term) || name.includes(term) || phone.includes(term);
  });

  if (loading && orders.length === 0) {
    return <LoadingPage text="Loading Indian store orders..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      <AmbientGlow />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track dispatch workflows, verify COD collections, and update tracking stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, name, phone..."
              className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'Pending', label: 'Pending' },
          { id: 'Confirmed', label: 'Confirmed' },
          { id: 'Processing', label: 'Processing' },
          { id: 'Shipped', label: 'Shipped' },
          { id: 'Out for Delivery', label: 'Out for Delivery' },
          { id: 'Delivered', label: 'Delivered' },
          { id: 'Cancelled', label: 'Cancelled' }
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

      {/* Orders Table */}
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery Location</th>
                <th className="py-3.5 px-4">Amount (₹)</th>
                <th className="py-3.5 px-4">Payment Mode</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white uppercase">
                        #{order._id.slice(-8)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        +91 {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {order.shippingAddress?.street}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-black text-slate-900 dark:text-white text-sm">
                        {formatPrice(order.totalPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                        {order.paymentMethod}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {order.isPaid ? 'Paid Online' : 'Pay on Delivery'}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge status={order.orderStatus} />
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold hover:bg-primary-100 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Update Order Status • #${selectedOrder?._id.slice(-8).toUpperCase()}`}
      >
        {selectedOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Customer: {selectedOrder.shippingAddress?.fullName}</span>
                <span className="font-black text-primary-600">{formatPrice(selectedOrder.totalPrice)}</span>
              </div>
              <p className="text-slate-500">
                Destination: {formatIndianAddress(selectedOrder.shippingAddress)}
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Fulfillment Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Pending">Pending (Order Placed)</option>
                <option value="Confirmed">Confirmed (Seller Approved)</option>
                <option value="Processing">Processing (Packed & Ready)</option>
                <option value="Shipped">Shipped (In Transit)</option>
                <option value="Out for Delivery">Out for Delivery (Courier Assigned)</option>
                <option value="Delivered">Delivered (Handed to Customer)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Tracking Milestone Note (Optional)
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Dispatched from Mumbai Central Fulfillment Center via BlueDart"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Tracking Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default AdminOrders;

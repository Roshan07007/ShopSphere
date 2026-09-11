import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Shield,
  Phone,
  Mail,
  Building2,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Heart,
  Camera,
  Upload,
  X,
  CreditCard,
  QrCode,
  Package,
  Clock,
  Truck,
  RotateCcw,
  Calendar,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { orderAPI } from '../services/api.js';
import Modal from '../components/common/Modal.jsx';
import TimelineTracker from '../components/common/TimelineTracker.jsx';
import AmbientGlow from '../components/common/AmbientGlow.jsx';
import {
  INDIAN_STATES,
  isValidIndianPhone,
  isValidIndianPincode,
  formatIndianAddress,
  formatPrice
} from '../utils/formatPrice.js';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, logout } = useAuth();
  const { addToCart } = useCart();
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with search params
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // 1. Personal Information State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    alternatePhone: user?.alternatePhone || '',
    gender: user?.gender || '',
    dob: user?.dob || '',
    avatar: user?.avatar || DEFAULT_AVATAR
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || DEFAULT_AVATAR);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Sync form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        alternatePhone: user.alternatePhone || '',
        gender: user.gender || '',
        dob: user.dob || '',
        avatar: user.avatar || DEFAULT_AVATAR
      });
      setAvatarPreview(user.avatar || DEFAULT_AVATAR);
    }
  }, [user]);

  // 2. Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await orderAPI.getMyOrders();
          if (res.success) {
            setOrders(res.orders || []);
          }
        } catch (err) {
          console.error('Failed to load orders:', err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  // 3. Password / Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // 4. Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullName: user?.name || '',
    phone: user?.phone || '',
    alternatePhone: '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // 5. Payment Methods State (Simulation)
  const [savedUpiList, setSavedUpiList] = useState([
    { id: '1', vpa: `${(user?.name || 'shopper').toLowerCase().replace(/\s+/g, '')}@okaxis`, isDefault: true, bank: 'Axis Bank' },
    { id: '2', vpa: `${user?.phone || '9876543210'}@paytm`, isDefault: false, bank: 'Paytm Payments Bank' }
  ]);
  const [newUpiId, setNewUpiId] = useState('');

  // 6. Preferences State
  const [preferences, setPreferences] = useState({
    smsUpdates: true,
    whatsappUpdates: true,
    promotionalEmails: false,
    currency: 'INR (₹)'
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Access Required</h2>
        <p className="text-xs text-slate-500">Please log in to access your personal dashboard and saved details.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary-600 text-white text-xs font-bold shadow-md hover:bg-primary-700 transition"
        >
          Sign In Now &rarr;
        </Link>
      </div>
    );
  }

  // Handle Avatar File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Profile photo size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setAvatarPreview(base64Image);
      setProfileForm((prev) => ({ ...prev, avatar: base64Image }));
      setIsEditingProfile(true);
      toast.info('Photo preview updated. Click "Save Changes" to persist.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(DEFAULT_AVATAR);
    setProfileForm((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }));
    setIsEditingProfile(true);
    toast.info('Photo removed. Click "Save Changes" to persist.');
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.warning('Full Name is required');
      return;
    }
    if (profileForm.phone && !isValidIndianPhone(profileForm.phone)) {
      toast.warning('Please enter a valid 10-digit Indian phone number');
      return;
    }
    if (profileForm.alternatePhone && !isValidIndianPhone(profileForm.alternatePhone)) {
      toast.warning('Please enter a valid 10-digit alternate phone number');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await updateProfile(profileForm);
      if (res.success) {
        toast.success('Your profile details were updated successfully!');
        setIsEditingProfile(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      alternatePhone: user.alternatePhone || '',
      gender: user.gender || '',
      dob: user.dob || '',
      avatar: user.avatar || DEFAULT_AVATAR
    });
    setAvatarPreview(user.avatar || DEFAULT_AVATAR);
    setIsEditingProfile(false);
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.warning('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setChangingPass(true);
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Home',
      fullName: user?.name || '',
      phone: user?.phone || '',
      alternatePhone: '',
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: 'Maharashtra',
      postalCode: '',
      country: 'India',
      isDefault: (user.addresses || []).length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      label: addr.label || 'Home',
      fullName: addr.fullName || user?.name || '',
      phone: addr.phone || user?.phone || '',
      alternatePhone: addr.alternatePhone || '',
      houseNo: addr.houseNo || '',
      street: addr.street || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || 'Maharashtra',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      isDefault: !!addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.postalCode) {
      toast.warning('Please fill in all mandatory address fields');
      return;
    }
    if (!isValidIndianPhone(addressForm.phone)) {
      toast.warning('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!isValidIndianPincode(addressForm.postalCode)) {
      toast.warning('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    try {
      setSavingAddress(true);
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        toast.success('Address updated successfully');
      } else {
        await addAddress(addressForm);
        toast.success('New delivery address added');
      }
      setIsAddressModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery address?')) {
      try {
        await deleteAddress(id);
        toast.success('Address removed from account');
      } catch (err) {
        toast.error(err.message || 'Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (addr) => {
    try {
      await updateAddress(addr._id, { ...addr, isDefault: true });
      toast.success('Default delivery address updated');
    } catch (err) {
      toast.error(err.message || 'Failed to set default address');
    }
  };

  // Handle Cancel Order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const res = await orderAPI.cancelOrder(orderId, 'Cancelled by customer from account dashboard');
        if (res.success) {
          toast.success('Order cancelled successfully');
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, status: 'Cancelled' } : o))
          );
        }
      } catch (err) {
        toast.error(err.message || 'Failed to cancel order');
      }
    }
  };

  // Handle Reorder
  const handleReorder = (order) => {
    order.items?.forEach((item) => {
      addToCart(item.product, item.quantity, item.selectedColor, item.selectedSize, false);
    });
    toast.success('Items added to your bag!');
    navigate('/cart');
  };

  // Add UPI ID
  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpiId.includes('@')) {
      toast.warning('Please enter a valid UPI VPA (e.g. user@okhdfcbank)');
      return;
    }
    setSavedUpiList((prev) => [
      ...prev,
      { id: Date.now().toString(), vpa: newUpiId.trim(), isDefault: false, bank: 'Linked UPI App' }
    ]);
    setNewUpiId('');
    toast.success('UPI ID saved to your account!');
  };

  const handleDeleteUpi = (id) => {
    setSavedUpiList((prev) => prev.filter((u) => u.id !== id));
    toast.info('UPI ID removed');
  };

  const navItems = [
    { key: 'profile', label: 'Profile & Personal Info', icon: User, count: null },
    { key: 'orders', label: 'Your Orders', icon: Package, count: orders.length || null },
    { key: 'addresses', label: 'Saved Addresses', icon: MapPin, count: (user.addresses || []).length || null },
    { key: 'payments', label: 'Payment Methods & UPI', icon: CreditCard, count: null },
    { key: 'wishlist', label: 'Your Wishlist', icon: Heart, count: wishlistItems.length || null },
    { key: 'security', label: 'Security & Password', icon: Lock, count: null },
    { key: 'preferences', label: 'Account Preferences', icon: Sliders, count: null }
  ];

  return (
    <div className="relative min-h-[90vh] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AmbientGlow />

      {/* Top Welcome Header Banner */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* User Identity & Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={avatarPreview}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-400/80 shadow-xl shadow-primary-500/20 bg-slate-800"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition shadow-md"
              title="Change profile photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                {user.role === 'admin' ? 'Administrator' : 'Verified Member 🇮🇳'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5 font-semibold">
              <Phone className="w-3.5 h-3.5 text-primary-400" />
              <span>+91 {user.phone || 'Phone not set'}</span>
            </p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="block text-lg font-black text-white">{orders.length || 0}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Orders</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="block text-lg font-black text-white">{(user.addresses || []).length}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Addresses</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="block text-lg font-black text-rose-400">{wishlistItems.length}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Wishlist</span>
          </div>
        </div>

      </div>

      {/* Main Layout: 2-Column Amazon-Like Navigation + Active View */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACCOUNT NAVIGATION MENU (4 COLS) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Account Control Center
              </h2>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20 scale-[1.01]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE TAB CONTENT AREA (8 COLS) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">

            {/* TAB 1: PROFILE & PERSONAL INFO */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Profile & Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage your profile photo, contact details, and Indian identity.
                    </p>
                  </div>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCancelProfileEdit}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Profile Photo Manager */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500 shadow-md bg-white dark:bg-slate-900"
                  />
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Profile Picture
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload a PNG, JPG, or WEBP image (max 2MB).
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>
                      {avatarPreview !== DEFAULT_AVATAR && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                          isEditingProfile
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                        }`}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                          isEditingProfile
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Mobile */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Primary Mobile (India)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          disabled={!isEditingProfile}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                          }
                          placeholder="98765 43210"
                          className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                            isEditingProfile
                              ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                              : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Alternate Mobile */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Alternate Mobile Number (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={profileForm.alternatePhone}
                          disabled={!isEditingProfile}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              alternatePhone: e.target.value.replace(/\D/g, '').slice(0, 10)
                            })
                          }
                          placeholder="Optional contact"
                          className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                            isEditingProfile
                              ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                              : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Gender
                      </label>
                      <select
                        value={profileForm.gender}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                          isEditingProfile
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileForm.dob}
                        disabled={!isEditingProfile}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                          isEditingProfile
                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500'
                            : 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-700 dark:text-slate-300 cursor-default'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Save / Cancel Buttons */}
                  {isEditingProfile && (
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
                      >
                        {savingProfile ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Save Profile Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* TAB 2: YOUR ORDERS */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Your Orders & Logistics
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Track packages, view receipts, and cancel or reorder items.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="h-36 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <Package className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      No orders placed yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore our curated catalog with ₹999 free delivery across India.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-md hover:bg-primary-700 transition"
                    >
                      Start Shopping &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const canCancel = order.status === 'Pending' || order.status === 'Processing';
                      return (
                        <div
                          key={order._id}
                          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4"
                        >
                          {/* Top Row: ID, Date, Status */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                ORDER #{order.orderId || order._id.slice(-8).toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300'
                                    : order.status === 'Cancelled'
                                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                                    : 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200'
                                }`}
                              >
                                {order.status}
                              </span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">
                                {formatPrice(order.totalPrice)}
                              </span>
                            </div>
                          </div>

                          {/* Line Items Thumbnails */}
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => {
                              const prod = item.product || {};
                              const img = prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                              return (
                                <div key={idx} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img src={img} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {item.name}
                                      </h4>
                                      <span className="text-[11px] text-slate-400">
                                        Qty: {item.quantity} • {formatPrice(item.price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => setSelectedOrderForTracking(order)}
                              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                            >
                              <Truck className="w-3.5 h-3.5 text-primary-600" />
                              <span>Track Order</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {canCancel && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 hover:bg-rose-50 text-rose-600 text-xs font-bold transition"
                                >
                                  Cancel Order
                                </button>
                              )}
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black shadow transition active:scale-95 flex items-center gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reorder</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add, edit, or set default delivery addresses for 1-click checkout.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black shadow-md shadow-primary-500/20 transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {(!user.addresses || user.addresses.length === 0) ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <MapPin className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      No saved addresses found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Save home, office, or apartment addresses to enjoy fast Indian courier delivery.
                    </p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-bold shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 relative ${
                          addr.isDefault
                            ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                            : 'border-slate-200/80 dark:border-slate-800 hover:shadow-lg'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              {addr.label || 'Home'}
                            </span>
                            {addr.isDefault ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Default
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSetDefaultAddress(addr)}
                                className="text-[11px] text-slate-400 hover:text-primary-600 font-bold"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>

                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {addr.fullName}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> +91 {addr.phone}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                            {formatIndianAddress(addr)}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Address</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: PAYMENT METHODS & UPI */}
            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Indian Payment Methods & Saved UPI
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage 1-click UPI VPAs and payment credentials for express checkout.
                  </p>
                </div>

                {/* UPI Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Saved UPI IDs (GPay, PhonePe, Paytm)
                  </h3>

                  <div className="space-y-2">
                    {savedUpiList.map((upi) => (
                      <div
                        key={upi.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                            <QrCode className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block font-mono">
                              {upi.vpa}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {upi.bank} {upi.isDefault ? '• Default' : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteUpi(upi.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition"
                          title="Remove UPI ID"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add UPI Form */}
                  <form onSubmit={handleAddUpi} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newUpiId}
                      onChange={(e) => setNewUpiId(e.target.value)}
                      placeholder="Add new UPI ID (e.g. yourname@okaxis)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow transition"
                    >
                      Add UPI
                    </button>
                  </form>
                </div>

                {/* Cash on Delivery Notice */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Zero-Fee Cash on Delivery (COD) is permanently enabled for your verified address across India.</span>
                </div>
              </motion.div>
            )}

            {/* TAB 5: WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Your Wishlist ({wishlistItems.length})
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Saved products ready to add to bag.
                    </p>
                  </div>
                  <Link
                    to="/wishlist"
                    className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Wishlist Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <Heart className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      Your wishlist is empty
                    </h3>
                    <p className="text-xs text-slate-500">Save your favorite gear while browsing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((prod) => (
                      <div
                        key={prod._id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <img
                          src={prod.images?.[0] || DEFAULT_AVATAR}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                            {formatPrice(prod.discountPrice || prod.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(prod, 1, '', '', false);
                            removeFromWishlist(prod._id);
                            toast.success('Moved to shopping bag!');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold shadow hover:bg-primary-700 transition"
                        >
                          Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 6: SECURITY & PASSWORD */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Account Security & Password
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your password and review account security.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      New Password (Min 6 chars)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={changingPass}
                      className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                      {changingPass ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB 7: ACCOUNT PREFERENCES */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
              >
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Account Preferences & Notifications
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize your shopping alerts and communications.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        SMS Order & Courier Updates
                      </h4>
                      <p className="text-[11px] text-slate-500">Receive dispatch & out-for-delivery alerts via Indian SMS.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.smsUpdates}
                      onChange={(e) => setPreferences({ ...preferences, smsUpdates: e.target.checked })}
                      className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        WhatsApp Instant Notifications
                      </h4>
                      <p className="text-[11px] text-slate-500">Get order tracking links and customer care via WhatsApp.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.whatsappUpdates}
                      onChange={(e) => setPreferences({ ...preferences, whatsappUpdates: e.target.checked })}
                      className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Indian Store Currency
                      </h4>
                      <p className="text-[11px] text-slate-500">Fixed to Indian Rupee (₹ INR) for 100% accurate transactions.</p>
                    </div>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      ₹ INR (Active)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Address Edit/Add Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Delivery Address' : 'Add New Indian Delivery Address'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
          {/* Label selector */}
          <div className="flex items-center gap-2">
            {['Home', 'Work', 'Other'].map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  addressForm.label === lbl
                    ? 'bg-primary-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                value={addressForm.fullName}
                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                placeholder="Receiver name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                10-Digit Mobile *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="98765 43210"
                  className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Alternate Phone (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  value={addressForm.alternatePhone}
                  onChange={(e) => setAddressForm({ ...addressForm, alternatePhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="Alternate number"
                  className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Flat / House No / Building
              </label>
              <input
                type="text"
                value={addressForm.houseNo}
                onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
                placeholder="e.g. Flat 402, Lotus Residency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Area / Street / Locality *
              </label>
              <input
                type="text"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="e.g. Linking Road, Bandra West"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={addressForm.landmark}
                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                placeholder="e.g. Near Metro Station"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                City *
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                State *
              </label>
              <select
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                PIN Code *
              </label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                placeholder="6 digits"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                Set as Default Delivery Address
              </span>
            </label>
            <span className="text-[11px] text-slate-400">India (IN)</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingAddress}
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50"
            >
              {savingAddress ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Live Order Tracking Modal */}
      {selectedOrderForTracking && (
        <Modal
          isOpen={!!selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
          title={`Order Tracking - #${selectedOrderForTracking.orderId || selectedOrderForTracking._id.slice(-8).toUpperCase()}`}
        >
          <div className="space-y-6 pt-2">
            <TimelineTracker currentStatus={selectedOrderForTracking.status} />
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping Address:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                  {formatIndianAddress(selectedOrderForTracking.shippingAddress)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {selectedOrderForTracking.paymentMethod} • {formatPrice(selectedOrderForTracking.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ProfilePage;

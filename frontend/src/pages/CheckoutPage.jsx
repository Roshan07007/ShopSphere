import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building2,
  QrCode,
  Sparkles,
  Zap,
  Phone,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { orderAPI } from '../services/api.js';
import {
  formatPrice,
  INDIAN_STATES,
  isValidIndianPhone,
  isValidIndianPincode,
  formatIndianAddress
} from '../utils/formatPrice.js';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    subtotal,
    discountAmount,
    couponCode,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart
  } = useCart();

  const [step, setStep] = useState(1); // 1: Address, 2: Delivery, 3: Payment, 4: Review
  const [placingOrder, setPlacingOrder] = useState(false);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India'
  });

  // Delivery Speed State
  const [deliveryOption, setDeliveryOption] = useState('STANDARD'); // 'STANDARD' or 'EXPRESS'

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('UPI_DEMO');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [codCaptcha, setCodCaptcha] = useState('');
  const [expectedCaptcha] = useState('7842');
  const [cardInfo, setCardInfo] = useState({
    number: '4242 •••• •••• 4242',
    name: '',
    expiry: '12/28',
    cvv: '123'
  });

  // Pre-fill user details and address
  useEffect(() => {
    if (items.length === 0) {
      toast.warning('Your shopping bag is empty');
      navigate('/cart');
      return;
    }

    if (user) {
      setCardInfo((prev) => ({ ...prev, name: user.name }));
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setSelectedAddressId(defaultAddr._id);
        setShippingAddress({
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone,
          houseNo: defaultAddr.houseNo || '',
          street: defaultAddr.street,
          landmark: defaultAddr.landmark || '',
          city: defaultAddr.city,
          state: defaultAddr.state || 'Maharashtra',
          postalCode: defaultAddr.postalCode,
          country: defaultAddr.country || 'India'
        });
      } else {
        setShippingAddress((prev) => ({
          ...prev,
          fullName: user.name || '',
          phone: user.phone || '+91 '
        }));
      }
    }
  }, [user, items.length, navigate, toast]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShippingAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      houseNo: addr.houseNo || '',
      street: addr.street,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India'
    });
  };

  const validateAddress = () => {
    if (!shippingAddress.fullName.trim()) {
      toast.warning('Please enter recipient full name');
      return false;
    }
    if (!isValidIndianPhone(shippingAddress.phone)) {
      toast.warning('Please enter a valid 10-digit Indian phone number (+91)');
      return false;
    }
    if (!shippingAddress.street.trim()) {
      toast.warning('Please enter Area / Street / Locality');
      return false;
    }
    if (!shippingAddress.city.trim()) {
      toast.warning('Please enter City');
      return false;
    }
    if (!shippingAddress.state.trim()) {
      toast.warning('Please select an Indian State');
      return false;
    }
    if (!isValidIndianPincode(shippingAddress.postalCode)) {
      toast.warning('Please enter a valid 6-digit Indian PIN Code');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateAddress()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (paymentMethod === 'UPI_DEMO' && !upiId.includes('@')) {
        toast.warning('Please enter a valid UPI ID (e.g. yourname@upi)');
        return;
      }
      if (paymentMethod === 'COD' && codCaptcha.trim() !== expectedCaptcha) {
        toast.warning(`Please enter the verification code: ${expectedCaptcha}`);
        return;
      }
      setStep(4);
    }
  };

  const effectiveShippingPrice = deliveryOption === 'EXPRESS' ? shippingPrice + 99 : shippingPrice;
  const grandTotal = totalPrice + (deliveryOption === 'EXPRESS' ? 99 : 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to complete your order');
      navigate('/login?redirect=/checkout');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        orderItems: items.map((item) => ({
          product: item.product?._id || item._id,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          image: item.product?.images?.[0] || item.images?.[0],
          price: item.product?.price || item.price,
          discountPrice: item.product?.discountPrice || item.discountPrice,
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || ''
        })),
        shippingAddress,
        paymentMethod,
        couponCode,
        paymentResult:
          paymentMethod !== 'COD'
            ? {
                id: `DEMO-PAY-${Date.now()}`,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: user.email
              }
            : undefined
      };

      const res = await orderAPI.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate('/order-success', { state: { order: res.order } });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 4-Step Progress Indicator */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary-600 to-accent-600 transition-all duration-500 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  step >= s.num
                    ? 'bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Interactive Forms - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Indian Address Form */}
          {step === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  1. Shipping & Delivery Address (India)
                </h2>
              </div>

              {/* Saved Addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Saved Addresses
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                          selectedAddressId === addr._id
                            ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-bold">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{addr.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.street}</p>
                        <p className="text-xs text-slate-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">📱 {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Indian Address Form Fields */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={shippingAddress.fullName}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={shippingAddress.phone}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, phone: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      House / Flat / Building No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Building B"
                      value={shippingAddress.houseNo}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, houseNo: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Hiranandani Gardens"
                      value={shippingAddress.landmark}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, landmark: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Area / Street / Locality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Palm Grove Avenue, Powai"
                    value={shippingAddress.street}
                    onChange={(e) => {
                      setSelectedAddressId(null);
                      setShippingAddress({ ...shippingAddress, street: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={shippingAddress.city}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, city: e.target.value });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      State *
                    </label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, state: e.target.value });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 400076"
                      maxLength={6}
                      value={shippingAddress.postalCode}
                      onChange={(e) => {
                        setSelectedAddressId(null);
                        setShippingAddress({ ...shippingAddress, postalCode: e.target.value.replace(/\D/g, '') });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-sm shadow-md transition active:scale-95"
                >
                  <span>Continue to Delivery Speed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Speed Options */}
          {step === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  2. Choose Delivery Speed
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setDeliveryOption('STANDARD')}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition ${
                    deliveryOption === 'STANDARD'
                      ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Standard Express Delivery</span>
                    <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                      {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Delivered within 2–4 business days via BlueDart / Delhivery logistics.</p>
                </div>

                <div
                  onClick={() => setDeliveryOption('EXPRESS')}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition ${
                    deliveryOption === 'EXPRESS'
                      ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Superfast Priority Delivery</span>
                    </div>
                    <span className="font-extrabold text-xs text-primary-600 dark:text-primary-400">
                      +{formatPrice(99)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Guaranteed 24-48 hour rush delivery with priority dispatch & packaging.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-sm shadow-md transition active:scale-95"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Indian Payment Options */}
          {step === 3 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  3. Select Indian Payment Method
                </h2>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'UPI_DEMO',
                    label: 'UPI (Google Pay / PhonePe / Paytm)',
                    icon: QrCode,
                    desc: 'Fastest payment with QR or UPI ID'
                  },
                  {
                    id: 'CARD_DEMO',
                    label: 'Credit / Debit Card (RuPay, Visa, MC)',
                    icon: CreditCard,
                    desc: 'Instant online card simulation'
                  },
                  {
                    id: 'NETBANKING_DEMO',
                    label: 'Net Banking (All Indian Banks)',
                    icon: Building2,
                    desc: 'HDFC, SBI, ICICI, Axis, Kotak'
                  },
                  {
                    id: 'COD',
                    label: 'Cash on Delivery (COD)',
                    icon: Truck,
                    desc: 'Pay cash / UPI upon package delivery'
                  }
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition ${
                      paymentMethod === pm.id
                        ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{pm.label}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{pm.desc}</p>
                  </div>
                ))}
              </div>

              {/* Sub-form: UPI Simulator */}
              {paymentMethod === 'UPI_DEMO' && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Instant 1-Click UPI Payment Simulator
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                      Verified Mode
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Enter UPI VPA / ID:
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['@okhdfcbank', '@okaxis', '@oksbi', '@paytm', '@ybl'].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setUpiId(`rahul${handle}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-form: Net Banking */}
              {paymentMethod === 'NETBANKING_DEMO' && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Your Bank:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-bold transition ${
                          selectedBank === bank
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/80 text-primary-600'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-form: COD Captcha */}
              {paymentMethod === 'COD' && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Confirm Cash on Delivery Order</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Please enter the 4-digit code shown below to verify your COD order:
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-xl bg-slate-300 dark:bg-slate-700 text-lg font-mono font-black text-slate-900 dark:text-white tracking-widest select-none">
                      {expectedCaptcha}
                    </span>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 7842"
                      value={codCaptcha}
                      onChange={(e) => setCodCaptcha(e.target.value)}
                      className="w-32 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-center"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-sm shadow-md transition active:scale-95"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Place Order */}
          {step === 4 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-slide-up">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  4. Review & Confirm Order
                </h2>
              </div>

              {/* Delivery & Payment Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Shipping Address</span>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{shippingAddress.fullName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{formatIndianAddress(shippingAddress)}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">Phone: {shippingAddress.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Payment & Delivery</span>
                    <button onClick={() => setStep(3)} className="text-xs font-bold text-primary-600 hover:underline">Edit</button>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod === 'UPI_DEMO' ? `UPI (${upiId})` : 'Instant Online Payment'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Speed: {deliveryOption === 'EXPRESS' ? 'Superfast Priority Delivery (+₹99)' : 'Standard Express Delivery'}
                  </p>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items to be Delivered ({items.length})
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-2">
                  {items.map((item) => {
                    const prod = item.product || item;
                    const price = prod.discountPrice || prod.price;
                    return (
                      <div key={item._id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.images?.[0]}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{prod.name}</h5>
                            <span className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatPrice(price)}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-black text-sm shadow-xl shadow-primary-500/25 transition active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{placingOrder ? 'Confirming Order...' : `Pay ${formatPrice(grandTotal)} & Confirm Order`}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Summary Sidebar - 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Price Summary in ₹
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon & Offers</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {effectiveShippingPrice === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatPrice(effectiveShippingPrice)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(taxPrice)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl text-primary-600 dark:text-primary-400 font-black">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

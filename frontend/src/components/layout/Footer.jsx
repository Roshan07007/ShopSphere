import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  MapPin,
  Phone,
  CreditCard,
  QrCode,
  Sparkles
} from 'lucide-react';
import { contactAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export const Footer = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.warning('Please enter a valid email address');
      return;
    }

    try {
      setSubscribing(true);
      const res = await contactAPI.subscribeNewsletter(email);
      if (res.success) {
        setSubscribed(true);
        toast.success(res.message || 'Subscribed successfully!');
        setEmail('');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Indian Value Propositions */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Free Delivery on ₹999+</h4>
                <p className="text-xs text-slate-400">Express delivery to 19,000+ Indian PIN codes</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Secure & COD</h4>
                <p className="text-xs text-slate-400">Instant UPI, RuPay, NetBanking & Cash on Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">7-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free doorstep pickup & instant refund</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Dedicated Indian Support</h4>
                <p className="text-xs text-slate-400">Customer care in English & Hindi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white shadow-lg">
                <ShoppingBag className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Shop<span className="text-gradient">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier futuristic 3D marketplace for curated electronics, designer apparel, sports footwear, and aesthetic home upgrades.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>BKC Corporate Towers, Bandra East, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 1800-890-SHOP (Toll-Free Helpline)</span>
              </div>
            </div>

            {/* Newsletter Subscription with ₹500 discount incentive */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Get ₹500 OFF Your First Order
              </h5>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Welcome to ShopSphere VIP! Use coupon <strong>WELCOME500</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-bold transition active:scale-95 flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50 shadow-md shadow-primary-500/20"
                  >
                    <span>{subscribing ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=newest" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?isFeatured=true" className="hover:text-white transition">
                  Today's Best Deals
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=popular" className="hover:text-white transition">
                  Trending Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=electronics" className="hover:text-white transition">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fashion" className="hover:text-white transition">
                  Fashion & Ethnic Wear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=footwear" className="hover:text-white transition">
                  Footwear & Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-white transition">
                  Watches & Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-living" className="hover:text-white transition">
                  Home & Living Decor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beauty" className="hover:text-white transition">
                  Beauty & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  My Profile & Addresses
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  24x7 Customer Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About ShopSphere India
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Indian Payment Partner Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-primary-400" /> Supported Payment Partners:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-extrabold text-amber-400">
                UPI (GPay / PhonePe / Paytm)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-blue-400">
                RuPay / Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-purple-400">
                Net Banking (50+ Banks)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-emerald-400">
                Cash on Delivery (COD)
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            GSTIN: 27AABCS1429B1ZX | 100% Tax Compliant
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSphere India Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-400">Shipping & Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

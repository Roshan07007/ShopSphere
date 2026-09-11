import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ShoppingBag,
  TrendingUp,
  Tag,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Gift,
  Copy,
  Check,
  Compass,
  Layers,
  Cpu,
  Radio,
  Eye
} from 'lucide-react';
import { productAPI, categoryAPI, contactAPI } from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import TiltCard from '../components/common/TiltCard.jsx';
import AmbientGlow from '../components/common/AmbientGlow.jsx';
import { ProductGridSkeleton } from '../components/common/Skeleton.jsx';
import { formatPrice } from '../utils/formatPrice.js';
import { useToast } from '../context/ToastContext.jsx';

// 4 Central 3D Orbit Showcase Flagship Products
const ORBIT_SHOWCASE_PRODUCTS = [
  {
    id: 1,
    title: 'Sony WH-1000XM5 ANC',
    subtitle: 'Flagship Noise Cancelling Headphone',
    category: 'Electronics',
    price: 26999,
    originalPrice: 34990,
    discount: '23% OFF',
    rating: 4.9,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    link: '/product/sony-wh-1000xm5-wireless-noise-cancelling-headphones',
    tag: 'Trending in Mumbai & Bengaluru',
    accent: 'from-primary-600 via-indigo-600 to-accent-600'
  },
  {
    id: 2,
    title: 'Apple Watch Ultra 2',
    subtitle: 'Rugged Aerospace Titanium GPS',
    category: 'Wearables',
    price: 74999,
    originalPrice: 89900,
    discount: '17% OFF',
    rating: 5.0,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    link: '/product/apple-watch-ultra-2-gps-cellular',
    tag: 'Bestseller in Delhi NCR',
    accent: 'from-orange-500 via-amber-500 to-rose-500'
  },
  {
    id: 3,
    title: 'Nike Air Jordan 1 Retro',
    subtitle: 'High OG Chicago Edition',
    category: 'Footwear',
    price: 6499,
    originalPrice: 12999,
    discount: '50% OFF',
    rating: 4.8,
    reviews: 2150,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    link: '/product/nike-air-jordan-1-retro-high-og',
    tag: 'Hot Streetwear Drop',
    accent: 'from-rose-600 via-red-600 to-orange-600'
  },
  {
    id: 4,
    title: 'Fujifilm X100VI Pro',
    subtitle: '40.2MP Digital Mirrorless Camera',
    category: 'Photography',
    price: 89999,
    originalPrice: 119999,
    discount: '25% OFF',
    rating: 4.9,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
    link: '/product/fujifilm-x100vi-compact-digital-camera',
    tag: 'Pro Creator Choice',
    accent: 'from-emerald-600 via-teal-600 to-cyan-600'
  }
];

export const HomePage = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [showcase, setShowcase] = useState({
    featured: [],
    trending: [],
    bestSellers: [],
    newArrivals: []
  });
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [activeOrbitIndex, setActiveOrbitIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Flash deals timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 48
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate central orbit showcase
  useEffect(() => {
    const orbitInterval = setInterval(() => {
      setActiveOrbitIndex((prev) => (prev + 1) % ORBIT_SHOWCASE_PRODUCTS.length);
    }, 7000);
    return () => clearInterval(orbitInterval);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, showcaseRes] = await Promise.all([
          categoryAPI.getCategories({ featured: 'true' }),
          productAPI.getShowcase()
        ]);

        if (catRes.success) {
          setCategories(catRes.categories || []);
        }
        if (showcaseRes.success) {
          setShowcase({
            featured: showcaseRes.featured || [],
            trending: showcaseRes.trending || [],
            bestSellers: showcaseRes.bestSellers || [],
            newArrivals: showcaseRes.newArrivals || []
          });
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME500');
    setCopiedCoupon(true);
    toast.success('Coupon code WELCOME500 copied to clipboard!');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.warning('Please enter a valid email address');
      return;
    }

    try {
      setSubscribing(true);
      const res = await contactAPI.subscribeNewsletter(newsletterEmail);
      if (res.success) {
        toast.success(res.message || '🎉 Welcome to ShopSphere VIP Circle!');
        setNewsletterEmail('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const currentOrbit = ORBIT_SHOWCASE_PRODUCTS[activeOrbitIndex];

  // Tab filter
  const tabFilteredProducts =
    activeCategoryTab === 'all'
      ? showcase.featured.length > 0
        ? showcase.featured
        : showcase.trending
      : showcase.featured.filter(
          (p) => p.category?.slug === activeCategoryTab || p.category === activeCategoryTab
        );

  return (
    <div className="space-y-28 pb-28 overflow-hidden">
      
      {/* 1. CENTRAL 3D ORBIT HERO STAGE (COMPLETELY NEW CENTRAL COMPOSITION) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden bg-slate-950 text-white pt-10 pb-20 px-4">
        
        {/* Layered Cyber Mesh Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        {/* Top Central Pill */}
        <div className="relative z-20 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl text-xs font-bold shadow-2xl mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">India 3D Shopping Universe</span>
          <span className="px-2 py-0.2 rounded-full bg-gradient-to-r from-saffron-500 to-amber-500 text-slate-950 font-black text-[10px]">
            ₹ INR CATALOG
          </span>
        </div>

        {/* Central Headline */}
        <div className="relative z-20 max-w-4xl mx-auto space-y-4 mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Discover Next-Gen Gear In <br />
            <span className="text-gradient">Immersive 3D Space</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience realistic perspective shopping tailored for India. Zero-fee Cash on Delivery, instant UPI payment, and express courier dispatch.
          </p>
        </div>

        {/* CENTRAL 3D STAGE VISUALIZER */}
        <div className="relative z-20 w-full max-w-5xl mx-auto my-6 perspective-1500">
          
          {/* Orbital Glowing Rings Base */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] md:w-[680px] h-[340px] sm:h-[540px] md:h-[680px] rounded-full border border-primary-500/20 border-dashed animate-spin [animation-duration:40s] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[420px] md:w-[520px] h-[260px] sm:h-[420px] md:h-[520px] rounded-full border border-accent-500/25 pointer-events-none" />

          {/* Central Active Hero Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOrbit.id}
              initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mx-auto max-w-lg sm:max-w-xl preserve-3d"
            >
              <TiltCard maxTilt={12} scaleOnHover={1.02}>
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-primary-500/20 backdrop-blur-2xl">
                  
                  {/* Top Product Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 font-extrabold text-xs">
                      {currentOrbit.tag}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{currentOrbit.rating}</span>
                      <span className="text-slate-400 text-[10px]">({currentOrbit.reviews})</span>
                    </div>
                  </div>

                  {/* Central Product Image Canvas */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950/60 p-4 flex items-center justify-center my-3 group">
                    <img
                      src={currentOrbit.image}
                      alt={currentOrbit.title}
                      className="max-h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700"
                    />
                  </div>

                  {/* Product Details & Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">
                        {currentOrbit.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {currentOrbit.title}
                      </h3>
                      <div className="flex items-baseline gap-2.5 mt-1">
                        <span className="text-xl sm:text-2xl font-black text-emerald-400">
                          {formatPrice(currentOrbit.price)}
                        </span>
                        <span className="line-through text-xs text-slate-400">
                          {formatPrice(currentOrbit.originalPrice)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          {currentOrbit.discount}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={currentOrbit.link}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs shadow-lg shadow-primary-500/30 transition active:scale-95 flex-shrink-0"
                    >
                      <span>Explore In 3D</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>

          {/* SATELLITE FLOATING PODS (SURROUNDING AT DIFFERENT DEPTHS) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {ORBIT_SHOWCASE_PRODUCTS.map((item, idx) => {
              if (idx === activeOrbitIndex) return null;
              const positions = [
                'top-0 -left-20 translate-z-30',
                'top-0 -right-20 translate-z-20',
                'bottom-10 -left-16 translate-z-40',
                'bottom-10 -right-16 translate-z-30'
              ];
              const posClass = positions[idx % positions.length];

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveOrbitIndex(idx)}
                  className={`pointer-events-auto absolute ${posClass} w-52 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl hover:scale-105 transition cursor-pointer group text-left animate-float-slow`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-800"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-primary-400 uppercase truncate">
                        {item.category}
                      </p>
                      <h4 className="text-xs font-black text-white truncate group-hover:text-primary-400 transition">
                        {item.title}
                      </h4>
                      <span className="text-xs font-bold text-emerald-400">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orbit Radial Selector Controls */}
        <div className="relative z-20 flex items-center justify-center gap-2 mt-4">
          {ORBIT_SHOWCASE_PRODUCTS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveOrbitIndex(idx)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeOrbitIndex === idx
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeOrbitIndex === idx ? 'bg-white' : 'bg-slate-600'}`} />
              <span className="hidden sm:inline">{item.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Quick CTA Actions */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm shadow-2xl transition hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-primary-600" />
            <span>Enter Shop Catalog</span>
          </Link>

          <Link
            to="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm backdrop-blur-xl transition active:scale-95"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Browse Spheres</span>
          </Link>
        </div>

      </section>

      {/* 2. CURATED SPHERES (CATEGORY CAPSULE PORTALS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Spheres</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Collections
            </h2>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline group"
          >
            <span>All Departments</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3D Asymmetric Capsules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat, idx) => (
            <TiltCard key={cat._id} maxTilt={10} scaleOnHover={1.04}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-xl block border border-slate-200/60 dark:border-slate-800"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent group-hover:from-primary-950/90 transition-colors duration-300" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold text-primary-300 uppercase tracking-wider block">
                    {cat.itemCount || 0} Products in ₹
                  </span>
                  <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight mt-0.5">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 3. CYBER FLASH DROPS (SPLIT ANGLED DESIGN WITH LIVE COUNTDOWN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-primary-950/70 to-slate-950 border border-primary-500/30 text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span>Cyber Flash Drops</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Limited Drops Up to 50% Off
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Special festival pricing on high-demand electronics, footwear & luxury timepieces.
              </p>
            </div>

            {/* Live Ticker */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md border border-white/15">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex items-center gap-1.5 text-center font-mono">
                <div className="bg-black/60 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Hrs</span>
                </div>
                <span className="font-bold text-amber-400 text-lg">:</span>
                <div className="bg-black/60 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Min</span>
                </div>
                <span className="font-bold text-amber-400 text-lg">:</span>
                <div className="bg-black/60 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {showcase.bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. FEATURED CATALOG WITH ASYMMETRICAL SPOTLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Indian Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Trending Collections
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategoryTab === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Items
            </button>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategoryTab(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategoryTab === cat.slug
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with Interwoven Spotlight */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tabFilteredProducts.slice(0, 8).map((product, idx) => {
              // Render 3rd product as a full-span spotlight card in desktop view
              if (idx === 2 && tabFilteredProducts.length > 3) {
                return (
                  <div key={product._id} className="sm:col-span-2 lg:col-span-2">
                    <ProductCard product={product} variant="spotlight" />
                  </div>
                );
              }
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        )}

        <div className="text-center pt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-sm shadow-xl transition hover:scale-105 active:scale-95"
          >
            <span>View Full Shop Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. INDIAN TRUST ARCHITECTURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
            Indian Shopping Ecosystem
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Shop With Us in India?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered specifically for Indian shoppers with high trust, rapid logistics, and seamless digital payments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TiltCard maxTilt={8} scaleOnHover={1.03}>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Express Metro Delivery
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  24–48h fulfillment across Mumbai, Delhi NCR, Bengaluru, Kolkata, Chennai & Pune.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Free Above ₹999</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} scaleOnHover={1.03}>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Instant UPI & Zero-Fee COD
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pay with GPay, PhonePe, Paytm, RuPay, or Cash upon delivery at no extra charge.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1-Click Payment</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} scaleOnHover={1.03}>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  7-Day Doorstep Returns
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Hassle-free reverse pickup from your registered address with instant refund.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Free Reverse Pickup</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} scaleOnHover={1.03}>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all space-y-4 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  100% Genuine & GST Invoiced
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Official manufacturer warranty and compliant 18% GST tax invoices for business.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Official Warranty</span>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 6. VIP MEMBERSHIP VOUCHER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-950 via-primary-950 to-slate-950 border border-white/10 text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-primary-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 text-xs font-black uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5" />
                <span>Welcome Bonus For Indian Shoppers</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Unlock ₹500 Off Your First Order
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Join 50,000+ members receiving private drop access, festive flash sales, and instant discount vouchers across our catalog.
              </p>

              {/* Coupon Code Graphic */}
              <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <span className="text-xs font-semibold text-slate-300">Use Code:</span>
                <span className="font-mono font-black text-sm text-amber-300 tracking-wider">WELCOME500</span>
                <button
                  onClick={handleCopyCoupon}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
                  title="Copy code"
                >
                  {copiedCoupon ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-slate-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-black text-sm shadow-lg shadow-primary-500/30 transition active:scale-98 disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Claim ₹500 Voucher & Join VIP Circle'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Users,
  Target,
  Award,
  ArrowRight,
  Building2,
  CheckCircle2,
  Zap,
  Globe2
} from 'lucide-react';
import { AmbientGlow } from '../components/common/AmbientGlow.jsx';

const AboutPage = () => {
  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <AmbientGlow />

      {/* Hero Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision & Heritage</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Redefining Modern Luxury & 3D E-Commerce for India
        </h1>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Founded in Mumbai with fulfillment hubs across Bengaluru and Delhi NCR, ShopSphere curates high-performance electronics, flagship streetwear, handcrafted footwear, and modern home essentials with an immersive 3D shopping interface.
        </p>
      </div>

      {/* Hero Visual Banner with Ambient 3D Depth */}
      <div className="relative z-10 rounded-3xl overflow-hidden aspect-[21/9] bg-slate-900 shadow-2xl border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="ShopSphere India Studio Hub"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <span className="text-xs uppercase font-bold tracking-widest text-primary-300">
              Pan-India Supply Infrastructure
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Delivering to Over 19,000+ Indian PIN Codes
            </h2>
          </div>
          <Link
            to="/shop"
            className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition active:scale-95"
          >
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Core Pillars 3-Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            To provide Indian consumers direct access to genuine, verified luxury products through high-speed technology, realistic 3D previews, and localized pricing in INR.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-accent-50 dark:bg-accent-950/60 flex items-center justify-center text-accent-600 dark:text-accent-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">100% Certified Authentic</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Every product in our catalog comes directly from brand-authorized distributors with complete manufacturer warranty, GST invoice, and sealed packaging.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Metro Speed Logistics</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Integrated with premier Indian logistics carriers to ensure seamless 24-48 hour fulfillment across Mumbai, Delhi NCR, Bengaluru, and major metro regions.
          </p>
        </div>
      </div>

      {/* Metrics Counter Section */}
      <div className="relative z-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-primary-950 via-slate-900 to-accent-950 text-white border border-white/10 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">50,000+</div>
            <div className="text-xs text-slate-300">Satisfied Indian Shoppers</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">19,000+</div>
            <div className="text-xs text-slate-300">PIN Codes Covered</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">100%</div>
            <div className="text-xs text-slate-300">GSTIN Compliant Billing</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">4.9 / 5</div>
            <div className="text-xs text-slate-300">Customer Rating</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;

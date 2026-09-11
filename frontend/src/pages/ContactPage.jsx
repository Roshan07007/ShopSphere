import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Headphones
} from 'lucide-react';
import { contactAPI } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { AmbientGlow } from '../components/common/AmbientGlow.jsx';

const faqs = [
  {
    q: 'What is the delivery time across Indian cities and pin codes?',
    a: 'Orders in major metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) are delivered within 24 to 48 hours. Other Tier-2 and Tier-3 pincodes across India arrive within 3 to 4 business days.'
  },
  {
    q: 'How does Cash on Delivery (COD) and UPI on Delivery work?',
    a: 'You can select Cash on Delivery at checkout with zero extra processing fee. When our courier partner arrives, you can pay via physical cash or scan the dynamic UPI QR code on their delivery terminal using GPay, PhonePe, or Paytm.'
  },
  {
    q: 'What is your Indian return and doorstep exchange policy?',
    a: 'We provide a 7-day hassle-free return window for all unused products with original tags and packaging. Our courier team provides free doorstep reverse pickup from your registered Indian address.'
  },
  {
    q: 'Can I request a B2B Tax Invoice with my company GSTIN number?',
    a: 'Yes! All orders include an official GST tax invoice itemizing 18% GST. You can enter your GSTIN during checkout or contact support with your order reference to obtain an amended business invoice.'
  }
];

const ContactPage = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await contactAPI.submitContact(form);
      if (res.success) {
        toast.success(res.message || 'Thank you! Your inquiry has been sent to our Mumbai concierge team.');
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <AmbientGlow />

      {/* Hero Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
          <Headphones className="w-3.5 h-3.5" />
          <span>24/7 Dedicated Indian Concierge</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How Can We Help You Today?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Reach our dedicated Mumbai & Bengaluru customer care desks for assistance with orders, custom sizing, corporate gifting, or product warranties.
        </p>
      </div>

      {/* 3 Indian Hubs Contact Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Mumbai Headquarters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Level 8, Maker Maxity, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
          </p>
          <div className="pt-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
            +91 (022) 6789-0123
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-50 dark:bg-accent-950/60 text-accent-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Bengaluru Innovation Hub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tech Park Phase 2, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038
          </p>
          <div className="pt-2 text-xs font-semibold text-accent-600 dark:text-accent-400">
            +91 (080) 4567-8901
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Direct Concierge Desks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Customer Care: support@shopsphere.in<br />
            Business & GST: b2b@shopsphere.in
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Toll-Free: 1800-120-7743
          </div>
        </div>
      </div>

      {/* Form & FAQ Split */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form (6 Cols) */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Send a Direct Message
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Our priority support executive typically responds within 2 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aryan Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Order Delivery Query / GST Invoice Assistance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Message *
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can our support team assist you?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending Message...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>

        {/* FAQs (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Quick answers regarding Indian dispatch times, COD payments, returns, and GST billing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-primary-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-primary-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;

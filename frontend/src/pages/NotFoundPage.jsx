import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6 max-w-md mx-auto animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
        <Compass className="w-12 h-12 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          404
        </span>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
        <Link
          to="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition active:scale-95"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/shop"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Store</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

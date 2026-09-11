import React, { useState } from 'react';
import { Filter, RotateCcw, Star, Check, X, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice.js';

export const ProductFilters = ({
  categories = [],
  brands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrands = [],
  onToggleBrand,
  priceRange,
  onChangePriceRange,
  selectedRating,
  onSelectRating,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
  isOpen = false,
  onClose = () => {}
}) => {
  return (
    <>
      {/* Floating Filter HUD Drawer / Slide-Over Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between animate-slide-up">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    Filter Catalog
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Range Filter in INR */}
              <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Max Price Limit (INR)
                  </h4>
                  <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                    {formatPrice(priceRange.max)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => onChangePriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>₹500</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Brands Filter */}
              {brands.length > 0 && (
                <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Brands ({brands.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {brands.map((brand) => {
                      const isChecked = selectedBrands.includes(brand);
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => onToggleBrand(brand)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                            isChecked
                              ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-transparent'
                          }`}
                        >
                          <span className="truncate">{brand}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rating Filter */}
              <div className="py-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Customer Rating
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => onSelectRating(selectedRating === stars ? null : stars)}
                      className={`flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
                        selectedRating === stars
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{stars}★ & Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Toggle */}
              <div className="py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Show In Stock Items Only
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onToggleInStock(e.target.checked)}
                  className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500/30 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  onResetFilters();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Reset All
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-primary-600 hover:bg-primary-500 text-xs font-black text-white shadow-md shadow-primary-500/20 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;

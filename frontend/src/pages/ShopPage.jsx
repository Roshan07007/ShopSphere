import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Grid,
  List,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Zap,
  Check,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import { ProductGridSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import AmbientGlow from '../components/common/AmbientGlow.jsx';
import { formatPrice } from '../utils/formatPrice.js';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const selectedCategory = searchParams.get('category') || 'all';
  const sortOption = searchParams.get('sort') || 'newest';
  const searchKeyword = searchParams.get('search') || searchParams.get('q') || '';
  const isFeatured = searchParams.get('isFeatured') === 'true';

  const [priceRange, setPriceRange] = useState({
    max: Number(searchParams.get('maxPrice')) || 100000
  });
  const [selectedBrands, setSelectedBrands] = useState(() => {
    const b = searchParams.get('brand');
    return b ? b.split(',') : [];
  });
  const [selectedRating, setSelectedRating] = useState(() => {
    const r = searchParams.get('rating');
    return r ? Number(r) : null;
  });
  const [inStockOnly, setInStockOnly] = useState(() => {
    return searchParams.get('inStock') === 'true';
  });

  const [viewMode, setViewMode] = useState('asymmetric'); // 'asymmetric', 'grid', 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load Categories & Brands
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryAPI.getCategories(),
          productAPI.getBrands()
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (brandRes.success) setBrands(brandRes.brands || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadMeta();
  }, []);

  // Sync state to URL Params
  const updateURLParams = useCallback(
    (newParams) => {
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...newParams };

      // Clean empty keys
      Object.keys(merged).forEach((key) => {
        if (!merged[key] || merged[key] === 'all' || merged[key] === 'false') {
          delete merged[key];
        }
      });

      setSearchParams(merged);
    },
    [searchParams, setSearchParams]
  );

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 12,
        sort: sortOption
      };

      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchKeyword) {
        params.search = searchKeyword;
      }
      if (isFeatured) {
        params.isFeatured = 'true';
      }
      if (priceRange.max < 100000) {
        params.maxPrice = priceRange.max;
      }
      if (selectedBrands.length > 0) {
        params.brand = selectedBrands.join(',');
      }
      if (selectedRating) {
        params.rating = selectedRating;
      }
      if (inStockOnly) {
        params.inStock = 'true';
      }

      const res = await productAPI.getProducts(params);

      if (res.success) {
        setProducts(res.products || []);
        setPages(res.pages || 1);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    sortOption,
    selectedCategory,
    searchKeyword,
    isFeatured,
    priceRange.max,
    selectedBrands,
    selectedRating,
    inStockOnly
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter Handlers
  const handleCategoryChange = (catSlug) => {
    setPage(1);
    updateURLParams({ category: catSlug, page: 1 });
  };

  const handleSortChange = (newSort) => {
    setPage(1);
    updateURLParams({ sort: newSort, page: 1 });
  };

  const handlePriceChange = (maxPrice) => {
    setPriceRange({ max: maxPrice });
    setPage(1);
    updateURLParams({ maxPrice: maxPrice < 100000 ? maxPrice : undefined, page: 1 });
  };

  const handleToggleBrand = (brandName) => {
    const nextBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    setSelectedBrands(nextBrands);
    setPage(1);
    updateURLParams({ brand: nextBrands.join(','), page: 1 });
  };

  const handleRatingChange = (stars) => {
    setSelectedRating(stars);
    setPage(1);
    updateURLParams({ rating: stars || undefined, page: 1 });
  };

  const handleInStockChange = (checked) => {
    setInStockOnly(checked);
    setPage(1);
    updateURLParams({ inStock: checked ? 'true' : undefined, page: 1 });
  };

  const handleResetFilters = () => {
    setPriceRange({ max: 100000 });
    setSelectedBrands([]);
    setSelectedRating(null);
    setInStockOnly(false);
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
    updateURLParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build active filters
  const activeFilters = [];
  if (selectedCategory && selectedCategory !== 'all') {
    const catName = categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;
    activeFilters.push({ label: `Category: ${catName}`, onRemove: () => handleCategoryChange('all') });
  }
  if (searchKeyword) {
    activeFilters.push({ label: `Search: "${searchKeyword}"`, onRemove: () => updateURLParams({ search: '', q: '' }) });
  }
  if (priceRange.max < 100000) {
    activeFilters.push({ label: `Under ₹${priceRange.max.toLocaleString('en-IN')}`, onRemove: () => handlePriceChange(100000) });
  }
  selectedBrands.forEach((b) => {
    activeFilters.push({ label: `Brand: ${b}`, onRemove: () => handleToggleBrand(b) });
  });
  if (selectedRating) {
    activeFilters.push({ label: `${selectedRating}★ & Up`, onRemove: () => handleRatingChange(null) });
  }
  if (inStockOnly) {
    activeFilters.push({ label: 'In Stock Only', onRemove: () => handleInStockChange(false) });
  }

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchKeyword ? 1 : 0) +
    (priceRange.max < 100000 ? 1 : 0) +
    selectedBrands.length +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="relative min-h-[90vh] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AmbientGlow />

      {/* 1. TOP FLOATING CYBER CONTROL DOCK */}
      <div className="relative z-20 space-y-4">
        
        {/* Title & Stats Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Futuristic Indian Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {searchKeyword
                ? `Results for "${searchKeyword}"`
                : selectedCategory && selectedCategory !== 'all'
                ? categories.find((c) => c.slug === selectedCategory)?.name || 'Department'
                : 'Immersive Shop Catalog'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700">
              <strong className="text-primary-600 dark:text-primary-400">{total}</strong> Products in ₹ INR
            </span>
          </div>
        </div>

        {/* Floating Category Navigation Capsules Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Spheres</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span className="text-[10px] opacity-75 font-mono">({cat.itemCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Floating Control HUD (Filter Trigger + Sorting + View Modes) */}
        <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Filter HUD Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition active:scale-95 shadow-md"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary-400 dark:text-primary-600" />
              <span>Filters HUD</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Price Buttons */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => handlePriceChange(5000)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                  priceRange.max === 5000
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 border border-primary-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                &lt; ₹5,000
              </button>
              <button
                onClick={() => handlePriceChange(25000)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                  priceRange.max === 25000
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 border border-primary-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                &lt; ₹25,000
              </button>
            </div>
          </div>

          {/* Right: Sorting Dial & Layout Switchers */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High (₹)</option>
                <option value="price_desc">Price: High to Low (₹)</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('asymmetric')}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'asymmetric'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Editorial Asymmetric Layout"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Standard 3D Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Active Filter Badges */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400">Active:</span>
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-bold text-primary-700 dark:text-primary-300 shadow-sm"
              >
                <span>{f.label}</span>
                <button
                  onClick={f.onRemove}
                  className="hover:text-rose-600 transition"
                  aria-label="Remove filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* 2. MAIN CATALOG SHOWCASE (EDITORIAL ASYMMETRIC MASONRY / 3D GRID) */}
      <div className="relative z-10">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-sm">
            <EmptyState
              type="search"
              title="No Matching Products in ₹"
              description="Try adjusting your filters, widening the INR price slider, or choosing another category."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          </div>
        ) : viewMode === 'asymmetric' ? (
          /* EDITORIAL ASYMMETRIC MASONRY LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, idx) => {
              // Interweave large spotlight drops on every 5th card
              if (idx % 5 === 2 && products.length > 3) {
                return (
                  <div key={product._id} className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
                    <ProductCard product={product} variant="spotlight" />
                  </div>
                );
              }
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        ) : (
          /* STANDARD 3D GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* 3. 3D PAGINATION CONTROLS */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-12">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-11 h-11 rounded-2xl text-xs font-black transition shadow-sm ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-primary-600 to-accent-600 text-white shadow-primary-500/30 shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pages}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 transition shadow-sm"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Filter Drawer HUD */}
      <ProductFilters
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        selectedBrands={selectedBrands}
        onToggleBrand={handleToggleBrand}
        priceRange={priceRange}
        onChangePriceRange={handlePriceChange}
        selectedRating={selectedRating}
        onSelectRating={handleRatingChange}
        inStockOnly={inStockOnly}
        onToggleInStock={handleInStockChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default ShopPage;

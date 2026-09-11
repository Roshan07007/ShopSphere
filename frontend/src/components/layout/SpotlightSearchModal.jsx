import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, TrendingUp, Tag, ShieldCheck, ChevronRight } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import { formatPrice } from '../../utils/formatPrice.js';

export const SpotlightSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const trendingSearches = [
    'Sony WH-1000XM5',
    'Apple Watch Ultra',
    'Nike Air Jordan',
    'Fujifilm X100VI',
    'Bose QuietComfort',
    'Mechanical Keyboard'
  ];

  const quickCategories = [
    { name: 'Electronics', slug: 'electronics', icon: '⚡' },
    { name: 'Fashion', slug: 'fashion', icon: '✨' },
    { name: 'Footwear', slug: 'footwear', icon: '👟' },
    { name: 'Home & Living', slug: 'home-living', icon: '🏠' },
    { name: 'Beauty & Wellness', slug: 'beauty-grooming', icon: '💎' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProducts({ search: query.trim(), limit: 6 });
        setResults(res.products || []);
      } catch (err) {
        console.error('Spotlight search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (prod) => {
    onClose();
    navigate(`/product/${prod.slug || prod._id}`);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4">
      {/* Backdrop with deep blur */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Spotlight Command Palette Card */}
      <div className="relative w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-primary-500/10 overflow-hidden z-10 animate-slide-up">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mr-4">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories in ₹ INR... (Press Enter)"
            className="w-full bg-transparent text-lg md:text-xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
            <span>ESC</span>
          </div>
        </form>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {/* Live Search Results */}
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {loading ? 'Searching Catalog...' : `Found (${results.length}) Products`}
                </span>
                {results.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    View all in Shop <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-2 py-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No products matched "<span className="text-primary-600">{query}</span>"
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Try searching by brand like "Sony", "Apple", "Nike", or category.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((prod) => {
                    const price = prod.discountPrice || prod.price;
                    const image = prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';
                    return (
                      <div
                        key={prod._id}
                        onClick={() => handleSelectProduct(prod)}
                        className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700/60 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              {prod.category?.name || 'Category'} {prod.brand ? `• ${prod.brand}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pl-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {formatPrice(price)}
                            </span>
                            {prod.discountPrice && (
                              <span className="block text-[11px] text-emerald-600 font-bold">
                                Save {formatPrice(prod.price - prod.discountPrice)}
                              </span>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Quick Categories Spheres */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                  Explore Departments
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {quickCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        onClose();
                        navigate(`/shop?category=${cat.slug}`);
                      }}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-primary-50 dark:hover:bg-primary-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700/60 transition group text-center"
                    >
                      <span className="text-xl mb-1 group-hover:scale-110 transition">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Trending in India
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setQuery(item);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-primary-500 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indian Shopping Guarantees */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center justify-center gap-1">
                  ⚡ Free Shipping on ₹999+
                </span>
                <span className="flex items-center justify-center gap-1">
                  🛡️ 100% Genuine Products
                </span>
                <span className="flex items-center justify-center gap-1">
                  🇮🇳 UPI & COD Available
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightSearchModal;

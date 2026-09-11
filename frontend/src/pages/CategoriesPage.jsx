import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FolderTree, Sparkles, Compass } from 'lucide-react';
import { categoryAPI } from '../services/api.js';
import { LoadingPage } from '../components/common/Spinner.jsx';
import TiltCard from '../components/common/TiltCard.jsx';
import AmbientGlow from '../components/common/AmbientGlow.jsx';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <LoadingPage text="Loading Indian store departments..." />;

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <AmbientGlow />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>Curated Spheres & Portals</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Browse Department Spheres
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover our handpicked departments featuring authentic flagship electronics, runway fashion, performance footwear, and contemporary Indian home living in ₹ INR.
        </p>
      </div>

      {/* Categories Grid with 3D TiltCards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <TiltCard
            key={cat._id}
            maxTilt={10}
            scaleOnHover={1.03}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/80 dark:border-slate-800"
          >
            <Link to={`/shop?category=${cat.slug}`} className="block w-full h-full">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent group-hover:from-primary-950/95 transition-colors" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                    {cat.name}
                  </h3>
                  <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary-600 group-hover:scale-110 transition-all shadow-lg">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                  {cat.description || 'Explore premium collections and bestsellers.'}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-md text-[11px] font-bold text-slate-200">
                    {cat.itemCount || 0} Products In Stock
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>INR Offers Active</span>
                  </span>
                </div>
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>

    </div>
  );
};

export default CategoriesPage;

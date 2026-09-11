import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Check, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StarRating from '../components/common/StarRating.jsx';
import { TiltCard } from '../components/common/TiltCard.jsx';
import { formatPrice, calculateDiscountPercentage } from '../utils/formatPrice.js';
import { AmbientGlow } from '../components/common/AmbientGlow.jsx';

const WishlistPage = () => {
  const { items, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      addToCart(product, 1);
      removeFromWishlist(product._id);
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          type="wishlist"
          title="Your Wishlist is Empty"
          description="Save items you love by clicking the heart icon on any product. Access them anytime from your personalized Indian wishlist."
          actionText="Discover Trending Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <AmbientGlow />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Saved Collections</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            You have saved <strong className="text-slate-900 dark:text-white font-bold">{items.length}</strong> {items.length === 1 ? 'item' : 'items'} in your wishlist.
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary-500/20 transition active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Wishlist Grid with 3D Tilt */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const price = product.price;
          const discountPrice = product.discountPrice;
          const hasDiscount = discountPrice && discountPrice < price;
          const discountPercent = hasDiscount ? calculateDiscountPercentage(price, discountPrice) : 0;
          const image =
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

          return (
            <TiltCard
              key={product._id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Link to={`/product/${product.slug || product._id}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {hasDiscount && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-extrabold shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-600 shadow-md hover:scale-110 active:scale-95 transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Details & Move To Cart */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <Link
                    to={`/product/${product.slug || product._id}`}
                    className="block text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary-600 dark:hover:text-primary-400 transition mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-1.5">
                    <StarRating rating={product.rating || 5} size="sm" showNumber={false} />
                    <span className="text-[11px] text-slate-400">({product.numReviews || 12})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {formatPrice(hasDiscount ? discountPrice : price)}
                    </span>
                    {hasDiscount && (
                      <span className="block text-xs text-slate-400 line-through">
                        {formatPrice(price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => moveToCart(product)}
                    disabled={product.stock <= 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

    </div>
  );
};

export default WishlistPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, Eye, Zap, Plus, Minus, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { formatPrice, calculateDiscount } from '../../utils/formatPrice.js';
import TiltCard from '../common/TiltCard.jsx';
import QuickViewModal from './QuickViewModal.jsx';

export const ProductCard = ({ product, variant = 'standard' }) => {
  const { addToCart, updateQuantity, removeFromCart, getCartItem, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const cartItem = getCartItem(product._id);
  const cartQty = getItemQuantity(product._id);
  const isInCart = cartQty > 0;

  const price = product.price;
  const discountPrice = product.discountPrice;
  const discountPercent = calculateDiscount(price, discountPrice);
  const isOutOfStock = product.stock <= 0;

  const image =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, product.colors?.[0] || '', product.sizes?.[0] || '', false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartQty < product.stock) {
        updateQuantity(cartItem._id, cartQty + 1);
      }
    } else {
      addToCart(product, 1, product.colors?.[0] || '', product.sizes?.[0] || '', false);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartQty <= 1) {
        removeFromCart(cartItem._id);
      } else {
        updateQuantity(cartItem._id, cartQty - 1);
      }
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  // SPOTLIGHT VARIANT (Used for Featured Hero Drops)
  if (variant === 'spotlight') {
    return (
      <>
        <TiltCard maxTilt={6} scaleOnHover={1.02}>
          <div className="group relative bg-gradient-to-br from-slate-900/95 via-primary-950/40 to-slate-950/95 backdrop-blur-2xl rounded-3xl border border-primary-500/30 p-6 sm:p-8 shadow-2xl shadow-primary-500/10 hover:border-primary-400 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 overflow-hidden h-full">
            
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/30 transition-all" />
            
            <div className="flex-1 min-w-0 z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    ⭐ Spotlight Drop
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">
                  {product.brand}
                </p>
                <Link
                  to={`/product/${product.slug || product._id}`}
                  className="text-xl sm:text-2xl font-black text-white line-clamp-2 hover:text-primary-400 transition mb-2"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-slate-300 line-clamp-2 font-normal">
                  {product.description}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {formatPrice(discountPrice || price)}
                  </span>
                  {discountPrice && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isInCart ? (
                    <div className="flex-1 flex items-center justify-between bg-primary-600/90 rounded-2xl p-1 px-3 border border-primary-400 shadow-md">
                      <button
                        onClick={handleDecrement}
                        className="p-2 text-white hover:bg-white/20 rounded-xl transition"
                        title="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-black text-white px-2">
                        {cartQty} in Bag
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={cartQty >= product.stock}
                        className="p-2 text-white hover:bg-white/20 rounded-xl transition disabled:opacity-40"
                        title="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAdd}
                      disabled={isOutOfStock}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-primary-500/30 transition active:scale-95 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-2xl border transition-all ${
                      isFavorited
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    onClick={handleQuickView}
                    className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                    aria-label="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-56 lg:w-64 aspect-square flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-800/80 border border-slate-700/80 p-2 shadow-2xl relative">
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </TiltCard>

        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      </>
    );
  }

  // STANDARD E-COMMERCE PRODUCT CARD
  return (
    <>
      <TiltCard maxTilt={8} scaleOnHover={1.02}>
        <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 flex flex-col justify-between h-full p-4 overflow-hidden">
          
          {/* Top Section: Image, Badges & Wishlist */}
          <div className="relative">
            {/* Image Box */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 p-2 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-950/20 transition-colors">
              <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </Link>

              {/* Badges on Top-Left */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {isOutOfStock ? (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow">
                    Out of Stock
                  </span>
                ) : (
                  <>
                    {discountPercent > 0 && (
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-500 text-white font-black text-[10px] tracking-tight shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[9px] uppercase tracking-tight shadow-sm">
                        Bestseller
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[9px] uppercase tracking-tight shadow-sm">
                        New
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Wishlist Button on Top-Right Corner */}
              <button
                onClick={handleWishlist}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 z-10 ${
                  isFavorited
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
                }`}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
              </button>

              {/* Quick Look Preview Button */}
              <button
                onClick={handleQuickView}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md text-[10px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
              >
                <Eye className="w-3 h-3" /> Quick Look
              </button>
            </div>
          </div>

          {/* Middle Section: Details */}
          <div className="my-3 flex-1 flex flex-col justify-between space-y-2">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-1 text-[11px] mb-1 font-bold">
                <span className="text-primary-600 dark:text-primary-400 uppercase tracking-widest text-[10px] truncate">
                  {product.brand || product.category?.name || 'ShopSphere'}
                </span>
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating?.toFixed(1) || '4.8'}</span>
                  <span className="text-slate-400 text-[10px]">({product.numReviews || 0})</span>
                </div>
              </div>

              {/* Title */}
              <Link
                to={`/product/${product.slug || product._id}`}
                className="block text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition leading-snug"
              >
                {product.name}
              </Link>
            </div>

            {/* Price & Delivery Information */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {formatPrice(discountPrice || price)}
                </span>
                {discountPrice && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Truck className="w-3 h-3" />
                <span>{product.stock > 0 ? 'Free Delivery above ₹999' : 'Out of Stock'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Section: Naturally Positioned Full-Width Add to Cart & Inline Quantity Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isInCart ? (
              <div className="w-full flex items-center justify-between bg-primary-50 dark:bg-primary-950/80 border border-primary-200 dark:border-primary-800 rounded-2xl p-1 px-2">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shadow-sm transition active:scale-95"
                  title="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                    {cartQty} in Bag
                  </span>
                </div>
                <button
                  onClick={handleIncrement}
                  disabled={cartQty >= product.stock}
                  className="w-8 h-8 rounded-xl bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center shadow-sm transition active:scale-95 disabled:opacity-40"
                  title="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-extrabold text-xs transition-all duration-200 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-slate-950 shadow-sm'
                }`}
                aria-label={`Add ${product.name} to cart`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </TiltCard>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;

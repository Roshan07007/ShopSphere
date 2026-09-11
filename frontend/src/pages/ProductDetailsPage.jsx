import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Share2,
  PackageCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { productAPI } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ReviewSection from '../components/product/ReviewSection.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import TiltCard from '../components/common/TiltCard.jsx';
import AmbientGlow from '../components/common/AmbientGlow.jsx';
import { LoadingPage } from '../components/common/Spinner.jsx';
import { formatPrice, calculateDiscount, isValidIndianPincode } from '../utils/formatPrice.js';

export const ProductDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs');

  // Indian Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getProduct(identifier);
        if (res.success && res.product) {
          const prod = res.product;
          setProduct(prod);
          setRelatedProducts(res.relatedProducts || []);
          setSelectedImage(0);
          setSelectedColor(prod.colors?.[0] || '');
          setSelectedSize(prod.sizes?.[0] || '');
          setQuantity(1);

          // Save to recently viewed in localStorage
          try {
            const raw = localStorage.getItem('shopsphere_recent');
            let list = raw ? JSON.parse(raw) : [];
            list = list.filter((p) => p._id !== prod._id);
            list.unshift({
              _id: prod._id,
              name: prod.name,
              slug: prod.slug,
              price: prod.price,
              discountPrice: prod.discountPrice,
              images: prod.images,
              brand: prod.brand,
              rating: prod.rating,
              stock: prod.stock
            });
            localStorage.setItem('shopsphere_recent', JSON.stringify(list.slice(0, 5)));
            setRecentlyViewed(list.slice(1, 5));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [identifier, navigate, toast]);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!isValidIndianPincode(pincode)) {
      toast.warning('Please enter a valid 6-digit Indian PIN code');
      setPincodeStatus(null);
      return;
    }

    const days = ['Thursday', 'Friday', 'Saturday', 'Monday', 'Tuesday'];
    const randomDay = days[Math.floor(Math.random() * days.length)];

    setPincodeStatus({
      valid: true,
      day: randomDay,
      pin: pincode
    });
    toast.success(`Express Delivery available to PIN: ${pincode}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Product link copied to clipboard!');
    }
  };

  if (loading || !product) {
    return <LoadingPage text="Loading 3D Product Theater..." />;
  }

  const isFavorited = isInWishlist(product._id);
  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = calculateDiscount(price, discountPrice);
  const currentImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success(`Added ${quantity}x ${product.name} to your bag!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="relative min-h-[90vh] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <AmbientGlow />

      {/* Navigation Breadcrumb */}
      <nav className="relative z-10 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1">
        <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition font-bold">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/shop" className="hover:text-primary-600 dark:hover:text-primary-400 transition font-bold">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {product.category && (
          <>
            <Link
              to={`/shop?category=${product.category.slug || product.category}`}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition font-bold capitalize"
            >
              {product.category.name || product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-900 dark:text-white font-black truncate max-w-xs sm:max-w-sm">
          {product.name}
        </span>
      </nav>

      {/* CENTRAL 3D PRODUCT THEATER LAYOUT (3-COLUMN TRI-STAGE) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FLANK: TECHNICAL SPECIFICATIONS & INDIAN PIN CHECKER (3 COLS) */}
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-4">
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Layers className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Technical Blueprint
              </h3>
            </div>

            {/* Quick Specs List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Brand</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.brand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Category</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.category?.name || 'Gear'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">Warranty</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">1 Year Brand</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 font-medium">GST Invoice</span>
                <span className="font-bold text-slate-900 dark:text-white">18% Included</span>
              </div>
            </div>

            {/* Indian PIN Delivery Estimator */}
            <div className="pt-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary-500" /> Check PIN Speed
              </label>
              <form onSubmit={handleCheckPincode} className="flex gap-1.5">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-Digit PIN"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs hover:opacity-90 transition"
                >
                  Verify
                </button>
              </form>

              {pincodeStatus && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Express arrival by {pincodeStatus.day}!</span>
                </div>
              )}
            </div>

            {/* Indian Assurance Badges */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Genuine Verified Product</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary-500" />
                <span>7-Day Doorstep Reverse Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER STAGE: 3D PRODUCT VISUALIZER & GALLERY (5 COLS) */}
        <div className="order-1 lg:order-2 lg:col-span-5 space-y-4">
          <TiltCard maxTilt={10} scaleOnHover={1.02}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl group flex items-center justify-center p-6">
              
              <img
                src={currentImages[selectedImage]}
                alt={product.name}
                className="max-h-full object-contain filter drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs tracking-tight shadow-md">
                    {discountPercent}% SAVINGS
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-primary-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                    Featured Drop
                  </span>
                )}
              </div>

              {/* Top Right Share & Wishlist */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-primary-600 backdrop-blur-md shadow-lg transition active:scale-95"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition active:scale-95 ${
                    isFavorited ? 'bg-rose-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </TiltCard>

          {/* Thumbnail Strip */}
          {currentImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
              {currentImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 p-1 bg-white dark:bg-slate-900 transition-all ${
                    selectedImage === index
                      ? 'border-primary-600 shadow-md shadow-primary-500/20 scale-105'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT FLANK: FLOATING PURCHASE POD (4 COLS) */}
        <div className="order-3 lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
            
            {/* Brand & Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating?.toFixed(1) || '4.8'}</span>
                  <span className="text-slate-400 text-[10px]">({product.numReviews || 0})</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Calculations in INR */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {formatPrice(hasDiscount ? discountPrice : price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {formatPrice(price)}
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs">
                      Save {formatPrice(price - discountPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-emerald-600" /> Inclusive of 18% GST • Free Metro Delivery
              </p>
            </div>

            {/* Variants Selectors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Color: <span className="text-primary-600 font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedColor === c
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Size: <span className="text-primary-600 font-extrabold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold border flex items-center justify-center transition ${
                        selectedSize === s
                          ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Primary CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-black text-xs text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-primary-500/25 transition active:scale-98 disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag in ₹</span>
                </button>
              </div>

              {/* Instant 1-Click Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-xs sm:text-sm shadow-lg transition active:scale-98 disabled:opacity-40"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Express UPI / Buy Now</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Customer Reviews Section */}
      <div className="relative z-10 pt-8 border-t border-slate-200 dark:border-slate-800">
        <ReviewSection
          productId={product._id}
          productRating={product.rating}
          totalReviews={product.numReviews}
        />
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="relative z-10 space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Complementary Drops
            </h3>
            <Link
              to={`/shop?category=${product.category?.slug || product.category}`}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <span>View All in {product.category?.name || 'Department'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, MessageSquarePlus, User, Sparkles } from 'lucide-react';
import { productAPI } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import StarRating from '../common/StarRating.jsx';

const ReviewSection = ({ productId, productRating = 5, totalReviews = 0 }) => {
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // New review form states
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getReviews(productId);
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const res = await productAPI.createReview(productId, {
        rating,
        title: title.trim(),
        comment: comment.trim()
      });

      if (res.success) {
        toast.success('Thank you! Your verified review has been published.');
        setComment('');
        setTitle('');
        setRating(5);
        setShowReviewForm(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate rating breakdown
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  return (
    <div className="space-y-8 pt-8">
      
      {/* Review Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 md:border-r border-slate-100 dark:border-slate-800">
          <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {productRating.toFixed(1)}
          </span>
          <div className="my-2">
            <StarRating rating={productRating} size="md" showNumber={false} />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Based on {totalReviews || reviews.length} verified buyer reviews
          </p>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition active:scale-95 flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-saffron-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Modal / Box */}
      {showReviewForm && (
        <div className="p-6 sm:p-8 rounded-3xl bg-primary-50/50 dark:bg-slate-800/80 border border-primary-200/60 dark:border-slate-700 shadow-lg animate-slide-up">
          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="space-y-4 max-w-xl mx-auto">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Share Your Experience with Indian Shoppers
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rating:
                </label>
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive={true}
                  onRatingChange={setRating}
                  showNumber={true}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Review Headline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent acoustic clarity and premium packaging!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Review Comment *
                </label>
                <textarea
                  rows="4"
                  placeholder="Share details on performance, durability, unboxing, and value for money."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Please log in to share your verified product review
              </p>
              <Link
                to="/login"
                className="inline-flex px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow transition"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Customer Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          Customer Reviews ({reviews.length})
        </h4>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading verified reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-500 text-sm">
            No reviews yet for this product. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified Indian Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <StarRating rating={rev.rating} size="sm" showNumber={false} />
                </div>

                {rev.title && (
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rev.title}
                  </h5>
                )}

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

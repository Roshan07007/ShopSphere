import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 5,
  totalStars = 5,
  size = 'sm', // 'sm', 'md', 'lg'
  showNumber = true,
  numReviews = null,
  interactive = false,
  onRatingChange = null
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: totalStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const isHalf = !filled && i < rating;

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => handleStarClick(i)}
              className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform p-0.5' : 'cursor-default'}`}
              aria-label={`Rate ${i + 1} stars`}
            >
              <Star
                className={`${sizeClasses[size] || sizeClasses.sm} ${
                  filled || isHalf
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {numReviews !== null && (
        <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;

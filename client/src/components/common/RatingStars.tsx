import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  numReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  numReviews,
  size = 'md',
  showCount = true,
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars <= 0.7;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} fill-amber-400`} />
        ))}
        {hasHalfStar && <StarHalf className={`${iconSize} fill-amber-400`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconSize} text-gray-300 dark:text-gray-600`} />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">
          {rating.toFixed(1)} {numReviews !== undefined && `(${numReviews})`}
        </span>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, onChange, size = 16, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(null);

  const handleStarClick = (val) => {
    if (interactive && onChange) {
      onChange(val);
    }
  };

  const handleMouseEnter = (val) => {
    if (interactive) {
      setHoverRating(val);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starVal = i + 1;
        const isFilled = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
        return (
          <Star
            key={i}
            size={size}
            className={`${
              interactive ? 'cursor-pointer transition-transform duration-100 hover:scale-110' : ''
            } ${
              isFilled ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-350 fill-none'
            }`}
            onClick={() => handleStarClick(starVal)}
            onMouseEnter={() => handleMouseEnter(starVal)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}

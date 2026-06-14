import React from 'react';
import StarRating from './StarRating';
import { Pencil, Trash2 } from 'lucide-react';

export default function ReviewCard({ review, isCustomerView = false, onEdit, onDelete }) {
  // Format Date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Get name or label
  const displayName = isCustomerView
    ? (review.vendorId?.businessName || review.vendorId?.name || 'Home Kitchen')
    : (review.customerId?.name || 'Anonymous Customer');

  const subLabel = isCustomerView
    ? (review.vendorId?.kitchenAddress || review.vendorId?.city || '')
    : '';

  return (
    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 space-y-3 relative group">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-xs md:text-sm text-primary-text">{displayName}</h4>
          {subLabel && (
            <p className="text-[10px] text-slate-400 font-medium">{subLabel}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* Stars and Edited Badge */}
      <div className="flex items-center space-x-2.5">
        <StarRating rating={review.rating} size={14} />
        {review.isEdited && (
          <span className="text-[9px] font-bold text-mint bg-mint-light/60 px-2 py-0.5 rounded-full">
            Edited
          </span>
        )}
      </div>

      {/* Review Text */}
      <p className="text-xs text-secondary-text leading-relaxed italic pr-6">
        "{review.reviewText}"
      </p>

      {/* Edit/Delete Buttons (Float on hover or always visible on small screens) */}
      {(onEdit || onDelete) && (
        <div className="absolute bottom-4 right-4 flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-mint transition-colors cursor-pointer"
              title="Edit Review"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review._id || review.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete Review"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

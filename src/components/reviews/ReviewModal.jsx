import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { X, Loader2 } from 'lucide-react';

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  eligibleItems = [],
  isSubmitting = false,
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0);
      setReviewText(initialData.reviewText || '');
      setSelectedItemId('');
    } else {
      setRating(0);
      setReviewText('');
      if (eligibleItems.length > 0) {
        setSelectedItemId(eligibleItems[0].id);
      } else {
        setSelectedItemId('');
      }
    }
  }, [initialData, eligibleItems, isOpen]);

  if (!isOpen) return null;

  const handleTextChange = (e) => {
    if (e.target.value.length <= 500) {
      setReviewText(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    if (reviewText.trim().length < 3) {
      alert('Review text must be at least 3 characters.');
      return;
    }

    const submitData = {
      rating,
      reviewText,
    };

    if (!initialData && selectedItemId) {
      const selectedObj = eligibleItems.find((item) => item.id === selectedItemId);
      if (selectedObj) {
        if (selectedObj.type === 'subscription') {
          submitData.subscriptionId = selectedObj.id;
        } else {
          submitData.orderId = selectedObj.id;
        }
      }
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-[#1F2937] text-sm md:text-base">
            {initialData ? 'Update Your Review' : 'Write a Review'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Uniqueness/Item select (only for fresh reviews) */}
          {!initialData && eligibleItems.length > 0 && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Select Order or Subscription
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              >
                {eligibleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
              Rate Your Experience
            </label>
            <div className="flex items-center space-x-2">
              <StarRating rating={rating} onChange={setRating} size={28} interactive={true} />
              {rating > 0 && (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Your Review
              </label>
              <span
                className={`text-[10px] font-bold ${
                  reviewText.length >= 480 ? 'text-red-500' : 'text-slate-400'
                }`}
              >
                {reviewText.length} / 500
              </span>
            </div>
            <textarea
              value={reviewText}
              onChange={handleTextChange}
              placeholder="Tell other customers about the quality of the food, portion sizes, packing, and delivery. (Min 3 characters)"
              rows={4}
              required
              className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-2xl px-4 py-3 text-xs md:text-sm text-[#1F2937] placeholder-slate-400/60 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-medium resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-[#1F2937] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || reviewText.trim().length < 3}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#F59E0B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#F59E0B]/15 hover:bg-[#D97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>{initialData ? 'Update Review' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

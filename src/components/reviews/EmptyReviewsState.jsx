import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function EmptyReviewsState({ message = "No reviews recorded yet.", subMessage = "Testimonials and feedback will appear here once customers share their dining experience." }) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-10 shadow-card text-center flex flex-col items-center justify-center min-h-[220px]">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-350 shadow-sm">
        <MessageSquare size={20} strokeWidth={2} />
      </div>
      <h4 className="text-sm font-bold text-[#1F2937] mb-1">{message}</h4>
      <p className="text-xs text-secondary-text max-w-sm leading-relaxed mx-auto">
        {subMessage}
      </p>
    </div>
  );
}

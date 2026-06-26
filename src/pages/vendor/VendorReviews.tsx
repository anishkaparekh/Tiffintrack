import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import RatingSummaryCard from '../../components/reviews/RatingSummaryCard';
import ReviewCard from '../../components/reviews/ReviewCard';
import EmptyReviewsState from '../../components/reviews/EmptyReviewsState';
import ReviewLoadingSkeleton from '../../components/reviews/ReviewLoadingSkeleton';

export default function VendorReviews() {
  const [vendorUser, setVendorUser] = useState({ id: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
  });

  const fetchReviewsAndStats = async (vId: string) => {
    if (!vId) return;
    setIsLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/vendor/${vId}/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }

      // 2. Fetch Reviews
      const reviewsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/vendor/${vId}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        if (reviewsData.success && Array.isArray(reviewsData.data)) {
          setReviews(reviewsData.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch vendor reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_vendor_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const parsedId = u.id || u._id || '';
        setVendorUser({ id: parsedId });
        if (parsedId) {
          fetchReviewsAndStats(parsedId);
        }
      } catch (e) {
        console.error('Failed to parse tiffintrack_vendor_user in VendorReviews:', e);
      }
    }
  }, []);

  return (
    <DashboardLayout activeTab="reviews" onTabSelect={() => {}}>
      <div className="space-y-6">
        {/* Intro Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
            Track customer feedback, average scores, and verified kitchen testimonials
          </p>
        </div>

        {/* Loader/Layout */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-44 bg-white rounded-3xl animate-pulse"></div>
            <ReviewLoadingSkeleton />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating Summary stats */}
            <RatingSummaryCard stats={stats} />

            {/* List Header */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-[#1F2937]">Reviews List</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Chronological customer feedback from tiffin subscribers
                </p>
              </div>

              {reviews.length === 0 ? (
                <EmptyReviewsState 
                  message="No reviews received yet"
                  subMessage="Ratings and feedback details will be shown here once customers start reviewing your meals and plans."
                />
              ) : (
                <div className="grid gap-4">
                  {reviews.map((rev: any) => (
                    <ReviewCard key={rev._id} review={rev} isCustomerView={false} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Utensils, MessageSquare, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewModal from '../components/reviews/ReviewModal';
import EmptyReviewsState from '../components/reviews/EmptyReviewsState';
import ReviewLoadingSkeleton from '../components/reviews/ReviewLoadingSkeleton';

export default function MyReviews() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);
  const [customerId, setCustomerId] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomerReviews = async (custId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/customer/${custId}`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          setReviewsList(resData.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
      showToast('Error connecting to server. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('customer_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const id = u._id || u.id || '';
        setCustomerId(id);
        if (id) {
          fetchCustomerReviews(id);
        }
      } catch (e) {
        console.error('Failed to parse user storage:', e);
      }
    } else {
      navigate('/customer-auth');
    }
  }, [navigate]);

  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      navigate('/my-subscriptions');
    } else if (tabId === 'track_orders') {
      navigate('/track-orders');
    } else if (tabId === 'history') {
      navigate('/order-history');
    } else if (tabId === 'settings') {
      navigate('/profile-settings');
    } else if (tabId === 'notifications') {
      navigate('/notifications');
    } else if (tabId === 'reviews') {
      // already here
    } else {
      navigate('/customer-dashboard');
    }
  };

  // Edit Review
  const handleEditClick = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (submitData) => {
    if (!editingReview) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/${editingReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: submitData.rating,
          reviewText: submitData.reviewText,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        showToast('Review updated successfully!', 'success');
        setIsModalOpen(false);
        fetchCustomerReviews(customerId);
      } else {
        showToast(resData.message || 'Failed to update review.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error updating review. Please check connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Review
  const handleDeleteClick = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        showToast('Review deleted successfully!', 'success');
        fetchCustomerReviews(customerId);
      } else {
        showToast(resData.message || 'Failed to delete review.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error deleting review. Please check connection.', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="reviews" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Panel Content Area */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200/60 h-16 flex justify-between items-center px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-primary-text">Portal Manager</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-secondary-text bg-slate-150 px-3 py-1 rounded-lg">
              My Reviews
            </span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 max-w-4xl w-full mx-auto space-y-6 flex-grow">
          {/* Section Page Intro Header */}
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl font-black text-primary-text tracking-tight">
              My Reviews & Testimonials
            </h1>
            <p className="text-xs text-secondary-text mt-0.5 font-medium">
              Manage all reviews you've written for your subscribed kitchens on the TiffinTrack marketplace.
            </p>
          </div>

          {/* Toast Notification Alert */}
          {toast && (
            <div className={`p-4 rounded-xl flex items-center space-x-3 text-xs font-bold ${
              toast.type === 'success' ? 'bg-mint-light text-mint' : 'bg-red-50 text-red-500'
            }`}>
              <AlertCircle size={16} />
              <span>{toast.message}</span>
            </div>
          )}

          {/* Reviews List */}
          {isLoading ? (
            <ReviewLoadingSkeleton />
          ) : reviewsList.length === 0 ? (
            <EmptyReviewsState 
              message="No reviews written yet"
              subMessage="Once you order or subscribe to a home kitchen plan, you can leave verified reviews to share your dining experience."
            />
          ) : (
            <div className="grid gap-4">
              {reviewsList.map((rev) => (
                <ReviewCard
                  key={rev._id}
                  review={rev}
                  isCustomerView={true}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>

        {/* Edit Modal */}
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={editingReview}
          isSubmitting={isSubmitting}
        />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/60 py-6 text-center mt-12">
          <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
            <div>TiffinTrack Reviews Management Panel</div>
            <div>© 2026 TiffinTrack. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  Utensils, 
  Inbox,
  Compass,
  Award,
  Sparkles,
  Truck,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';

// Import Reviews Components
import RatingSummaryCard from '../components/reviews/RatingSummaryCard';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewModal from '../components/reviews/ReviewModal';
import EmptyReviewsState from '../components/reviews/EmptyReviewsState';
import ReviewLoadingSkeleton from '../components/reviews/ReviewLoadingSkeleton';

// Verification status mapping (Only Approved vendors are customer-visible)
// Real backend vendor details integration

// Reusable Skeletons for the Details page
const HeroSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-card animate-pulse flex flex-col md:flex-row justify-between gap-6">
    <div className="flex-1 space-y-4">
      <div className="h-5 bg-slate-200 rounded w-24"></div>
      <div className="h-8 bg-slate-200 rounded w-64"></div>
      <div className="h-4 bg-slate-200 rounded w-48"></div>
      <div className="flex space-x-4">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full mt-2"></div>
      <div className="flex space-x-3 pt-4">
        <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
      </div>
    </div>
    <div className="w-full md:w-64 h-48 bg-slate-200 rounded-2xl flex-shrink-0"></div>
  </div>
);

const AboutSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-6">
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-36"></div>
      <div className="h-3.5 bg-slate-200 rounded w-full"></div>
      <div className="h-3.5 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-36"></div>
      <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
    </div>
  </div>
);

const MealCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card animate-pulse flex justify-between gap-4">
    <div className="flex-grow space-y-3">
      <div className="flex space-x-2">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
        <div className="h-5 bg-slate-200 rounded-full w-12"></div>
      </div>
      <div className="h-3 bg-slate-200 rounded w-full"></div>
      <div className="h-3.5 bg-slate-200 rounded w-16"></div>
    </div>
  </div>
);

const PlanCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card animate-pulse flex flex-col justify-between h-[200px]">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-slate-200 rounded w-40"></div>
        <div className="h-5 bg-slate-200 rounded-full w-16"></div>
      </div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="flex justify-between border-t border-slate-100 pt-4">
      <div className="h-6 bg-slate-200 rounded w-16"></div>
      <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
    </div>
  </div>
);

const ReviewCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 p-4 rounded-2xl animate-pulse space-y-2">
    <div className="flex justify-between">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-4 bg-slate-200 rounded w-16"></div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-full"></div>
    <div className="h-3 bg-slate-200 rounded w-4/5"></div>
  </div>
);

export default function VendorDetails({ preSelectedTab }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Tab State
  const [activeTab, setActiveTab] = useState(preSelectedTab || 'details');

  // Loading & Empty state simulation
  const [isLoading, setIsLoading] = useState(true);
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyMeals, setEmptyMeals] = useState(false);
  const [emptyPlans, setEmptyPlans] = useState(false);
  const [emptyReviews, setEmptyReviews] = useState(false);

  // Global Alert Message state
  const [message, setMessage] = useState(null);

  // Saved / Favorites toggle state
  const [isSaved, setIsSaved] = useState(false);

  // Real data states
  const [vendor, setVendor] = useState(null);
  const [meals, setMeals] = useState([]);
  const [plans, setPlans] = useState([]);
  const [otherVendors, setOtherVendors] = useState([]);
  const [vendorStatus, setVendorStatus] = useState("Approved");

  // Phase 7: Reviews & Ratings states
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
  });
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [eligibleItems, setEligibleItems] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [customerId, setCustomerId] = useState('');

  const fetchVendorDetails = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch vendor profile
      const vendorRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendors/${id}`);
      if (!vendorRes.ok) {
        setVendorStatus("Suspended");
        setIsLoading(false);
        return;
      }
      const vendorData = await vendorRes.json();
      if (vendorData.success && vendorData.data) {
        const v = vendorData.data;
        const mappedVendor = {
          id: v._id,
          name: v.businessName || v.name || 'Vendor Kitchen',
          owner: v.name || 'Vendor Owner',
          area: v.city || 'Anand',
          locality: v.kitchenAddress || 'Anand',
          rating: 4.8,
          reviewsCount: 245,
          distance: 1.2,
          startingPrice: 120,
          mealType: "Veg",
          experience: v.mealsPerDay ? `${v.mealsPerDay} Meals/Day` : "Homestyle",
          tagline: v.description || "Fresh homemade meals prepared daily with love.",
          description: v.description || "Fresh homestyle specialties cooked daily.",
          story: `${v.businessName || v.name || 'Our Kitchen'} has been preparing fresh, wholesome, preservative-free home-cooked meals for local clients. Every recipe is crafted with care and high quality ingredients.`,
          specialties: "Soft Phulka Rotis, homestyle subjis, organic daal.",
          commitment: "100% hygienic preparation. Low-oil cooking. No synthetic food colors, MSG, or artificial preservatives used.",
          deliveryAreas: v.city || "Anand",
          deliveryTimings: "Lunch: 12:00 PM - 2:00 PM | Dinner: 7:30 PM - 9:30 PM",
          deliveryTime: "30-40 mins",
          cutoffTime: "3 hours prior to delivery hours",
          status: v.verificationStatus || 'approved'
        };
        setVendor(mappedVendor);
        setVendorStatus(v.verificationStatus === 'approved' ? 'Approved' : 'Pending Review');
        
        // 2. Fetch vendor meals
        const mealsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals/vendor/${v._id}`);
        if (mealsRes.ok) {
          const mealsData = await mealsRes.json();
          const mealsArr = mealsData.success && Array.isArray(mealsData.data) ? mealsData.data : (Array.isArray(mealsData) ? mealsData : []);
          const mappedMeals = mealsArr.map(m => ({
            name: m.mealName,
            description: m.description || 'No description available.',
            price: m.price,
            type: m.mealType || 'Veg'
          }));
          setMeals(mappedMeals);
        }
        
        // 3. Fetch vendor plans
        const plansRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/plans/vendor/${v._id}`);
        if (plansRes.ok) {
          const plansData = await plansRes.json();
          const plansArr = plansData.success && Array.isArray(plansData.data) ? plansData.data : (Array.isArray(plansData) ? plansData : []);
          const mappedPlans = plansArr.map(p => ({
            id: p._id,
            name: p.planName,
            price: p.price,
            duration: p.duration === 'weekly' ? '7 Days' : '30 Days',
            details: p.description || `${p.mealsPerDay} meals per day`
          }));
          setPlans(mappedPlans);
        }

        // 4. Fetch other approved vendors for recommendation
        try {
          const otherRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendors');
          if (otherRes.ok) {
            const otherData = await otherRes.json();
            if (otherData.success && Array.isArray(otherData.data)) {
              const mappedOther = otherData.data
                .filter(otherV => otherV._id !== v._id)
                .map(otherV => ({
                  id: otherV._id,
                  name: otherV.businessName || otherV.name || 'Vendor Kitchen',
                  rating: 4.8,
                  area: otherV.city || 'Anand',
                  startingPrice: 120
                }));
              setOtherVendors(mappedOther);
            }
          }
        } catch (err) {
          console.error("Failed to fetch other kitchens:", err);
        }
      } else {
        setVendorStatus("Suspended");
      }
    } catch (e) {
      console.error(e);
      setVendorStatus("Suspended");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('customer_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCustomerId(u._id || u.id || '');
      } catch (e) {
        console.error('Failed to parse customer_user:', e);
      }
    }
  }, []);

  const fetchReviewsAndStats = async (vendorId, currentCustId) => {
    setIsReviewsLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/vendor/${vendorId}/stats`);
      if (statsRes.ok) {
        const res = await statsRes.json();
        if (res.success && res.data) {
          setStats(res.data);
        }
      }

      // Fetch reviews
      const reviewsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/vendor/${vendorId}`);
      let fetchedReviews = [];
      if (reviewsRes.ok) {
        const res = await reviewsRes.json();
        if (res.success && Array.isArray(res.data)) {
          fetchedReviews = res.data;
          setReviews(res.data);
        }
      }

      // If customer is logged in, check eligibility
      if (currentCustId) {
        let allItems = [];

        // 1. Fetch Subscriptions
        try {
          const subsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/customer/${currentCustId}`);
          if (subsRes.ok) {
            const subsData = await subsRes.json();
            if (subsData.success && Array.isArray(subsData.data)) {
              const vendorSubs = subsData.data.filter(sub => {
                const subVendorId = sub.vendorId?._id || sub.vendorId;
                return subVendorId === vendorId;
              });
              vendorSubs.forEach(sub => {
                allItems.push({
                  id: sub._id,
                  label: `Subscription - ${sub.planName} (${new Date(sub.createdAt).toLocaleDateString()})`,
                  type: 'subscription'
                });
              });
            }
          }
        } catch (err) {
          console.error("Error fetching subscriptions for eligibility check:", err);
        }

        // 2. Fetch Orders
        try {
          const ordersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/customer/${currentCustId}`);
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            if (ordersData.success && Array.isArray(ordersData.data)) {
              const vendorOrders = ordersData.data.filter(ord => {
                const ordVendorId = ord.vendorId?._id || ord.vendorId;
                return ordVendorId === vendorId;
              });
              vendorOrders.forEach(ord => {
                allItems.push({
                  id: ord._id,
                  label: `Order - ${ord.mealName || 'Meal'} (${new Date(ord.createdAt).toLocaleDateString()})`,
                  type: 'order'
                });
              });
            }
          }
        } catch (err) {
          console.error("Error fetching orders for eligibility check:", err);
        }

        // 3. Filter out already reviewed ones
        const filtered = allItems.filter(item => {
          const hasReview = fetchedReviews.some(rev => {
            const revCustId = rev.customerId?._id || rev.customerId;
            return revCustId === currentCustId && (rev.subscriptionId === item.id || rev.orderId === item.id);
          });
          return !hasReview;
        });

        setEligibleItems(filtered);
      }
    } catch (e) {
      console.error("Error in fetchReviewsAndStats:", e);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const refreshReviewsAndStats = async () => {
    await fetchReviewsAndStats(id, customerId);
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReviewsAndStats(id, customerId);
    }
  }, [id, customerId]);

  const handleReviewSubmit = async (submitData) => {
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      if (editingReview) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/${editingReview._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: submitData.rating,
            reviewText: submitData.reviewText
          })
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setMessage({ type: 'success', text: 'Review updated successfully!' });
          setIsReviewModalOpen(false);
          setEditingReview(null);
          await refreshReviewsAndStats();
        } else {
          setMessage({ type: 'error', text: resData.message || 'Failed to update review.' });
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            vendorId: id,
            rating: submitData.rating,
            reviewText: submitData.reviewText,
            subscriptionId: submitData.subscriptionId,
            orderId: submitData.orderId
          })
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setMessage({ type: 'success', text: 'Review submitted successfully!' });
          setIsReviewModalOpen(false);
          await refreshReviewsAndStats();
        } else {
          setMessage({ type: 'error', text: resData.message || 'Failed to submit review.' });
        }
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Error submitting review.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setMessage({ type: 'success', text: 'Review deleted successfully!' });
        await refreshReviewsAndStats();
      } else {
        setMessage({ type: 'error', text: resData.message || 'Failed to delete review.' });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Error deleting review.' });
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  // Adjust active tab when preSelectedTab prop changes
  useEffect(() => {
    if (preSelectedTab) {
      setActiveTab(preSelectedTab);
    }
  }, [preSelectedTab]);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isLoading && vendorStatus !== "Approved") {
    return (
      <div className="min-h-screen bg-snow flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-slate-200/60 sticky top-0 z-35 font-semibold">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => navigate('/browse-vendors')} className="flex items-center space-x-2 text-slate-600 hover:text-primary-text font-bold text-xs cursor-pointer border-0 bg-transparent">
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
          </div>
        </header>
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-primary-text font-bold">Vendor Profile Locked</h1>
            <p className="text-xs text-secondary-text leading-relaxed">
              This vendor kitchen is currently undergoing platform verification (FSSAI/hygiene audit) or is temporarily suspended. Subscriptions and menus are locked.
            </p>
          </div>
          <button
            onClick={() => navigate('/browse-vendors')}
            className="px-5 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm font-bold"
          >
            Browse Other Home Chefs
          </button>
        </div>
      </div>
    );
  }

  // Favorite toggle helper
  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    setMessage({
      type: 'success',
      text: !isSaved ? `${vendor.name} saved to favorites!` : `${vendor.name} removed from favorites.`
    });
  };

  // Simulated click handlers
  const handleContactChef = () => {
    setMessage({
      type: 'success',
      text: `Calling home chef ${vendor.owner} at +91-98765-XXXXX...`
    });
  };

  const handleSubscribePlan = (plan) => {
    const checkoutInfo = {
      chefId: vendor.id,
      planId: plan.id,
      chefName: vendor.name,
      planName: plan.name,
      price: plan.price,
      duration: plan.duration || "Month",
      mealsIncluded: plan.name.includes("Lunch Only") ? "Lunch Only" : "Lunch + Dinner",
      mealsRemaining: plan.name.includes("Family") ? 60 : (plan.name.includes("Lunch Only") ? 26 : 52),
    };
    localStorage.setItem('tiffintrack_checkout_plan', JSON.stringify(checkoutInfo));
    navigate('/checkout');
  };

  // Mock Reviews Database
  const reviewsList = [
    { name: "Keyur Patel", rating: 5, comment: "Amazing food! Tastes exactly like homestyle cooking. Non-greasy, healthy, and Rahul Kumar delivers it warm every day.", date: "June 08, 2026" },
    { name: "Riddhi Shah", rating: 4.5, comment: "Very sanitary preparation. Love the soft phulkas. The sweet dal is a bit too sweet for me, but overall excellent quality.", date: "June 06, 2026" },
    { name: "Aarav Sharma", rating: 5, comment: "I subscribed to the monthly vegetarian package. Wholesome recipes and extremely easy to skip single dates when traveling.", date: "June 04, 2026" }
  ];

  const activeLoading = isLoading || forceLoadingState;

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-35">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              to="/customer-dashboard"
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-primary-text">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Panel */}
            <div className="hidden lg:flex items-center space-x-4 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text">Mock Sandbox:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyMeals} 
                  onChange={(e) => setEmptyMeals(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Meals</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyPlans} 
                  onChange={(e) => setEmptyPlans(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Plans</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyReviews} 
                  onChange={(e) => setEmptyReviews(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Reviews</span>
              </label>
            </div>
            
            <Link 
              to="/customer-dashboard" 
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all duration-150 shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-grow space-y-6">
        
        {/* Dynamic Status Notifications */}
        {message && (
          <div className={`p-4 rounded-xl mb-2 flex items-start space-x-3 border shadow-sm transition-all duration-300 ${
            message.type === 'success' 
              ? 'bg-mint-light border-mint/20 text-mint' 
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span className="text-xs font-semibold flex-grow">{message.text}</span>
            <button 
              onClick={() => setMessage(null)} 
              className="text-slate-400 hover:text-slate-600 text-xs font-bold focus:outline-none cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* VENDOR HERO SECTION */}
        {activeLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-card flex flex-col md:flex-row justify-between items-start gap-6 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-mint/5 rounded-full pointer-events-none"></div>
            
            <div className="space-y-3.5 flex-grow">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-mint bg-mint-light px-2.5 py-1 rounded-md border border-mint/10 uppercase tracking-wider">
                  Verified Chef
                </span>
                <span className="text-xs text-secondary-text font-semibold flex items-center">
                  <Award size={14} className="text-mint mr-1" />
                  {vendor.experience} Experience
                </span>
              </div>

              <div className="flex items-start justify-between flex-wrap gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-primary-text tracking-tight">
                  {vendor.name}
                </h1>
                <button 
                  onClick={handleToggleSave}
                  className="text-slate-350 hover:text-red-500 transition-colors cursor-pointer mr-4"
                >
                  <Heart size={20} fill={isSaved ? "#EF4444" : "none"} className={isSaved ? "text-red-500" : ""} />
                </button>
              </div>

              <p className="text-xs md:text-sm text-slate-500 italic max-w-xl font-medium">
                "{vendor.tagline}"
              </p>

              {/* Badges Stack */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-secondary-text pt-1">
                <span className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Star size={12} fill="#F59E0B" className="mr-1" />
                  {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : vendor.rating} ({stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'})
                </span>
                <span className="flex items-center">
                  <MapPin size={14} className="text-mint mr-1" />
                  {vendor.locality}, {vendor.area}
                </span>
                <span className="flex items-center">
                  <Clock size={14} className="text-mint mr-1" />
                  Starts at ₹{vendor.startingPrice}/meal
                </span>
              </div>

              {/* Delivery Areas */}
              <div className="text-[11px] text-secondary-text">
                <strong>Serves Locality:</strong> {vendor.deliveryAreas}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4">
                <button 
                  onClick={() => navigate(`/vendor/${vendor.id}/meals`)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200/30"
                >
                  View Meals
                </button>
                <button 
                  onClick={() => navigate(`/vendor/${vendor.id}/plans`)}
                  className="px-4 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-mint/10"
                >
                  View Subscription Plans
                </button>
                <button 
                  onClick={handleContactChef}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Contact Vendor
                </button>
              </div>
            </div>

            {/* Simulated Kitchen Image Holder */}
            <div className="w-full md:w-64 h-44 border border-slate-200/60 rounded-2xl bg-snow p-2 flex flex-col justify-center items-center text-center flex-shrink-0 relative overflow-hidden shadow-inner">
              <div className="p-3 bg-mint-light rounded-full text-mint mb-2">
                <Compass size={24} />
              </div>
              <span className="font-bold text-xs text-primary-text">Priya Patel's Kitchen</span>
              <span className="text-[10px] text-slate-400 mt-1">100% Hygienic Food Audit Verified</span>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-mint"></div>
            </div>

          </div>
        )}

        {/* SPLIT SECTION DETAILED DATA LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR DETAIL CARDS (ABOUT, DELIVERY, WHY US) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* About the Kitchen */}
            {activeLoading ? (
              <AboutSkeleton />
            ) : (
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Sparkles size={16} className="text-mint" />
                  <h3 className="text-base font-extrabold text-primary-text">About the Kitchen</h3>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-secondary-text leading-relaxed">
                  <div>
                    <h4 className="font-bold text-primary-text uppercase text-[9px] tracking-wider mb-1">Our Kitchen Story</h4>
                    <p>{vendor.story}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-primary-text uppercase text-[9px] tracking-wider mb-1">Cooking Style & Specialties</h4>
                    <p>{vendor.specialties}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary-text uppercase text-[9px] tracking-wider mb-1">Quality & Cleanliness Commitment</h4>
                    <p className="p-3 bg-snow rounded-xl border border-slate-150 text-[11px] leading-normal font-semibold text-mint">
                      {vendor.commitment}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Information */}
            {activeLoading ? (
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Truck size={16} className="text-mint" />
                  <h3 className="text-base font-extrabold text-primary-text">Delivery Operations</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-secondary-text font-semibold">Service Localities:</span>
                    <span className="font-bold text-primary-text text-right">{vendor?.deliveryAreas}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-secondary-text font-semibold">Timings:</span>
                    <span className="font-bold text-primary-text text-right">{vendor?.deliveryTimings}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-secondary-text font-semibold">Average delivery time:</span>
                    <span className="font-bold text-primary-text">{vendor?.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-secondary-text font-semibold">Daily cutoff hour:</span>
                    <span className="font-bold text-red-500">{vendor?.cutoffTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Why Customers Choose This Vendor */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                <ThumbsUp size={16} className="text-mint" />
                <h3 className="text-base font-extrabold text-primary-text">Why Choose Us</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Fresh Ingredients", desc: "Sourced organic daily" },
                  { title: "Home Taste", desc: "No artificial mixtures" },
                  { title: "Reliable Drop", desc: "Express delivery routes" },
                  { title: "Flexible Plans", desc: "Pause/Resume anytime" }
                ].map((choice) => (
                  <div key={choice.title} className="p-3 bg-snow border border-slate-200/30 rounded-2xl text-center">
                    <h4 className="text-[11px] font-extrabold text-primary-text">{choice.title}</h4>
                    <p className="text-[9px] text-secondary-text mt-0.5">{choice.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT VIEW SECTION: TABS SWITCHER (MEALS, PLANS, REVIEWS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* View Tabs Selector */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200/50 shadow-card">
              <button
                onClick={() => { navigate(`/vendor/${vendor.id}`); setActiveTab('details'); }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'details' 
                    ? 'bg-mint text-white shadow-sm' 
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                Popular Dishes
              </button>
              <button
                onClick={() => { navigate(`/vendor/${vendor.id}/meals`); setActiveTab('meals'); }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'meals' 
                    ? 'bg-mint text-white shadow-sm' 
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                Food Gallery
              </button>
              <button
                onClick={() => { navigate(`/vendor/${vendor.id}/plans`); setActiveTab('plans'); }}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'plans' 
                    ? 'bg-mint text-white shadow-sm' 
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                Subscription Packages
              </button>
            </div>

            {/* TAB CONTENT 1: POPULAR DISHES */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                  <h3 className="text-base font-bold text-primary-text">Homestyle Daily Menu Dishes</h3>
                  <p className="text-xs text-secondary-text">Featured items included in the subscription rotation.</p>
                </div>

                {activeLoading ? (
                  <div className="space-y-4">
                    <MealCardSkeleton />
                    <MealCardSkeleton />
                    <MealCardSkeleton />
                  </div>
                ) : (
                  (emptyMeals || meals.length === 0) ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-10 shadow-card text-center flex flex-col items-center justify-center min-h-[200px]">
                      <Inbox size={32} className="text-slate-350 mb-2" />
                      <p className="text-xs text-secondary-text">No meals currently published.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meals.map((meal) => (
                        <div 
                          key={meal.name}
                          className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card hover:border-mint/10 transition-all flex justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-extrabold text-primary-text">{meal.name}</h4>
                              <span className="text-[9px] font-bold text-mint bg-mint-light px-2 py-0.5 rounded-full">
                                {meal.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-secondary-text leading-relaxed max-w-md">
                              {meal.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-extrabold text-mint bg-mint-light/60 px-2.5 py-1 rounded-lg">
                              ₹{meal.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}

            {/* TAB CONTENT 2: FOOD GALLERY PLACEHOLDERS */}
            {activeTab === 'meals' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                  <h3 className="text-base font-bold text-primary-text">Fresh Kitchen Food Gallery</h3>
                  <p className="text-xs text-secondary-text">Authentic snapshots of prepared breakfasts, lunches, and specialty items.</p>
                </div>

                {/* Gallery categories grids */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Homestyle Breakfasts", items: "Poha, Oats Upma, Stuffed Paratha" },
                    { label: "Daily Lunches", items: "Gujarati Thali, Jain Lunch Box" },
                    { label: "Daily Dinners", items: "Khichdi-Kadhi, Paneer Chapatis" },
                    { label: "Special Dessert Items", items: "Shrikhand, Gajar Halwa, Masala Chaas" }
                  ].map((cat) => (
                    <div 
                      key={cat.label} 
                      className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card hover:border-mint/10 transition-all text-center flex flex-col justify-center min-h-[160px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-mint/5 text-mint flex items-center justify-center mx-auto mb-3">
                        <Utensils size={18} />
                      </div>
                      <h4 className="text-xs font-extrabold text-primary-text">{cat.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Includes: {cat.items}</p>
                      <span className="text-[9px] font-bold text-mint bg-mint-light px-2.5 py-0.5 rounded-full w-fit mx-auto mt-4 uppercase tracking-wider">
                        Audit verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: SUBSCRIPTIONS PLANS LIST */}
            {activeTab === 'plans' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                  <h3 className="text-base font-bold text-primary-text">Active Subscription Plans</h3>
                  <p className="text-xs text-secondary-text">Pick a cycle that matches your dining requirements. Skip meals or pause plans at any time.</p>
                </div>

                {activeLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    <PlanCardSkeleton />
                    <PlanCardSkeleton />
                  </div>
                ) : (
                  (emptyPlans || plans.length === 0) ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[220px]">
                      <Inbox size={32} className="text-slate-350 mb-2" />
                      <p className="text-xs text-secondary-text">No active subscription packages found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {plans.map((plan) => (
                        <div 
                          key={plan.name}
                          className="bg-white border-2 border-slate-100 hover:border-mint/20 rounded-3xl p-6 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-extrabold text-primary-text">{plan.name}</h4>
                              <span className="text-[9px] font-bold text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase">
                                {plan.duration}
                              </span>
                            </div>
                            <p className="text-[11px] text-secondary-text mt-1 max-w-sm">
                              {plan.details}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0 gap-3">
                            <div className="text-left sm:text-right">
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Price</span>
                              <span className="text-base font-black text-primary-text">₹{plan.price}</span>
                            </div>
                            <button
                              onClick={() => handleSubscribePlan(plan)}
                              className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}

            {/* CUSTOMER REVIEWS SUB-SECTION (Directly displayed below the main active tab) */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-primary-text">What Our Customers Say</h3>
                  <p className="text-[11px] text-secondary-text">Latest verified testimonials left by subscribers.</p>
                </div>
                {eligibleItems.length > 0 && (
                  <button
                    onClick={() => { setEditingReview(null); setIsReviewModalOpen(true); }}
                    className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {isReviewsLoading ? (
                <div className="space-y-4">
                  <div className="h-44 bg-white rounded-3xl animate-pulse"></div>
                  <ReviewLoadingSkeleton />
                </div>
              ) : reviews.length === 0 ? (
                <EmptyReviewsState 
                  message="No reviews recorded yet"
                  subMessage="Ratings and feedback details will be shown here once customers start reviewing this chef's meals."
                />
              ) : (
                <div className="space-y-6">
                  <RatingSummaryCard stats={stats} />
                  <div className="space-y-3.5">
                    {reviews.map((rev) => (
                      <ReviewCard
                        key={rev._id}
                        review={rev}
                        isCustomerView={false}
                        onEdit={(rev.customerId?._id || rev.customerId) === customerId ? () => handleEditClick(rev) : null}
                        onDelete={(rev.customerId?._id || rev.customerId) === customerId ? () => handleReviewDelete(rev._id) : null}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RELATED NEIGHBORING VENDORS ROW */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-primary-text">Other Kitchens Nearby</h3>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {otherVendors.slice(0, 3).map((rel) => (
                  <div key={rel.id} className="bg-white border border-slate-200/50 p-4 rounded-2xl shadow-card text-center flex flex-col justify-between h-[150px]">
                    <div>
                      <h4 className="text-xs font-bold text-primary-text truncate">{rel.name}</h4>
                      <div className="flex items-center justify-center space-x-1 text-[9px] text-secondary-text mt-1">
                        <Star size={9} fill="#F59E0B" className="text-amber-500" />
                        <span className="font-bold">{rel.rating}</span>
                        <span>•</span>
                        <span>{rel.area}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">Starts at ₹{rel.startingPrice}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/vendor/${rel.id}`)}
                      className="w-full mt-3 py-1.5 bg-slate-50 hover:bg-slate-150 text-slate-600 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                      View Vendor
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Global Page Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs relative z-25 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TiffinTrack. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Review Modal Dialog popup */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => { setIsReviewModalOpen(false); setEditingReview(null); }}
        onSubmit={handleReviewSubmit}
        initialData={editingReview}
        eligibleItems={eligibleItems}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
}

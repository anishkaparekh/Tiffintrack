import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Utensils, 
  CheckCircle2, 
  Calendar, 
  ShieldAlert, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Inbox,
  Sparkles
} from 'lucide-react';

// Unified mock chef database
const vendorsDb = {
  1: {
    name: "Priya's Home Kitchen",
    owner: "Priya Patel",
    rating: 4.8,
    reviewsCount: 245,
    area: "Anand",
    locality: "Mota Bazar",
    startingPrice: 120,
    cuisineTypes: "Gujarati, Jain",
    deliveryAreas: "Anand, Vidyanagar, Karamsad"
  },
  2: {
    name: "Healthy Meals Hub",
    owner: "Meeta Shah",
    rating: 4.5,
    reviewsCount: 180,
    area: "Vallabh Vidyanagar",
    locality: "Shastri Marg",
    startingPrice: 150,
    cuisineTypes: "North Indian, Dietitian-curated",
    deliveryAreas: "Vidyanagar, Bakrol, Anand"
  },
  3: {
    name: "Kathiyawadi Swad Kitchen",
    owner: "Arvindbhai Ghelani",
    rating: 4.7,
    reviewsCount: 210,
    area: "Anand",
    locality: "Amul Dairy Road",
    startingPrice: 130,
    cuisineTypes: "Kathiyawadi, Gujarati",
    deliveryAreas: "Anand, Karamsad, Mogar"
  },
  4: {
    name: "Mom's Punjabi Rasoi",
    owner: "Manpreet Kaur",
    rating: 4.9,
    reviewsCount: 310,
    area: "Ahmedabad",
    locality: "Vastrapur",
    startingPrice: 140,
    cuisineTypes: "Punjabi, North Indian",
    deliveryAreas: "Vastrapur, Satellite, Bodakdev"
  },
  5: {
    name: "Jain Satvik Rasoi",
    owner: "Samyak Shah",
    rating: 4.6,
    reviewsCount: 142,
    area: "Vadodara",
    locality: "Alkapuri",
    startingPrice: 110,
    cuisineTypes: "Pure Satvik Jain",
    deliveryAreas: "Alkapuri, Akota, Gotri"
  },
  6: {
    name: "South India Express",
    owner: "S. Ramakrishnan",
    rating: 4.4,
    reviewsCount: 122,
    area: "Vallabh Vidyanagar",
    locality: "Amul Dairy Road",
    startingPrice: 100,
    cuisineTypes: "South Indian",
    deliveryAreas: "Vidyanagar, Anand, Karamsad"
  },
  7: {
    name: "Student Budget Tiffins",
    owner: "Karan Sharma",
    rating: 4.3,
    reviewsCount: 195,
    area: "Vallabh Vidyanagar",
    locality: "Mota Bazar",
    startingPrice: 90,
    cuisineTypes: "Gujarati, Basic Homestyle",
    deliveryAreas: "Vidyanagar hostles, Anand"
  }
};

// Reusable Skeletons
const PlanCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card animate-pulse space-y-4 flex flex-col justify-between h-[300px]">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-slate-200 rounded w-1/2"></div>
        <div className="h-5 bg-slate-200 rounded-full w-12"></div>
      </div>
      <div className="h-7 bg-slate-200 rounded w-1/3"></div>
      <div className="space-y-1">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
    <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
  </div>
);

const ComparisonSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-8 bg-slate-200 rounded w-full"></div>
      <div className="h-8 bg-slate-200 rounded w-full"></div>
      <div className="h-8 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);

const ReviewSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-2xl p-4 animate-pulse space-y-2">
    <div className="flex justify-between">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-4 bg-slate-200 rounded w-12"></div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-full"></div>
  </div>
);

export default function VendorPlans() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Resolve current chef summary
  const chefId = parseInt(id) || 1;
  const chef = vendorsDb[chefId] || vendorsDb[1];

  // FAQ Toggle State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sandbox State
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyPlans, setEmptyPlans] = useState(false);
  const [customPlansComingSoon, setCustomPlansComingSoon] = useState(false);

  // Async Loading simulation
  const [isLoading, setIsLoading] = useState(true);

  // Loading simulation state tracker (replaces useEffect warning)
  const [prevChefId, setPrevChefId] = useState(chefId);
  if (chefId !== prevChefId) {
    setPrevChefId(chefId);
    setIsLoading(true);
  }

  // Loading simulation timer
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Click handler to initiate checkout
  const handleSelectPlan = (plan) => {
    const checkoutInfo = {
      chefId: chefId,
      chefName: chef.name,
      planName: plan.name,
      price: plan.price,
      duration: plan.duration || "Month",
      mealsIncluded: plan.name.includes("Lunch Only") ? "Lunch Only" : "Lunch + Dinner",
      mealsRemaining: plan.name.includes("Family") ? 60 : (plan.name.includes("Lunch Only") ? 26 : 52),
    };
    localStorage.setItem('tiffintrack_checkout_plan', JSON.stringify(checkoutInfo));
    navigate('/checkout');
  };

  const activeLoading = isLoading || forceLoadingState;

  // Render Plan Data list
  const plans = [
    {
      id: "p1",
      name: "Lunch Only Plan",
      price: 1999,
      duration: "month",
      ideal: "Students and Office Workers",
      features: [
        "Daily Lunch delivery",
        "Monday to Saturday service",
        "Fresh Home-Cooked Meals",
        "Standard Delivery"
      ],
      isPopular: false
    },
    {
      id: "p2",
      name: "Lunch + Dinner Plan",
      price: 3499,
      duration: "month",
      ideal: "Professionals & Couples",
      features: [
        "Daily Lunch + Daily Dinner",
        "Monday to Saturday service",
        "Flexible Pause/Resume Option",
        "Priority Express Delivery"
      ],
      isPopular: true
    },
    {
      id: "p3",
      name: "Family Portion Plan",
      price: 5999,
      duration: "month",
      ideal: "Families up to 4 Members",
      features: [
        "Family Portion Meals",
        "Daily Lunch & Dinner",
        "Serves 3-4 family members",
        "Special Weekend Dishes",
        "Priority Customer Support"
      ],
      isPopular: false
    },
    {
      id: "p4",
      name: "Personalized Custom Plan",
      price: 999,
      duration: "start",
      ideal: "Flexible Eaters & Dieters",
      features: [
        "Choose Meal Frequency",
        "Choose Preferred Days",
        "Personalized delivery schedule",
        "Custom diet requirements"
      ],
      isPopular: false,
      isCustom: true
    }
  ];

  // FAQ database
  const faqs = [
    {
      q: "Can I pause my subscription?",
      a: "Yes, you can pause your subscription at any time. Simply head to the 'My Subscription' tab on your Customer Dashboard and click 'Pause'. Any pause request made before 8:00 PM will apply to the next day's delivery."
    },
    {
      q: "Can I change plans later?",
      a: "Absolutely! You can upgrade, downgrade, or switch plans from the dashboard at the end of your billing cycle or adjust it mid-cycle pro-rata by selecting a new plan."
    },
    {
      q: "Can I skip deliveries?",
      a: "Yes. In the dashboard, you can skip individual lunch or dinner schedules for any day of the week. Skipped meals are automatically added back to your remaining meal balance, so you never lose what you paid for."
    },
    {
      q: "What happens during holidays?",
      a: "On national public holidays or in the rare event that the home kitchen takes a day off, deliveries are suspended automatically. Those suspended dates will not count towards your monthly meal total, extending your subscription period by those days."
    },
    {
      q: "Can I customize meals?",
      a: "For standard plans (Lunch, Lunch + Dinner), you can set Veg, Non-Veg, or Jain preferences. If you need special customizations like high-protein, diabetic-friendly, or low-sodium adjustments, choose the Custom Plan or contact the chef directly."
    }
  ];

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(`/vendor/${chefId}`)}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
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
            {/* Developer Sandbox Controls */}
            <div className="hidden lg:flex items-center space-x-4 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text uppercase tracking-wider text-[9px]">Mock Sandbox:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyPlans} 
                  onChange={(e) => setEmptyPlans(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Plans</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={customPlansComingSoon} 
                  onChange={(e) => setCustomPlansComingSoon(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Custom Soon</span>
              </label>
            </div>
            
            <button 
              onClick={() => navigate(`/vendor/${chefId}/meals`)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Browse Meals Menu
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-grow space-y-6">
        
        {/* Page Header and Subtitle */}
        <div className="text-center py-4 space-y-1">
          <span className="text-[10px] font-black text-mint bg-mint-light px-3 py-1 rounded-md border border-mint/10 uppercase tracking-widest w-fit mx-auto block">
            {chef.name}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-primary-text tracking-tight">
            Subscription Packages
          </h1>
          <p className="text-xs md:text-sm text-secondary-text max-w-xl mx-auto leading-relaxed">
            Choose a meal plan that fits your lifestyle and schedule. Skip meals or pause plans at any time.
          </p>
        </div>

        {/* Dynamic Split Section: Chef Summary & Plan Cards */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-mint/5 rounded-full pointer-events-none"></div>
              
              <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Sparkles size={16} className="text-mint" />
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Kitchen Partner Profile</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Kitchen Name</h4>
                  <p className="text-base font-black text-primary-text mt-0.5">{chef.name}</p>
                  <span className="text-xs text-amber-500 font-semibold flex items-center mt-1">
                    <Star size={12} fill="#F59E0B" className="mr-1" />
                    {chef.rating} ({chef.reviewsCount} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Location</h5>
                    <p className="font-bold text-slate-700 mt-0.5">{chef.locality}, {chef.area}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Cuisines</h5>
                    <p className="font-bold text-slate-700 mt-0.5">{chef.cuisineTypes}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Delivery Areas</h4>
                  <p className="text-xs font-semibold text-slate-650 mt-0.5 leading-relaxed">{chef.deliveryAreas}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Starting Price</span>
                    <span className="text-sm font-black text-primary-text">₹{chef.startingPrice}/meal</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/vendor/${chefId}/meals`)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                  >
                    View Meals
                  </button>
                </div>
              </div>
            </div>

            {/* Steps process panel */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">How Subscriptions Work</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { step: "1", title: "Choose Plan", desc: "Select a package that matches your daily schedule." },
                  { step: "2", title: "Confirm Details", desc: "Set lunch/dinner cycles and select preferences." },
                  { step: "3", title: "Add Delivery Address", desc: "Add drop-off instructions for the courier." },
                  { step: "4", title: "Subscribe & Relax", desc: "Food prepared clean and delivered fresh." }
                ].map((s) => (
                  <div key={s.step} className="flex gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-mint-light text-mint font-extrabold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-slate-700">{s.title}</h4>
                      <p className="text-[10px] text-secondary-text mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Cards list Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Plan Cards Grid */}
            {activeLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                <PlanCardSkeleton />
                <PlanCardSkeleton />
                <PlanCardSkeleton />
                <PlanCardSkeleton />
              </div>
            ) : (
              emptyPlans ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
                  <Inbox size={48} className="text-slate-350 mb-3" />
                  <h3 className="text-base font-bold text-primary-text">No Plans Available</h3>
                  <p className="text-xs text-secondary-text max-w-sm mt-1 leading-relaxed">
                    This kitchen doesn't have any subscription packages open today. Please browse other local kitchens or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan) => {
                    const isCustomPlan = plan.isCustom;
                    return (
                      <div 
                        key={plan.id}
                        className={`bg-white border-2 rounded-3xl p-6 shadow-card flex flex-col justify-between h-[340px] relative transition-all duration-200 ${
                          plan.isPopular 
                            ? 'border-mint shadow-md ring-4 ring-mint-light' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {plan.isPopular && (
                          <span className="absolute -top-3.5 left-6 bg-mint text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center">
                            <Sparkles size={10} className="mr-1 fill-white" />
                            Most Popular • Best Value
                          </span>
                        )}

                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-black text-primary-text">{plan.name}</h3>
                              <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">Ideal: {plan.ideal}</p>
                            </div>
                          </div>

                          <div className="flex items-baseline">
                            <span className="text-2xl font-black text-primary-text">₹{plan.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-secondary-text font-bold ml-1">
                              {plan.duration === "start" ? "/month start" : `/${plan.duration}`}
                            </span>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2 text-xs">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-center text-slate-650 font-medium">
                                <CheckCircle2 size={13} className="text-mint mr-2 flex-shrink-0" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA button */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          {isCustomPlan ? (
                            customPlansComingSoon ? (
                              <div className="p-2.5 bg-amber-50 border border-amber-100 text-[10px] text-amber-700 font-bold rounded-xl flex items-center">
                                <ShieldAlert size={14} className="mr-1.5 flex-shrink-0 text-amber-600" />
                                Custom packages are coming soon to this kitchen!
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleSelectPlan(plan)}
                                className="w-full py-2.5 border-2 border-mint text-mint hover:bg-mint-light hover:text-mint text-[11px] font-black rounded-xl cursor-pointer transition-colors shadow-sm"
                              >
                                Customize Plan
                              </button>
                            )
                          ) : (
                            <button 
                              onClick={() => handleSelectPlan(plan)}
                              className="w-full py-2.5 bg-mint hover:bg-mint-hover text-white text-[11px] font-black rounded-xl cursor-pointer transition-colors shadow-sm"
                            >
                              Choose Plan
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* PLAN COMPARISON TABLE */}
            {activeLoading ? (
              <ComparisonSkeleton />
            ) : (
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 overflow-hidden">
                <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center">
                  <Calendar size={14} className="text-mint mr-2" />
                  Compare Meal Features
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold">
                        <th className="py-2.5">Feature</th>
                        <th className="py-2.5">Lunch Only</th>
                        <th className="py-2.5 text-mint font-black">Lunch + Dinner</th>
                        <th className="py-2.5">Family Plan</th>
                        <th className="py-2.5">Custom Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                      {[
                        { name: "Meals Per Day", p1: "1 Meal", p2: "2 Meals", p3: "2 Meals (Large)", p4: "Flexible" },
                        { name: "Delivery Frequency", p1: "Mon - Sat", p2: "Mon - Sat", p3: "Mon - Sun (Daily)", p4: "Choose Days" },
                        { name: "Pause Option", p1: "Yes (3x/mo)", p2: "Yes (Unlimited)", p3: "Yes (Unlimited)", p4: "Yes (Unlimited)" },
                        { name: "Weekend Meals", p1: "No", p2: "No", p3: "Yes", p4: "Optional" },
                        { name: "Family Portions", p1: "No", p2: "No", p3: "Yes (Up to 4)", p4: "Optional" },
                        { name: "Customization", p1: "Basic", p2: "Medium", p3: "High Selection", p4: "Full Custom" },
                        { name: "Priority Support", p1: "No", p2: "Yes", p3: "Yes (Direct Chef)", p4: "Yes" }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-primary-text">{row.name}</td>
                          <td className="py-3">{row.p1 === "No" ? <span className="text-slate-300">✕</span> : row.p1}</td>
                          <td className="py-3 text-mint font-extrabold">{row.p2}</td>
                          <td className="py-3">{row.p3}</td>
                          <td className="py-3">{row.p4}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PLAN BENEFITS SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { title: "Fresh Daily Cooking", desc: "Prepared every morning." },
                { title: "Flexible Scheduling", desc: "Pause or skip meals easily." },
                { title: "Home-Cooked Taste", desc: "Low oil, pure ingredients." },
                { title: "Reliable Delivery", desc: "Arrives warm and on time." },
                { title: "Affordable Pricing", desc: "No surge fees or hidden tax." }
              ].map((b) => (
                <div key={b.title} className="bg-white border border-slate-200/50 p-4 rounded-2xl shadow-card text-center flex flex-col justify-between">
                  <span className="w-7 h-7 rounded-full bg-mint-light text-mint flex items-center justify-center mx-auto mb-2 text-xs">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <h4 className="text-[10px] font-extrabold text-primary-text leading-tight">{b.title}</h4>
                  <p className="text-[8px] text-secondary-text mt-1 leading-normal">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* FAQ ACCORDION SECTION */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
                <HelpCircle size={15} className="text-mint" />
                <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider">Frequently Asked Questions</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center text-xs font-bold text-primary-text hover:text-mint cursor-pointer text-left gap-3"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={16} className="text-mint flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                      </button>
                      
                      {isOpen && (
                        <p className="mt-2 text-[11px] text-secondary-text leading-relaxed font-semibold transition-all">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CUSTOMER REVIEWS FEED */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider">
                  Testimonials from Subscribers
                </h3>
              </div>

              {activeLoading ? (
                <div className="space-y-3">
                  <ReviewSkeleton />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4 text-xs text-secondary-text leading-relaxed">
                  {[
                    { name: "Nikhil Panchal", comment: "The Lunch + Dinner plan saved me so much time. I don't have to worry about cooking after long classes in Vidyanagar.", date: "June 08, 2026" },
                    { name: "Vaishali Amin", comment: "Food quality is consistently excellent. The flexible pause feature is extremely useful during travels.", date: "June 07, 2026" }
                  ].map((rev, index) => (
                    <div key={index} className="p-4 bg-snow border border-slate-150 rounded-2xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">{rev.name}</span>
                        <span className="text-[9px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="italic font-medium">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECOMMENDED PACKAGE BANNER */}
            <div className="bg-mint-light border-2 border-mint/20 rounded-3xl p-6 shadow-card flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-mint/5 rounded-full pointer-events-none"></div>
              <div>
                <span className="text-[9px] font-black bg-mint text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Best Value Recommendation</span>
                <h4 className="text-sm font-black text-primary-text mt-1.5">Lunch + Dinner Subscription</h4>
                <p className="text-[10px] text-secondary-text mt-0.5 leading-relaxed max-w-md">Provides complete weekly coverage, express delivery, and full pause/resume capabilities for just ₹3,499/month.</p>
              </div>
              <button 
                onClick={() => handleSelectPlan(plans[1])}
                className="w-full sm:w-auto px-5 py-2.5 bg-mint hover:bg-mint-hover text-white text-[11px] font-black rounded-xl shadow-sm cursor-pointer transition-colors"
              >
                Choose Recommend Plan
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Global Page Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TiffinTrack. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

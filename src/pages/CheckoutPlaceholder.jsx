import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Building,
  Loader2,
  Utensils
} from 'lucide-react';

export default function CheckoutPlaceholder() {
  const navigate = useNavigate();

  // Load checkout details
  const [selectedPlan] = useState(() => {
    const saved = localStorage.getItem('tiffintrack_checkout_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback default mock plan
    return {
      chefId: 1,
      chefName: "Priya's Home Kitchen",
      planName: "Lunch + Dinner Plan",
      price: 3499,
      duration: "month",
      mealsRemaining: 52
    };
  });

  // Form states
  const [fullName, setFullName] = useState("Anishka Parekh");
  const [phoneNumber, setPhoneNumber] = useState("98765-43210");
  const [address, setAddress] = useState("Flat 402, Green Meadows, Shastri Marg");
  const [city, setCity] = useState("Vallabh Vidyanagar");
  const [pincode, setPincode] = useState("388120");
  const [deliverySlot, setDeliverySlot] = useState(() => {
    if (selectedPlan.planName.includes("Lunch Only")) return "lunch";
    if (selectedPlan.planName.includes("Dinner Only")) return "dinner";
    return "both";
  });
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'cod' | 'card'

  // Loading & success overlay states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      // Write active subscription to localStorage
      const activeSub = {
        vendorId: selectedPlan.chefId,
        vendorName: selectedPlan.chefName,
        planName: selectedPlan.planName,
        mealsRemaining: selectedPlan.mealsRemaining,
        status: 'Active',
        nextDelivery: deliverySlot === 'dinner' ? 'Tomorrow, 7:45 PM' : 'Tomorrow, 12:45 PM',
        price: selectedPlan.price
      };
      
      localStorage.setItem('tiffintrack_active_subscription', JSON.stringify(activeSub));
      localStorage.removeItem('tiffintrack_checkout_plan');

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(`/vendor/${selectedPlan.chefId}/plans`)}
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
          <span className="text-xs font-semibold text-secondary-text">Secured Checkout</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-4 flex-grow grid md:grid-cols-12 gap-6 items-start mt-4">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-7 space-y-6">
          
          {/* Delivery Details block */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center">
              <MapPin size={15} className="text-mint mr-2" />
              Delivery Details
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint font-semibold bg-snow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-350" size={12} />
                    <input 
                      type="text" 
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint font-semibold bg-snow"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Street Address / Flat No.</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 text-slate-350" size={12} />
                  <input 
                    type="text" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint font-semibold bg-snow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">City</label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint font-semibold bg-snow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider">Pincode</label>
                  <input 
                    type="text" 
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint font-semibold bg-snow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Slot Selection */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center">
              <Clock size={15} className="text-mint mr-2" />
              Preferred Delivery Timings
            </h3>

            <div className="space-y-3">
              <span className="text-[10px] text-secondary-text leading-normal block font-semibold">
                Select when you want your meals dropped off by the local courier.
              </span>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'lunch', label: 'Lunch Only', desc: '12:00 PM - 2:00 PM' },
                  { value: 'dinner', label: 'Dinner Only', desc: '7:30 PM - 9:30 PM' },
                  { value: 'both', label: 'Lunch & Dinner', desc: 'Both Delivery slots' }
                ].map((slot) => {
                  const isDisabled = selectedPlan.planName.includes("Lunch Only") && slot.value !== 'lunch';
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setDeliverySlot(slot.value)}
                      className={`p-3 border-2 rounded-2xl text-center flex flex-col justify-between h-[85px] cursor-pointer transition-all ${
                        isDisabled 
                          ? 'opacity-40 cursor-not-allowed border-slate-100'
                          : deliverySlot === slot.value
                            ? 'border-mint bg-mint-light/40 ring-2 ring-mint-light'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <span className={`text-[10px] font-black block ${deliverySlot === slot.value ? 'text-mint' : 'text-primary-text'}`}>
                        {slot.label}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-semibold">{slot.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Method mock selector */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="text-sm font-extrabold text-primary-text uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center">
              <CreditCard size={15} className="text-mint mr-2" />
              Simulated Payment Mode
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'upi', label: 'UPI QR Code', desc: 'Scan and pay instantly' },
                { value: 'cod', label: 'Cash / COD Option', desc: 'Pay courier weekly' }
              ].map((pm) => (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => setPaymentMethod(pm.value)}
                  className={`p-3.5 border-2 rounded-2xl text-left flex flex-col justify-between h-[80px] cursor-pointer transition-all ${
                    paymentMethod === pm.value
                      ? 'border-mint bg-mint-light/40 ring-2 ring-mint-light'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <span className={`text-xs font-black block ${paymentMethod === pm.value ? 'text-mint' : 'text-primary-text'}`}>
                    {pm.label}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1 font-semibold">{pm.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </form>

        {/* Plan Summary Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
            <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-slate-100 pb-2.5">
              Subscription Summary
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-snow rounded-2xl border border-slate-150 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase">Vendor Chef</span>
                <span className="font-black text-primary-text block">{selectedPlan.chefName}</span>
                
                <span className="text-[9px] text-slate-400 font-extrabold uppercase pt-2 block">Meal Package</span>
                <span className="font-black text-mint block">{selectedPlan.planName}</span>
              </div>

              <div className="space-y-2.5 pt-1.5 font-semibold text-slate-650">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="text-primary-text">₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hygienic Packaging</span>
                  <span className="text-mint font-extrabold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Delivery Fee</span>
                  <span className="text-mint font-extrabold">FREE</span>
                </div>
              </div>

              <div className="border-t border-slate-150 pt-3 flex justify-between items-center">
                <span className="text-sm font-black text-primary-text">Total Cost</span>
                <div className="text-right">
                  <span className="text-lg font-black text-mint">₹{selectedPlan.price}</span>
                  <span className="text-[9px] text-slate-400 block font-bold">/Month (Inclusive of GST)</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-mint hover:bg-mint-hover text-white text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    <span>Complete & Subscribe</span>
                  </>
                )}
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

      {/* Success Tick Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-sm text-center shadow-2xl space-y-4 animate-scale-up">
            <div className="w-16 h-16 bg-mint-light text-mint rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-black text-primary-text">Subscription Confirmed!</h2>
              <p className="text-xs text-secondary-text leading-relaxed font-semibold">
                Successfully subscribed to <span className="text-mint font-black">{selectedPlan.chefName}</span>. Your first tiffin drop-off will arrive tomorrow.
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold animate-pulse">
              Redirecting back to dashboard...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

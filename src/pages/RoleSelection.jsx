import { useNavigate } from 'react-router-dom';
import { 
  Salad, 
  ChefHat, 
  LayoutDashboard, 
  CalendarRange, 
  Utensils, 
  MapPin, 
  PauseCircle, 
  ArrowRight,
  ShieldCheck,
  Gift,
  Bike
} from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans selection:bg-mint selection:text-white flex flex-col justify-between">
      
      {/* Main Content */}
      <div>
        {/* Navigation Bar - Solid White, Simple Border */}
        <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-primary-text tracking-tight">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>

            {/* Promo Banner - Lemon Yellow */}
            <div className="hidden sm:flex items-center space-x-2 bg-lemon px-3 py-1 rounded-full text-[11px] font-bold text-primary-text">
              <Gift size={12} />
              <span>Get 20% off your first week with code FRESH20</span>
            </div>

            {/* Platform Status Badge */}
            <div className="flex items-center space-x-1.5 text-xs text-secondary-text bg-snow px-2.5 py-1 rounded-lg border border-slate-200/40">
              <span className="w-2 h-2 rounded-full bg-mint"></span>
              <span className="font-medium">100% Hygienic Certified</span>
            </div>
          </div>
        </nav>

        {/* Premium Hero Section with Food Background and Soft Overlay */}
        <header className="relative overflow-hidden bg-slate-900 py-20 md:py-28 px-4 text-center text-white mb-10 rounded-b-[2.5rem] shadow-xl">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/tiffin_hero_bg.png" 
              alt="Homemade food backdrop" 
              className="w-full h-full object-cover object-center filter blur-[1px] brightness-[0.4] scale-105"
            />
            {/* Warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3E2723]/30 to-[#3E2723]/70 opacity-90"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Soft badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-mint/95 text-white uppercase tracking-wider mb-6 animate-pulse">
              🍲 Homely & Fresh
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md">
              Healthy Homemade Meals Delivered Daily
            </h1>
            <p className="text-sm md:text-lg text-yellow-50/90 max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-sm font-medium">
              Connecting customers with trusted local tiffin providers through flexible subscriptions.
            </p>
            
            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button 
                onClick={() => navigate('/customer-auth')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-mint hover:bg-mint-hover text-white font-extrabold text-xs transition-all duration-350 transform hover:-translate-y-0.5 hover:shadow-lg shadow-mint/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Explore Plans</span>
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => navigate('/vendor/login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all duration-350 border border-white/20 backdrop-blur-sm cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Become a Vendor</span>
              </button>
            </div>
          </div>
        </header>

        {/* Onboarding Role Cards - Visible above the fold */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1: Customer */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-mint min-h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider text-mint uppercase px-2.5 py-1 bg-mint-light rounded-md">
                    Order Meals
                  </span>
                  <div className="p-2.5 bg-mint-light rounded-xl text-mint">
                    <Salad size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Customer Portal</h3>
                <p className="text-secondary-text text-xs md:text-sm leading-relaxed mb-6">
                  Browse local kitchens, select meal plans, pause your meals when you're away, and track today's delivery status in real-time.
                </p>
              </div>

              <button 
                onClick={() => navigate('/customer-auth')}
                className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Enter Customer Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 2: Vendor */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-mint min-h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider text-mint uppercase px-2.5 py-1 bg-mint-light rounded-md">
                    Manage Kitchen
                  </span>
                  <div className="p-2.5 bg-mint-light rounded-xl text-mint">
                    <ChefHat size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Vendor Portal</h3>
                <p className="text-secondary-text text-xs md:text-sm leading-relaxed mb-6">
                  Set up your virtual kitchen, publish daily dishes, manage your weekly menu in minutes, and coordinate client meal subscriptions.
                </p>
              </div>

              <button 
                onClick={() => navigate('/vendor/login')}
                className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Enter Vendor Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 3: Delivery Partner */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-mint min-h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider text-mint uppercase px-2.5 py-1 bg-mint-light rounded-md">
                    Deliver Meals
                  </span>
                  <div className="p-2.5 bg-mint-light rounded-xl text-mint">
                    <Bike size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Delivery Partner</h3>
                <p className="text-secondary-text text-xs md:text-sm leading-relaxed mb-6">
                  Access your delivery queue, view customer addresses, navigate using maps, and update order statuses in real-time.
                </p>
              </div>

              <button 
                onClick={() => navigate('/delivery-login')}
                className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Enter Partner Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Card 4: Admin */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-slate-400 min-h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider text-secondary-text uppercase px-2.5 py-1 bg-slate-100 rounded-md">
                    Administration
                  </span>
                  <div className="p-2.5 bg-slate-100 rounded-xl text-secondary-text">
                    <LayoutDashboard size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Admin Console</h3>
                <p className="text-secondary-text text-xs md:text-sm leading-relaxed mb-6">
                  Verify home kitchen licenses, manage user profiles, audit financial payouts, and review overall system delivery logistics.
                </p>
              </div>

              <button 
                onClick={() => navigate('/admin-login')}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Open Admin Console</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section - Below the Role Cards */}
        <section id="features" className="bg-white border-t border-slate-200/60 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary-text tracking-tight mb-2">
                Designed for Daily Convenience
              </h2>
              <p className="text-secondary-text text-sm max-w-xl mx-auto font-normal">
                No corporate buzzwords. Just simple, practical tools that make healthy eating straightforward.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-snow border border-slate-200/40 rounded-2xl p-6 shadow-sm">
                <div className="p-3 bg-mint-light rounded-xl text-mint w-fit mb-4">
                  <CalendarRange size={18} />
                </div>
                <h3 className="text-base font-bold text-primary-text mb-1">Choose a plan that fits your routine</h3>
                <p className="text-secondary-text text-xs leading-relaxed">
                  Select a flexible weekly or monthly cycle. Pick the days you need delivery and skip the rest.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-snow border border-slate-200/40 rounded-2xl p-6 shadow-sm">
                <div className="p-3 bg-mint-light rounded-xl text-mint w-fit mb-4">
                  <PauseCircle size={18} />
                </div>
                <h3 className="text-base font-bold text-primary-text mb-1">Pause your meals when you're away</h3>
                <p className="text-secondary-text text-xs leading-relaxed">
                  Going out of town? Freeze your active subscription in one tap and receive delivery credit.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-snow border border-slate-200/40 rounded-2xl p-6 shadow-sm">
                <div className="p-3 bg-mint-light rounded-xl text-mint w-fit mb-4">
                  <MapPin size={18} />
                </div>
                <h3 className="text-base font-bold text-primary-text mb-1">Track today's delivery status</h3>
                <p className="text-secondary-text text-xs leading-relaxed">
                  Monitor preparation milestones and follow the courier in real-time until they reach your door.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-snow border border-slate-200/40 rounded-2xl p-6 shadow-sm">
                <div className="p-3 bg-mint-light rounded-xl text-mint w-fit mb-4">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="text-base font-bold text-primary-text mb-1">Hygienic Home Cooking</h3>
                <p className="text-secondary-text text-xs leading-relaxed">
                  Every home kitchen undergoes rigorous sanitation audits to ensure quality and food safety standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Banner - Lemon Yellow Accent */}
        <section className="bg-lemon-light border-y border-slate-200/60 py-10 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-lg font-bold text-primary-text mb-6">TiffinTrack by the Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200/40 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl font-extrabold text-mint">150+</div>
                <div className="text-[10px] text-secondary-text uppercase font-bold tracking-wider mt-1">Verified Chefs</div>
              </div>
              <div className="bg-white border border-slate-200/40 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl font-extrabold text-mint">10,000+</div>
                <div className="text-[10px] text-secondary-text uppercase font-bold tracking-wider mt-1">Meals Delivered</div>
              </div>
              <div className="bg-white border border-slate-200/40 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl font-extrabold text-mint">4.9 ★</div>
                <div className="text-[10px] text-secondary-text uppercase font-bold tracking-wider mt-1">Chef Rating</div>
              </div>
              <div className="bg-white border border-slate-200/40 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl font-extrabold text-mint">100%</div>
                <div className="text-[10px] text-secondary-text uppercase font-bold tracking-wider mt-1">Hygienic Rating</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-8 text-center text-secondary-text text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-mint flex items-center justify-center">
              <Utensils className="text-white" size={12} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-primary-text">TiffinTrack</span>
          </div>
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

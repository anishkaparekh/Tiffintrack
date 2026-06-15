import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Search, 
  Utensils, 
  Inbox,
  Download,
  RotateCcw,
  FileText,
  X,
  Filter,
  CheckCircle2
} from 'lucide-react';

// Import Sidebar component
import Sidebar from '../components/Sidebar';

// SKELETON LOADERS FOR ORDER HISTORY
const SkeletonHistoryRow = () => (
  <div className="bg-white border border-slate-200/50 rounded-2xl p-4 shadow-card animate-pulse flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="space-y-2.5 flex-grow">
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
    </div>
    <div className="flex gap-2 w-full sm:w-auto items-center justify-between sm:justify-end border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
      <div className="h-5 bg-slate-200 rounded w-12 sm:text-right"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
    </div>
  </div>
);

const HistorySkeleton = () => (
  <div className="space-y-4">
    <SkeletonHistoryRow />
    <SkeletonHistoryRow />
    <SkeletonHistoryRow />
    <SkeletonHistoryRow />
  </div>
);

// Mock Previous Deliveries database
const mockOrders = [
  {
    id: "ORD-928421",
    date: "09 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Gujarati Lunch Thali",
    mealDescription: "3 Soft Phulkas, Sweet Gujarati Dal, Rice, Bhindi Masala, Organic Chhas",
    amount: 135,
    status: "Delivered",
    riderName: "Rahul Kumar",
    deliveryTime: "12:41 PM",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-928110",
    date: "08 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Gujarati Dinner Thali",
    mealDescription: "Bajra Rotla, Ringan Oro, Khichdi-Kadhi, Garlic Chutney, Buttermilk",
    amount: 135,
    status: "Delivered",
    riderName: "Rahul Kumar",
    deliveryTime: "8:05 PM",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-928045",
    date: "08 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Gujarati Lunch Thali",
    mealDescription: "3 Phulkas, Aloo Rasawala, Dal-Rice, Papad, Salad",
    amount: 135,
    status: "Skipped",
    riderName: "N/A",
    deliveryTime: "N/A",
    paymentMethod: "Account Balance Credits"
  },
  {
    id: "ORD-927514",
    date: "07 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Sunday Special Dinner Feast",
    mealDescription: "Paneer Tikka Masala, Veg Pulao, Butter Naan, Gulab Jamun (1 pc)",
    amount: 160,
    status: "Delivered",
    riderName: "Sanjay Patel",
    deliveryTime: "8:12 PM",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-926912",
    date: "06 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Gujarati Lunch Thali",
    mealDescription: "3 Phulkas, Mix Veg Sabji, Dal-Rice, Buttermilk",
    amount: 135,
    status: "Delivered",
    riderName: "Rahul Kumar",
    deliveryTime: "12:43 PM",
    paymentMethod: "UPI (Google Pay)"
  },
  {
    id: "ORD-925842",
    date: "05 June 2026",
    vendorId: 1,
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealName: "Gujarati Dinner Thali",
    mealDescription: "Puri (5 pcs), Aloo Dum, Sukhi Khichdi, Kadhi, Pickle",
    amount: 135,
    status: "Cancelled",
    riderName: "N/A",
    deliveryTime: "N/A",
    paymentMethod: "Refunded to UPI Card"
  },
  {
    id: "ORD-892415",
    date: "31 May 2026",
    vendorId: 7,
    vendorName: "Student Budget Tiffins",
    planName: "Basic Homestyle Plan",
    mealName: "Budget Student Dinner Box",
    mealDescription: "4 Rotis, Aloo Jeera Dry, Yellow Dal Tadka, Pickle",
    amount: 50,
    status: "Delivered",
    riderName: "Vikram Rathod",
    deliveryTime: "8:25 PM",
    paymentMethod: "Cash on Delivery"
  },
  {
    id: "ORD-892014",
    date: "30 May 2026",
    vendorId: 7,
    vendorName: "Student Budget Tiffins",
    planName: "Basic Homestyle Plan",
    mealName: "Budget Student Dinner Box",
    mealDescription: "4 Rotis, Sev Tamatar Sabji, Dal, Rice",
    amount: 50,
    status: "Delivered",
    riderName: "Vikram Rathod",
    deliveryTime: "8:31 PM",
    paymentMethod: "Cash on Delivery"
  }
];

export default function OrderHistory() {
  const navigate = useNavigate();

  // Mobile sidebar layout drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search & Filter criteria states
  const [searchText, setSearchText] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("All"); // All | Today | Last7Days | Last30Days | Custom
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All"); // All | under100 | between100and200 | over200
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Sub section tabs
  const [activeTab, setActiveTab] = useState("all"); // all | recent | completed | cancelled

  // Sandbox simulation controls
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [simulatedEmptyState, setSimulatedEmptyState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active receipt details modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Alert Notifications stack
  const [toastMessage, setToastMessage] = useState(null);

  // Simulated initial loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync route navigations from sidebar tabs click
  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      navigate('/my-subscriptions');
    } else if (tabId === 'track_orders') {
      navigate('/track-orders');
    } else if (tabId === 'addresses') {
      navigate('/customer/addresses');
    } else if (tabId === 'history') {
      // already here
    } else if (tabId === 'settings') {
      navigate('/profile-settings');
    } else if (tabId === 'notifications') {
      navigate('/notifications');
    } else {
      navigate('/customer-dashboard');
    }
  };

  // Reorder Meal handler simulation
  const handleReorderMeal = (order) => {
    setToastMessage({
      type: "success",
      text: `Successfully reordered ${order.mealName} from ${order.vendorName}! Added to tiffin stack.`
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Download Receipt handler simulation
  const handleDownloadReceipt = (order) => {
    setToastMessage({
      type: "success",
      text: `Receipt for ${order.id} downloaded successfully as PDF!`
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter list logic
  const filteredOrders = mockOrders.filter(order => {
    // 1. Search text match
    const searchMatch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                        order.vendorName.toLowerCase().includes(searchText.toLowerCase()) ||
                        order.mealName.toLowerCase().includes(searchText.toLowerCase());

    // 2. Vendor match
    const vendorMatch = selectedVendor === "All" || order.vendorName === selectedVendor;

    // 3. Status match
    const statusMatch = selectedStatus === "All" || order.status === selectedStatus;

    // 4. Price range match
    let priceMatch = true;
    if (selectedPriceRange === "under100") {
      priceMatch = order.amount < 100;
    } else if (selectedPriceRange === "between100and200") {
      priceMatch = order.amount >= 100 && order.amount <= 200;
    } else if (selectedPriceRange === "over200") {
      priceMatch = order.amount > 200;
    }

    // 5. Date Range match
    let dateMatch = true;
    if (selectedDateRange === "Today") {
      // Mock comparison: "09 June 2026"
      dateMatch = order.date.includes("09 June 2026");
    } else if (selectedDateRange === "Last7Days") {
      // Mock comparison: matches June dates (all June dates are within last 7 days in our mock system)
      dateMatch = order.date.includes("June");
    } else if (selectedDateRange === "Last30Days") {
      dateMatch = true; // All dates fit in 30 days
    } else if (selectedDateRange === "Custom" && customStartDate && customEndDate) {
      // Basic mock range check
      dateMatch = true;
    }

    return searchMatch && vendorMatch && statusMatch && priceMatch && dateMatch;
  });

  // Split list by sub tabs
  const tabFilteredOrders = filteredOrders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "recent") {
      // recent = last 3 orders
      return order.date.includes("09 June") || order.date.includes("08 June");
    }
    if (activeTab === "completed") {
      return order.status === "Delivered";
    }
    if (activeTab === "cancelled") {
      return order.status === "Cancelled" || order.status === "Skipped";
    }
    return true;
  });

  const activeLoading = isLoading || forceLoadingState;
  const isListEmpty = simulatedEmptyState || tabFilteredOrders.length === 0;

  // Extract unique vendors for filter dropdown
  const vendorOptions = ["All", ...new Set(mockOrders.map(o => o.vendorName))];

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="history" 
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
            {/* Developer Sandbox Controls */}
            <div className="hidden md:flex items-center space-x-2.5 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
              <span className="text-slate-450 uppercase text-[9px] tracking-wider">Sandbox Panel:</span>
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
                  checked={simulatedEmptyState} 
                  onChange={(e) => setSimulatedEmptyState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Empty Lists</span>
              </label>

              <button 
                onClick={() => {
                  setSearchText("");
                  setSelectedDateRange("All");
                  setSelectedVendor("All");
                  setSelectedStatus("All");
                  setSelectedPriceRange("All");
                  setActiveTab("all");
                  setSimulatedEmptyState(false);
                }}
                className="px-2 py-0.5 border border-slate-200 bg-white hover:bg-slate-100 rounded text-[9px] text-slate-700 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-150 px-3 py-1 rounded-lg">Order History</span>
          </div>
        </header>

        {/* Dynamic Toast Feed */}
        {toastMessage && (
          <div className="bg-mint text-white text-xs font-extrabold px-6 py-3 shadow-md flex items-center justify-between sticky top-16 z-30 transition-all animate-slide-down">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={16} />
              <span>{toastMessage.text}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-white/80 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="p-6 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Section Introduction Header */}
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl font-black text-primary-text tracking-tight">
              Order History
            </h1>
            <p className="text-xs text-secondary-text mt-0.5 font-medium">
              Review your previous home-cooked tiffin deliveries, skipped dates, and payments.
            </p>
          </div>

          {/* Filtering and Search Grid Box */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Filter size={14} className="text-mint" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Search & Audit Filters
              </h3>
            </div>

            {/* Inputs grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Search text */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Keyword Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-450" size={13} />
                  <input 
                    type="text" 
                    placeholder="Order ID, Vendor..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint rounded-xl text-xs bg-snow font-semibold placeholder-slate-450"
                  />
                </div>
              </div>

              {/* Vendor select */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Home Chef Kitchen</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-mint rounded-xl text-xs bg-snow font-semibold cursor-pointer text-slate-700"
                >
                  {vendorOptions.map((vendor, idx) => (
                    <option key={idx} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Delivery Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-mint rounded-xl text-xs bg-snow font-semibold cursor-pointer text-slate-700"
                >
                  <option value="All">All statuses</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Skipped">Skipped by customer</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Select */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Date Range</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-mint rounded-xl text-xs bg-snow font-semibold cursor-pointer text-slate-700"
                >
                  <option value="All">All dates</option>
                  <option value="Today">Today (June 9)</option>
                  <option value="Last7Days">Last 7 days</option>
                  <option value="Last30Days">Last 30 days</option>
                  <option value="Custom">Custom interval</option>
                </select>
              </div>

            </div>

            {/* Custom dates and Price filter */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 items-end">
              {/* Price filter dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Price Range (Per meal)</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:border-mint rounded-xl text-xs bg-snow font-semibold cursor-pointer text-slate-700"
                >
                  <option value="All">All pricing tiers</option>
                  <option value="under100">Under ₹100</option>
                  <option value="between100and200">₹100 - ₹200</option>
                  <option value="over200">Over ₹200</option>
                </select>
              </div>

              {selectedDateRange === "Custom" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase block">Start Date</label>
                    <input 
                      type="date" 
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow text-slate-700 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase block">End Date</label>
                    <input 
                      type="date" 
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow text-slate-700 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tab switches */}
          <div className="border-b border-slate-200 flex space-x-6 text-xs font-bold text-slate-450">
            {[
              { id: "all", label: "All Logs" },
              { id: "recent", label: "Recent Orders" },
              { id: "completed", label: "Completed Orders" },
              { id: "cancelled", label: "Cancelled & Skipped" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  activeTab === tab.id 
                    ? 'text-mint font-black' 
                    : 'hover:text-primary-text'
                }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mint rounded-full animate-fade-in"></span>
                )}
              </button>
            ))}
          </div>

          {/* List display */}
          {activeLoading ? (
            <HistorySkeleton />
          ) : isListEmpty ? (
            /* EMPTY STATES */
            <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                <Inbox size={36} />
              </div>
              <h3 className="text-base font-black text-primary-text mb-1">No Orders Found</h3>
              <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed font-semibold">
                No orders match your search parameters or tab selections. Adjust filters to search past meal deliveries.
              </p>
              <button
                onClick={() => {
                  setSearchText("");
                  setSelectedDateRange("All");
                  setSelectedVendor("All");
                  setSelectedStatus("All");
                  setSelectedPriceRange("All");
                  setActiveTab("all");
                  setSimulatedEmptyState(false);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Clear All Audit Filters
              </button>
            </div>
          ) : (
            /* HISTORICAL LOG TABLE */
            <div className="space-y-4">
              {tabFilteredOrders.map((order) => {
                const isDelivered = order.status === "Delivered";
                const isSkipped = order.status === "Skipped";
                const isCancelled = order.status === "Cancelled";

                return (
                  <div 
                    key={order.id}
                    className="bg-white border border-slate-200/50 hover:border-slate-250 hover:shadow-md rounded-2xl p-4 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    {/* Order Meta details */}
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 font-mono tracking-tight">{order.id}</span>
                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                        <span className="text-[10px] text-secondary-text font-bold">{order.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                        
                        {isDelivered && (
                          <span className="text-[8px] font-black text-mint bg-mint-light px-2 py-0.5 rounded border border-mint/10 uppercase tracking-wide">
                            Delivered
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/30 uppercase tracking-wide">
                            Skipped
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-200/20 uppercase tracking-wide">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-black text-primary-text flex items-center gap-1">
                        <span>{order.mealName}</span>
                        <span className="text-[9px] text-slate-450 font-semibold">({order.planName})</span>
                      </h4>
                      
                      <p className="text-[10px] text-slate-500 font-bold">
                        Kitchen: {order.vendorName} • <span className="font-semibold">{order.mealDescription}</span>
                      </p>
                    </div>

                    {/* Pricing and Action tools */}
                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end border-t md:border-t-0 border-slate-50 pt-3 md:pt-0 gap-4">
                      <div className="text-left md:text-right flex-shrink-0">
                        <span className="text-[8px] font-black text-slate-400 uppercase block">Amount Paid</span>
                        <span className="text-sm font-black text-primary-text">₹{order.amount}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(order)}
                          className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                          title="Download Receipt"
                        >
                          <Download size={12} />
                        </button>
                        <button
                          onClick={() => handleReorderMeal(order)}
                          className="p-2 bg-mint-light hover:bg-mint-light/80 text-mint border border-mint/10 rounded-xl transition cursor-pointer"
                          title="Reorder Meal"
                        >
                          <RotateCcw size={12} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/60 py-6 text-center mt-12">
          <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
            <div>TiffinTrack Orders History Ledger</div>
            <div>© 2026 TiffinTrack. All transaction logs secured.</div>
          </div>
        </footer>

      </div>

      {/* DETAILED RECEIPT INVOICE MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Invoice: {selectedOrderDetails.id}</span>
                <h4 className="text-sm font-extrabold text-primary-text mt-0.5">Tiffin Delivery Invoice</h4>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-lg transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal content body */}
            <div className="space-y-4 text-xs font-semibold text-slate-650">
              
              {/* Status details */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[10px]">
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span>Date: {selectedOrderDetails.date}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  selectedOrderDetails.status === "Delivered" 
                    ? "text-mint bg-mint-light border border-mint/10" 
                    : "text-red-500 bg-red-50 border border-red-200/20"
                }`}>
                  {selectedOrderDetails.status}
                </span>
              </div>

              {/* Vendor info */}
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Home Chef Kitchen</span>
                <span className="font-extrabold text-primary-text block mt-0.5">{selectedOrderDetails.vendorName}</span>
                <span className="text-[10px] text-slate-450 mt-0.5 block">Tiffin Cycle: {selectedOrderDetails.planName}</span>
              </div>

              {/* Meal menu */}
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Delivered Meal Menu</span>
                <span className="font-medium text-slate-650 leading-relaxed block mt-1 p-2 bg-snow rounded-lg border border-slate-100/50">
                  {selectedOrderDetails.mealName} — {selectedOrderDetails.mealDescription}
                </span>
              </div>

              {/* Courier info */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Delivery Rider</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">{selectedOrderDetails.riderName}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Drop-off Time</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">{selectedOrderDetails.deliveryTime}</span>
                </div>
              </div>

              {/* Pricing list */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span>Daily Tiffin Cost</span>
                  <span>₹{selectedOrderDetails.amount}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Courier Packaging fee</span>
                  <span className="text-mint">FREE</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Local GST Taxes</span>
                  <span className="text-mint">FREE</span>
                </div>
                
                <div className="flex justify-between items-center text-primary-text font-black text-xs border-t border-slate-100/50 pt-2">
                  <span className="uppercase tracking-wider text-slate-400 font-extrabold text-[9px]">Total Paid (via {selectedOrderDetails.paymentMethod.split(" ")[0]})</span>
                  <span className="text-mint text-sm">₹{selectedOrderDetails.amount}</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-3 border-t border-slate-100 text-xs font-bold justify-end">
              <button 
                onClick={() => {
                  handleDownloadReceipt(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Download Invoice</span>
              </button>
              <button 
                onClick={() => {
                  handleReorderMeal(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="px-4 py-2 bg-mint hover:bg-mint-hover text-white rounded-xl cursor-pointer shadow-sm"
              >
                Reorder Meal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

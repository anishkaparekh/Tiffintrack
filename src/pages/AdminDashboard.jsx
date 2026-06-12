import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Shield, 
  Users, 
  ChefHat, 
  AlertTriangle, 
  FileCheck, 
  LineChart, 
  Settings as SettingsIcon, 
  Bell, 
  LogOut, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  Plus, 
  RefreshCw, 
  ArrowRight, 
  X
} from 'lucide-react';

// Pure ID generation and random utility helpers (defined outside component to satisfy compiler constraints)
const getNewVendorId = () => `VND-${Math.floor(Math.random() * 800) + 200}`;
const getNewActivityId = () => `ACT-${Date.now()}`;
const getNewComplaintId = () => `CMP-${Math.floor(Math.random() * 8000) + 1000}`;
const getNewNotificationId = () => `NT-${Date.now()}`;
const getNewAppId = () => `APP-${Math.floor(Math.random() * 800) + 100}`;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];


// Verification Skeleton Loader Row
const SkeletonVerificationRow = () => (
  <tr className="animate-pulse border-b border-slate-100 bg-white">
    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
    <td className="px-6 py-4.5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    <td className="px-6 py-4.5"><div className="h-5 bg-slate-200 rounded-full w-14"></div></td>
    <td className="px-6 py-4.5 flex space-x-2"><div className="h-7 bg-slate-200 rounded-lg w-16"></div><div className="h-7 bg-slate-200 rounded-lg w-12"></div></td>
  </tr>
);



// Dynamic mock databases
const initialApplications = [];

const initialVendors = [];

const initialComplaints = [
  { id: "CMP-8910", reportedUser: "Mom's Punjabi Rasoi (Vendor)", category: "Food Quality Complaint", date: "09 June 2026", priority: "High", status: "Open", message: "Customer reported that the paneer curry was excessively spicy and oily, contrary to the 'Low Oil' subscription choice.", target: "Mom's Punjabi Rasoi", userType: "Vendor", reporter: "Anishka Parekh" },
  { id: "CMP-8911", reportedUser: "Rahul Verma (Customer)", category: "Customer Misconduct", date: "09 June 2026", priority: "Medium", status: "Open", message: "Vendor reported that the customer repeatedly shouted at the courier rider Rahul Kumar regarding a 5-minute rain delay.", target: "Rahul Verma", userType: "Customer", reporter: "Priya's Home Kitchen" },
  { id: "CMP-8912", reportedUser: "Healthy Meals Hub (Vendor)", category: "Late Delivery", date: "08 June 2026", priority: "High", status: "In Progress", message: "Delivery occurred at 2:15 PM instead of the committed 1:00 PM lunch window for three consecutive days.", target: "Healthy Meals Hub", userType: "Vendor", reporter: "Vikram Rathod" },
  { id: "CMP-8913", reportedUser: "Karan Sharma (Customer)", category: "Refund Dispute", date: "07 June 2026", priority: "Low", status: "Open", message: "Customer claims they skipped the tiffin on 06 June but did not receive wallet credits. Vendor states skip was requested after cutoff.", target: "Karan Sharma", userType: "Customer", reporter: "Student Budget Tiffins" },
  { id: "CMP-8914", reportedUser: "Spice Delight (Vendor)", category: "Fake Reviews", date: "05 June 2026", priority: "High", status: "Escalated", message: "Competitor reported that Spice Delight kitchen accounts registered multiple fake customer accounts to inflate ratings.", target: "Spice Delight", userType: "Vendor", reporter: "System Integrity Bot" }
];

const initialCustomers = [
  { id: "CST-201", name: "Anishka Parekh", activeSub: "Gujarati Lunch Plan", reports: 0, status: "Active", email: "parekhanishka@gmail.com" },
  { id: "CST-202", name: "Vikram Rathod", activeSub: "Punjabi Veg Plan", reports: 1, status: "Active", email: "vikram@gmail.com" },
  { id: "CST-203", name: "Rahul Verma", activeSub: "None", reports: 4, status: "Warned", email: "rahulv@gmail.com" },
  { id: "CST-204", name: "Hiten Dave", activeSub: "Satvik Regular Plan", reports: 0, status: "Active", email: "hitendave@gmail.com" },
  { id: "CST-205", name: "Kunal Shah", activeSub: "Basic Student Box", reports: 8, status: "Suspended", email: "kshah@gmail.com" }
];

const initialNotifications = [
  { id: "NT-1", title: "🚨 High Complaint Volume Alert", message: "Vendor 'Quick Chow Meals' received 5 food quality reports in the last 24 hours.", timestamp: "10 mins ago", severity: "High", isRead: false },
  { id: "NT-2", title: "📝 New Vendor Verification", message: "Chef Asif Khan has submitted an application for 'Royal Biryani Kitchen'.", timestamp: "1 hour ago", severity: "Medium", isRead: false },
  { id: "NT-3", title: "🔒 Fraudulent Account Flagged", message: "Customer 'Kunal Shah' flagged by automated filter for spamming cancel actions.", timestamp: "4 hours ago", severity: "High", isRead: false },
  { id: "NT-4", title: "⚙️ System Maintenance reminder", message: "TiffinTrack database optimization scheduled for 14 June, 2:00 AM - 4:00 AM.", timestamp: "1 day ago", severity: "Low", isRead: true }
];

const initialActivities = [
  { id: "ACT-1", text: "New vendor 'Royal Biryani Kitchen' applied for kitchen verification.", time: "20 mins ago" },
  { id: "ACT-2", text: "Administrator resolved food quality complaint #CMP-8910 (Refund Issued).", time: "1 hour ago" },
  { id: "ACT-3", text: "Warning notice issued to vendor 'Mom's Punjabi Rasoi' regarding spicy food.", time: "3 hours ago" },
  { id: "ACT-4", text: "Vendor account 'Quick Chow Meals' suspended due to high complaint rate.", time: "1 day ago" },
  { id: "ACT-5", text: "New chef registration approved: 'Mom's Punjabi Rasoi'.", time: "2 days ago" }
];

export default function AdminDashboard({ defaultTab = "dashboard" }) {
  const navigate = useNavigate();

  // Tab management & Mobile layout
  const activeTab = defaultTab;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [adminUser, setAdminUser] = useState({
    name: '',
    email: ''
  });

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/vendors/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const statusMap = {
            'pending': 'Pending Review',
            'under_review': 'Under Review',
            'approved': 'Approved',
            'rejected': 'Rejected'
          };
          
          const mappedApps = resData.data.map(v => ({
            id: v._id,
            name: v.businessName || v.name || 'Vendor Kitchen',
            owner: v.name || 'Vendor Owner',
            location: v.city || v.kitchenAddress || 'Anand',
            cuisine: v.description || 'Homestyle Meals',
            experience: v.mealsPerDay ? `${v.mealsPerDay} Meals/Day` : 'Homestyle',
            date: new Date(v.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            status: statusMap[v.verificationStatus] || 'Pending Review',
            phone: v.phone || 'N/A',
            email: v.email || 'N/A',
            license: 'FSSAI-1234567890'
          }));
          
          setApplications(mappedApps);
          
          const mappedVendors = resData.data.map(v => ({
            id: v._id,
            name: v.businessName || v.name || 'Vendor Kitchen',
            rating: 4.8,
            totalOrders: 0,
            complaints: 0,
            status: v.verificationStatus === 'approved' ? 'Active' : 'Warned',
            owner: v.name,
            city: v.city || 'Anand'
          }));
          
          setVendors(mappedVendors);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [activeSubCount, setActiveSubCount] = useState(0);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  const fetchActiveSubscriptionCount = async () => {
    try {
      const response = await fetch('/api/v1/subscriptions/count/active');
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && typeof resData.count === 'number') {
          setActiveSubCount(resData.count);
        }
      }
    } catch (err) {
      console.error("Failed to fetch active subscription count:", err);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await fetch('/api/v1/orders/count/stats');
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setOrderStats(resData.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch order stats:", err);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setAdminUser(u);
      } catch (e) {
        console.error("Failed to parse admin_user from localStorage in AdminDashboard:", e);
      }
    }
    fetchVendors();
    fetchActiveSubscriptionCount();
    fetchOrderStats();
  }, []);

  // Core databases
  const [applications, setApplications] = useState(initialApplications);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [vendors, setVendors] = useState(initialVendors);
  const [customers, setCustomers] = useState(initialCustomers);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activities, setActivities] = useState(initialActivities);

  // Search & Filter criteria states
  const [searchText, setSearchText] = useState("");
  const [verificationStatusFilter, setVerificationStatusFilter] = useState("All");
  const [complaintFilter, setComplaintFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");

  // Selected Detail Modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Action status messages (Toasts)
  const [toast, setToast] = useState(null);

  // Loading, Saving & Sandbox states
  const [isLoading, setIsLoading] = useState(true);
  const [sandboxForceSkel, setSandboxForceSkel] = useState(false);
  const [sandboxForceEmpty, setSandboxForceEmpty] = useState(false);

  // Synchronized URL changes from sidebar clicks
  const handleTabChange = (tabId) => {
    setIsMobileSidebarOpen(false);
    
    // Future Routes Mapping
    if (tabId === 'dashboard') {
      navigate('/admin-dashboard');
    } else if (tabId === 'verification') {
      navigate('/admin/vendor-verification');
    } else if (tabId === 'reports') {
      navigate('/admin/reports');
    } else if (tabId === 'vendor-monitoring') {
      navigate('/admin/vendor-monitoring');
    } else if (tabId === 'customer-monitoring') {
      navigate('/admin/customer-monitoring');
    } else if (tabId === 'analytics') {
      navigate('/admin/analytics');
    } else if (tabId === 'settings') {
      navigate('/admin/settings');
    } else if (tabId === 'notifications') {
      navigate('/admin/notifications');
    }
  };

  // Toast triggers
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerifyVendorAPI = async (appId, nextStatusLabel) => {
    const statusMap = {
      'Approved': 'approved',
      'Rejected': 'rejected',
      'Under Review': 'under_review',
      'Pending Review': 'pending',
      'Pending Documents': 'under_review',
      'Suspended': 'rejected'
    };
    
    const backendStatus = statusMap[nextStatusLabel] || 'pending';
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/vendors/${appId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: backendStatus })
      });
      
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        showToast(resData.message || 'Failed to verify vendor.', 'error');
        return;
      }
      
      const appName = applications.find(a => a.id === appId)?.name || 'Vendor';
      const newAct = {
        id: getNewActivityId(),
        text: `Vendor '${appName}' status updated to '${nextStatusLabel}' in MongoDB.`,
        time: "Just Now"
      };
      setActivities(prev => [newAct, ...prev]);
      showToast(`Verification status updated to "${nextStatusLabel}".`);
      setSelectedApp(null);
      fetchVendors();
    } catch (err) {
      console.error(err);
      showToast('Connection error. Failed to update status.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Vendor Verification Handlers
  const handleUpdateVerificationStatus = (appId, nextStatus) => {
    handleVerifyVendorAPI(appId, nextStatus);
  };

  const handleApproveVendor = (appId) => {
    handleVerifyVendorAPI(appId, 'Approved');
  };

  const handleRejectVendor = (appId) => {
    handleVerifyVendorAPI(appId, 'Rejected');
  };

  const handleSuspendVendorFromVerification = (appId) => {
    handleVerifyVendorAPI(appId, 'Suspended');
  };


  // Complaint handlers
  const handleComplaintStatusChange = (cmpId, nextStatus) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === cmpId) {
        return { ...c, status: nextStatus };
      }
      return c;
    }));

    const newAct = {
      id: getNewActivityId(),
      text: `Complaint #${cmpId} status updated to '${nextStatus}'.`,
      time: "Just Now"
    };
    setActivities(prev => [newAct, ...prev]);
    setSelectedComplaint(null);
    showToast(`Complaint #${cmpId} marked as ${nextStatus}.`);
  };

  // Vendor Action handlers
  const handleWarnVendor = (vndId) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vndId) {
        return { ...v, status: "Warned", complaints: v.complaints + 1 };
      }
      return v;
    }));
    const vndName = vendors.find(v => v.id === vndId)?.name;
    const newAct = {
      id: getNewActivityId(),
      text: `Issued official warning notice to vendor '${vndName}'.`,
      time: "Just Now"
    };
    setActivities(prev => [newAct, ...prev]);
    setSelectedVendor(null);
    showToast(`Official warning issued to "${vndName}".`);
  };

  const handleSuspendVendor = (vndId) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vndId) {
        return { ...v, status: "Suspended" };
      }
      return v;
    }));
    const vndName = vendors.find(v => v.id === vndId)?.name;
    const newAct = {
      id: getNewActivityId(),
      text: `Suspended vendor '${vndName}' due to regulatory non-compliance.`,
      time: "Just Now"
    };
    setActivities(prev => [newAct, ...prev]);
    setSelectedVendor(null);
    showToast(`Vendor account "${vndName}" suspended indefinitely.`);
  };

  const handleRestoreVendor = (vndId) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vndId) {
        return { ...v, status: "Active" };
      }
      return v;
    }));
    const vndName = vendors.find(v => v.id === vndId)?.name;
    setSelectedVendor(null);
    showToast(`Restored active account status for "${vndName}".`);
  };

  // Customer Action Handlers
  const handleWarnCustomer = (cstId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === cstId) {
        return { ...c, status: "Warned", reports: c.reports + 1 };
      }
      return c;
    }));
    const cstName = customers.find(c => c.id === cstId)?.name;
    const newAct = {
      id: getNewActivityId(),
      text: `Issued behavior warning to customer '${cstName}'.`,
      time: "Just Now"
    };
    setActivities(prev => [newAct, ...prev]);
    setSelectedCustomer(null);
    showToast(`Official warning issued to customer "${cstName}".`);
  };

  const handleSuspendCustomer = (cstId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === cstId) {
        return { ...c, status: "Suspended" };
      }
      return c;
    }));
    const cstName = customers.find(c => c.id === cstId)?.name;
    const newAct = {
      id: getNewActivityId(),
      text: `Suspended customer account '${cstName}' due to terms violations.`,
      time: "Just Now"
    };
    setActivities(prev => [newAct, ...prev]);
    setSelectedCustomer(null);
    showToast(`Customer account "${cstName}" suspended indefinitely.`);
  };

  const handleRestoreCustomer = (cstId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === cstId) {
        return { ...c, status: "Active" };
      }
      return c;
    }));
    const cstName = customers.find(c => c.id === cstId)?.name;
    setSelectedCustomer(null);
    showToast(`Restored active customer profile for "${cstName}".`);
  };

  // Notifications Handlers
  const handleToggleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, isRead: !n.isRead };
      }
      return n;
    }));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast("All notifications marked as read.");
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast("Cleared system notifications queue.");
  };

  // Sandbox simulations
  const handleSimulateDispute = () => {
    const list = [
      { id: getNewComplaintId(), reportedUser: "mom_kitchen_anand", category: "Food Quality Complaint", date: "10 June 2026", priority: "High", status: "Open", message: "Reported hair found in packaging of veg lunch thali. Requesting compliance review.", target: "Mom's Kitchen", userType: "Vendor", reporter: "Amit Rawat" },
      { id: getNewComplaintId(), reportedUser: "Sunil Mehra (Customer)", category: "Fake Reviews", date: "10 June 2026", priority: "Low", status: "Open", message: "Vendor flagged customer for submitting 1-star rating spam due to personal conflict.", target: "Sunil Mehra", userType: "Customer", reporter: "Mom's Punjabi Rasoi" },
      { id: getNewComplaintId(), reportedUser: "Quick Chow Meals (Vendor)", category: "Refund Dispute", date: "10 June 2026", priority: "Medium", status: "Open", message: "Customer requested refund for delivery skip but chef claims skip notice was received 2 hours after cutoff.", target: "Quick Chow Meals", userType: "Vendor", reporter: "Sanjana Roy" }
    ];
    const picked = getRandomItem(list);
    setComplaints(prev => [picked, ...prev]);

    // Push alert
    const newAlert = {
      id: getNewNotificationId(),
      title: `⚠️ New Complaint Flagged: ${picked.id}`,
      message: `Inbound dispute logged: "${picked.category}" against ${picked.target}.`,
      timestamp: "Just Now",
      severity: picked.priority === "High" ? "High" : "Medium",
      isRead: false
    };
    setNotifications(prev => [newAlert, ...prev]);
    showToast(`Simulated Inbound Dispute: ${picked.id}`);
  };

  const handleSimulateApplication = () => {
    const list = [
      { id: getNewAppId(), name: "Taste of Tamil Nadu", location: "Amul Dairy Road", cuisine: "South Indian Tiffin", date: "10 June 2026", status: "Pending Review", owner: "R. Swaminathan", license: "FSSAI-19485720194", experience: "6 Years", phone: "+91 91029 38475", email: "swami.tamil@gmail.com" },
      { id: getNewAppId(), name: "Grandma's Curry Kitchen", location: "Vallabh Vidyanagar", cuisine: "Punjabi Gravies", date: "10 June 2026", status: "Pending Review", owner: "Gurmeet Kaur", license: "FSSAI-93029485721", experience: "10 Years", phone: "+91 93029 48572", email: "gurmeet.curry@gmail.com" }
    ];
    const picked = getRandomItem(list);
    setApplications(prev => [picked, ...prev]);
    
    const newAlert = {
      id: getNewNotificationId(),
      title: `📝 New Vendor Application: ${picked.name}`,
      message: `Chef ${picked.owner} submitted application for FSSAI verification.`,
      timestamp: "Just Now",
      severity: "Medium",
      isRead: false
    };
    setNotifications(prev => [newAlert, ...prev]);
    showToast(`Simulated Vendor Application: "${picked.name}"`);
  };

  const handleResetSandbox = () => {
    setComplaints(initialComplaints);
    setCustomers(initialCustomers);
    setNotifications(initialNotifications);
    setActivities(initialActivities);
    setSearchText("");
    setVerificationStatusFilter("All");
    setComplaintFilter("All");
    setVendorFilter("All");
    setCustomerFilter("All");
    fetchVendors();
    showToast("Restored platform moderation database defaults.");
  };

  // Derived filter evaluations
  const filteredApps = applications.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          a.owner.toLowerCase().includes(searchText.toLowerCase()) || 
                          a.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = verificationStatusFilter === "All" || a.status === verificationStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCmps = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchText.toLowerCase()) ||
                          c.reportedUser.toLowerCase().includes(searchText.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchText.toLowerCase());
    const matchesPriority = complaintFilter === "All" || c.priority === complaintFilter;
    return matchesSearch && matchesPriority;
  });

  const filteredVnds = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          v.owner.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = vendorFilter === "All" || v.status === vendorFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCsts = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = customerFilter === "All" || c.status === customerFilter;
    return matchesSearch && matchesStatus;
  });

  const showSkeleton = isLoading || sandboxForceSkel;
  const isAppsEmpty = sandboxForceEmpty || filteredApps.length === 0;
  const isCmpsEmpty = sandboxForceEmpty || filteredCmps.length === 0;
  const isVndsEmpty = sandboxForceEmpty || filteredVnds.length === 0;
  const isCstsEmpty = sandboxForceEmpty || filteredCsts.length === 0;
  const isNotifsEmpty = sandboxForceEmpty || notifications.length === 0;

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* 1. ADMIN SIDEBAR (Global Layout) */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Shield className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Tiffin<span className="text-mint">Track</span>
                <span className="text-[9px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded ml-1.5 border border-slate-700">ADMIN</span>
              </span>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: Shield },
              { id: "verification", label: "Vendor Verification", icon: FileCheck, badge: applications.length },
              { id: "reports", label: "Reports & Complaints", icon: AlertTriangle, badge: complaints.filter(c => c.status === "Open").length },
              { id: "vendor-monitoring", label: "Vendor Monitoring", icon: ChefHat },
              { id: "customer-monitoring", label: "Customer Monitoring", icon: Users },
              { id: "analytics", label: "Platform Analytics", icon: LineChart },
              { id: "notifications", label: "System Notifications", icon: Bell, badge: notifications.filter(n => !n.isRead).length },
              { id: "settings", label: "Portal Settings", icon: SettingsIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-mint text-white shadow-sm shadow-mint/10' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                      isActive ? "bg-white text-mint" : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('admin_user');
              navigate('/');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs md:text-sm font-semibold text-red-400 hover:bg-red-950/20 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Exit Console</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto relative pb-20">
        
        {/* Dynamic Toast Alert popup */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-slate-900 border border-slate-800 text-white px-4.5 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4">
            <CheckCircle size={16} className="text-mint" />
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        )}

        {/* 2. TOP NAVIGATION BAR */}
        <header className="h-16 border-b border-slate-200/60 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary-text cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-400">Moderation Portal</span>
              <span className="text-slate-300 font-light">/</span>
              <span className="text-sm font-black text-primary-text capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Quick Actions Header bar */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-1.5">
              <button 
                onClick={() => handleTabChange('verification')}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-bold rounded-lg cursor-pointer"
              >
                Approve Vendors
              </button>
              <button 
                onClick={() => handleTabChange('reports')}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-bold rounded-lg cursor-pointer text-red-600"
              >
                Review Complaints
              </button>
              <button 
                onClick={() => handleTabChange('analytics')}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-bold rounded-lg cursor-pointer"
              >
                View Analytics
              </button>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
              {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard Content Portal */}
        <div className="p-6 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Welcome Intro Section */}
          <div className="pb-2">
            <h1 className="text-2xl font-black text-primary-text tracking-tight flex items-center space-x-2">
              <span>Welcome {adminUser.name} 👋</span>
            </h1>
            <p className="text-xs md:text-sm text-secondary-text mt-1">
              Monitor platform activity, review reports, and maintain trust across the TiffinTrack marketplace.
            </p>
          </div>

          {/* 3. TAB 1: GENERAL OVERVIEW (DASHBOARD) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Stats overview rows */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
                {[
                  { title: "Pending Approvals", count: applications.length, desc: "Vendors awaiting audit", icon: FileCheck, color: "text-amber-500 bg-amber-50 border-amber-100" },
                  { title: "Open Complaints", count: complaints.filter(c => c.status === "Open").length, desc: "Awaiting resolution", icon: AlertTriangle, color: "text-red-500 bg-red-50 border-red-100" },
                  { title: "Reported Vendors", count: vendors.filter(v => v.status === "Warned").length, desc: "Warned accounts", icon: ChefHat, color: "text-amber-600 bg-amber-50 border-amber-100" },
                  { title: "Reported Customers", count: customers.filter(c => c.status === "Warned").length, desc: "Warned users", icon: Users, color: "text-slate-600 bg-slate-50 border-slate-100" },
                  { title: "Active Vendors", count: vendors.filter(v => v.status === "Active").length, desc: "Onboarded kitchens", icon: ChefHat, color: "text-mint bg-mint-light border-mint/20" },
                  { title: "Active Subscriptions", count: activeSubCount, desc: "Live MongoDB count", icon: Users, color: "text-blue-500 bg-blue-50 border-blue-100" },
                  { title: "Total Orders", count: orderStats.totalOrders, desc: "Cumulative orders", icon: Activity, color: "text-[#FFD200] bg-[#FFD200]/10 border-[#FFD200]/20" },
                  { title: "Pending Orders", count: orderStats.pendingOrders, desc: "Awaiting preparation", icon: RefreshCw, color: "text-orange-500 bg-orange-50 border-orange-100" },
                  { title: "Delivered Orders", count: orderStats.deliveredOrders, desc: "Successful runs", icon: CheckCircle, color: "text-emerald-500 bg-emerald-50 border-emerald-100" }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-slate-200/50 p-4 rounded-3xl shadow-card flex flex-col justify-between h-32 hover:shadow-card-hover transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">{stat.title}</span>
                      <div className={`p-1.5 rounded-lg ${stat.color} border`}>
                        <stat.icon size={14} />
                      </div>
                    </div>
                    <div>
                      <span className="text-xl font-black text-primary-text block">{stat.count}</span>
                      <span className="text-[9px] text-secondary-text font-medium mt-0.5 block">{stat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Split screen: Recent Activity & Admin Notifications alerts */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left side: Activities Feed */}
                <div className="md:col-span-8 bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center space-x-1.5">
                      <Activity size={15} className="text-mint" />
                      <span>Recent Security & Verification Log</span>
                    </h3>
                    <button 
                      onClick={() => handleTabChange('analytics')}
                      className="text-[10px] font-bold text-mint hover:underline flex items-center space-x-1"
                    >
                      <span>Full audit feed</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div key={act.id} className="flex justify-between items-start space-x-3 text-xs leading-relaxed">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0"></div>
                          <p className="text-slate-600 font-semibold">{act.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 whitespace-nowrap pt-0.5">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side: Urgent Notifications Stack */}
                <div className="md:col-span-4 bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center space-x-1.5">
                      <Bell size={15} className="text-red-500" />
                      <span>Urgent Alerts Queue</span>
                    </h3>
                  </div>

                  {isNotifsEmpty ? (
                    <div className="py-8 text-center text-secondary-text space-y-1">
                      <h4 className="text-xs font-bold text-primary-text">Clear! No Alerts</h4>
                      <p className="text-[9px] max-w-xs mx-auto">All system notifications have been cleared or resolved.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 3).map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3.5 border rounded-2xl space-y-1 ${
                            notif.severity === "High" 
                              ? "bg-red-50/50 border-red-100" 
                              : notif.severity === "Medium"
                                ? "bg-amber-50/50 border-amber-100"
                                : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          <h4 className="text-xs font-bold text-primary-text">{notif.title}</h4>
                          <p className="text-[10px] text-secondary-text leading-relaxed">{notif.message}</p>
                          <span className="text-[8px] text-slate-400 block pt-1">{notif.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider pb-2 border-b border-slate-100">
                  Moderator Action Panel Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: "Approve Kitchens", tab: "verification", desc: "Applications" },
                    { label: "Review Disputes", tab: "reports", desc: "Customer complaints" },
                    { label: "Warn Vendors", tab: "vendor-monitoring", desc: "Policy enforcement" },
                    { label: "View Analytics", tab: "analytics", desc: "Platform metrics" },
                    { label: "Platform Settings", tab: "settings", desc: "Support configs" }
                  ].map((act, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleTabChange(act.tab)}
                      className="p-3.5 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-2xl transition-all cursor-pointer flex flex-col justify-between h-20 group"
                    >
                      <span className="text-xs font-bold text-primary-text group-hover:text-mint transition-colors">{act.label}</span>
                      <span className="text-[9px] text-secondary-text mt-1">{act.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 4. TAB 2: VENDOR VERIFICATION */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Pending Vendor Applications</h2>
                  <p className="text-xs text-secondary-text">Verify hygiene codes, FSSAI registrations, and kitchen certifications.</p>
                </div>
              </div>

              {/* VERIFICATION DASHBOARD STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Vendor Requests</span>
                    <span className="text-2xl font-black text-primary-text block mt-1">{applications.filter(a => a.status === "Pending Review" || a.status === "Under Review").length} Requests</span>
                    <span className="text-[9px] text-amber-500 font-bold block mt-0.5">⚠️ Requires review</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-500">
                    <FileCheck size={20} />
                  </div>
                </div>
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Vendors</span>
                    <span className="text-2xl font-black text-primary-text block mt-1">{applications.filter(a => a.status === "Approved").length} Vendors</span>
                    <span className="text-[9px] text-mint font-bold block mt-0.5">📈 Active on platform</span>
                  </div>
                  <div className="p-3 bg-mint-light border border-mint/20 rounded-2xl text-mint">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rejected Applications</span>
                    <span className="text-2xl font-black text-primary-text block mt-1">{applications.filter(a => a.status === "Rejected").length} Vendors</span>
                    <span className="text-[9px] text-red-500 font-bold block mt-0.5">📉 Failed verification</span>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                </div>
              </div>

              {/* Status and Search filter bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-3 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-mint"
                  />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
                  <select 
                    value={verificationStatusFilter}
                    onChange={(e) => setVerificationStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/50 rounded-3xl shadow-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Business Name</th>
                      <th className="px-6 py-4">Vendor / Chef</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Cuisine</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Uploaded Docs</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSkeleton ? (
                      <>
                        <SkeletonVerificationRow />
                        <SkeletonVerificationRow />
                        <SkeletonVerificationRow />
                      </>
                    ) : isAppsEmpty ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-secondary-text space-y-3">
                          <CheckCircle className="text-slate-300 mx-auto" size={32} />
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-primary-text">No Applications Found</h4>
                            <p className="text-[10px]">No vendor applications match the current search and filter settings.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold">
                          <td className="px-6 py-4.5 text-primary-text">{app.name}</td>
                          <td className="px-6 py-4.5 text-slate-600">{app.owner}</td>
                          <td className="px-6 py-4.5 text-slate-600">{app.location}</td>
                          <td className="px-6 py-4.5 text-slate-600">{app.cuisine}</td>
                          <td className="px-6 py-4.5 text-slate-500">{app.experience}</td>
                          <td className="px-6 py-4.5 text-slate-500">
                            <span className="px-1.5 py-0.5 text-[9px] bg-slate-100 border border-slate-200 rounded text-slate-600 font-black">
                              3 Files
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-slate-500">{app.date}</td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider border ${
                              app.status === "Approved" 
                                ? "bg-mint-light text-mint border-mint/20" 
                                : app.status === "Rejected"
                                  ? "bg-red-50 text-red-600 border-red-100"
                                  : app.status === "Suspended"
                                    ? "bg-slate-800 text-slate-300 border-slate-700"
                                    : app.status === "Under Review"
                                      ? "bg-blue-50 text-blue-600 border-blue-100"
                                      : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 flex space-x-1.5">
                            <button 
                              onClick={() => setSelectedApp(app)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer border border-slate-200"
                            >
                              Review Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 5. TAB 3: REPORTS & COMPLAINTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Disputes & Customer Complaints Queue</h2>
                  <p className="text-xs text-secondary-text">Audit quality reports, refunds claims, and courier delay logs.</p>
                </div>
                
                {/* Filter */}
                <select 
                  value={complaintFilter}
                  onChange={(e) => setComplaintFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Complaints Grid */}
              {isCmpsEmpty ? (
                <div className="py-12 bg-white border border-slate-200/50 rounded-3xl shadow-card text-center space-y-4">
                  <CheckCircle className="text-slate-300 mx-auto" size={36} />
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-primary-text">No Complaints Pending</h3>
                    <p className="text-[10px] text-secondary-text">All customers and vendors are operating in harmony!</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCmps.map((cmp) => (
                    <div 
                      key={cmp.id}
                      className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4 hover:shadow-card-hover transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">ID: {cmp.id}</span>
                            <h4 className="text-xs font-bold text-primary-text leading-tight">{cmp.category}</h4>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-md tracking-wider uppercase ${
                            cmp.priority === "High" 
                              ? "bg-red-50 text-red-600 border border-red-100" 
                              : cmp.priority === "Medium"
                                ? "bg-amber-50 text-amber-600 border border-amber-100"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}>
                            {cmp.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-secondary-text leading-relaxed">
                          {cmp.message}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400">Reported Party</span>
                          <span className="text-primary-text">{cmp.reportedUser}</span>
                        </div>
                        <div className="flex space-x-1.5">
                          <button 
                            onClick={() => setSelectedComplaint(cmp)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                          >
                            Details
                          </button>
                          {cmp.status !== "Resolved" && (
                            <button 
                              onClick={() => handleComplaintStatusChange(cmp.id, "Resolved")}
                              className="px-2.5 py-1.5 bg-mint text-white hover:bg-mint-hover font-bold rounded-lg cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 6. TAB 4: VENDOR MONITORING */}
          {activeTab === "vendor-monitoring" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Vendor & Home Chef Audits</h2>
                  <p className="text-xs text-secondary-text">Track cumulative merchant ratings, sales volume, and policy warnings.</p>
                </div>
                
                <select 
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Warned">Warned</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/50 rounded-3xl shadow-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Kitchen Name</th>
                      <th className="px-6 py-4">Chef Rating</th>
                      <th className="px-6 py-4">Total Orders</th>
                      <th className="px-6 py-4">Complaints Received</th>
                      <th className="px-6 py-4">Account Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isVndsEmpty ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-secondary-text">
                          No chefs found matching status filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredVnds.map((vnd) => (
                        <tr key={vnd.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold">
                          <td className="px-6 py-4.5 text-primary-text">
                            <span className="block font-bold">{vnd.name}</span>
                            <span className="text-[9px] text-slate-400 block">{vnd.owner} • {vnd.id}</span>
                          </td>
                          <td className="px-6 py-4.5 text-slate-600">{vnd.rating} ★</td>
                          <td className="px-6 py-4.5 text-slate-600">{vnd.totalOrders}</td>
                          <td className="px-6 py-4.5 text-red-500">{vnd.complaints} Reports</td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider border ${
                              vnd.status === "Active" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : vnd.status === "Warned"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {vnd.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 flex space-x-1.5">
                            <button 
                              onClick={() => setSelectedVendor(vnd)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 7. TAB 5: CUSTOMER MONITORING */}
          {activeTab === "customer-monitoring" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Customer Profiles Directory</h2>
                  <p className="text-xs text-secondary-text">Track consumer behavior flags, active plans, and misconduct reports.</p>
                </div>

                <select 
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Warned">Warned</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200/50 rounded-3xl shadow-card overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Active Subscription</th>
                      <th className="px-6 py-4">Reports Received</th>
                      <th className="px-6 py-4">Account Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isCstsEmpty ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-secondary-text">
                          No customer profiles match this criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCsts.map((cst) => (
                        <tr key={cst.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold">
                          <td className="px-6 py-4.5 text-primary-text">
                            <span className="block font-bold">{cst.name}</span>
                            <span className="text-[9px] text-slate-400 block">{cst.email} • {cst.id}</span>
                          </td>
                          <td className="px-6 py-4.5 text-slate-600">{cst.activeSub}</td>
                          <td className="px-6 py-4.5 text-red-500">{cst.reports} Flags</td>
                          <td className="px-6 py-4.5">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider border ${
                              cst.status === "Active" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : cst.status === "Warned"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              {cst.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 flex space-x-1.5">
                            <button 
                              onClick={() => setSelectedCustomer(cst)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 8. TAB 6: PLATFORM ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              
              <div className="pb-2 border-b border-slate-100">
                <h2 className="text-lg font-bold text-primary-text">Overall Platform Health & Revenue Metrics</h2>
                <p className="text-xs text-secondary-text">Aggregated data representing TiffinTrack daily operations and marketplace growth.</p>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Metric 1 */}
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Satisfaction</span>
                    <TrendingUp size={16} className="text-mint" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-primary-text block">4.85 ★</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">↑ +0.4% from last month</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-mint h-full rounded-full" style={{ width: "95%" }}></div>
                    </div>
                    <span className="text-[9px] text-slate-400">Target score: 4.75 minimum</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders This Month</span>
                    <Activity size={16} className="text-mint" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-primary-text block">12,842</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">↑ +14.2% Growth</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-mint h-full rounded-full" style={{ width: "72%" }}></div>
                    </div>
                    <span className="text-[9px] text-slate-400">Monthly target: 15,000 tiffins</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispute Resolution Rate</span>
                    <CheckCircle size={16} className="text-mint" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-primary-text block">98.4%</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">↑ +2.1% resolution speed</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-mint h-full rounded-full" style={{ width: "98%" }}></div>
                    </div>
                    <span className="text-[9px] text-slate-400">Complaints resolved within 24h</span>
                  </div>
                </div>

              </div>

              {/* Graphic Placeholder chart */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Monthly Active Subscriptions Trend</h3>
                
                {/* SVG Mock chart */}
                <div className="h-64 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between p-4 relative overflow-hidden">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Active Subscriptions (k)</span>
                    <span className="text-mint">Live Tracker</span>
                  </div>
                  
                  {/* Mock graph line */}
                  <svg className="w-full h-40 absolute bottom-12 left-0 right-0 overflow-visible" preserveAspectRatio="none">
                    <path 
                      d="M 0 140 Q 150 110, 300 130 T 600 60 T 900 30" 
                      fill="none" 
                      stroke="#00B074" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M 0 140 Q 150 110, 300 130 T 600 60 T 900 30 L 900 180 L 0 180 Z" 
                      fill="url(#mint-grad)" 
                      opacity="0.1"
                    />
                    <defs>
                      <linearGradient id="mint-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00B074"/>
                        <stop offset="100%" stopColor="#00B074" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Horizontal months axis */}
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 border-t border-slate-200/60 pt-2 z-10">
                    <span>Jan 2026</span>
                    <span>Feb 2026</span>
                    <span>Mar 2026</span>
                    <span>Apr 2026</span>
                    <span>May 2026</span>
                    <span>Jun 2026 (Current)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 9. TAB 7: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-primary-text">Platform Alerts Queue</h2>
                  <p className="text-xs text-secondary-text">Manage real-time flags, complaint bursts, and system alerts.</p>
                </div>
                
                {notifications.length > 0 && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleMarkAllNotificationsRead}
                      className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Mark all read
                    </button>
                    <button 
                      onClick={handleClearAllNotifications}
                      className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl cursor-pointer border border-red-100"
                    >
                      Clear Queue
                    </button>
                  </div>
                )}
              </div>

              {isNotifsEmpty ? (
                <div className="py-12 bg-white border border-slate-200/50 rounded-3xl shadow-card text-center space-y-4">
                  <Bell className="text-slate-300 mx-auto" size={36} />
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-primary-text">No Alerts Registered</h3>
                    <p className="text-[10px] text-secondary-text">Platform components are operating inside normal parameters.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-4 border rounded-2xl transition-all shadow-card flex justify-between items-start hover:border-slate-300 bg-white border-slate-200 ${
                        !n.isRead ? "border-l-4 border-l-mint" : ""
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-primary-text">{n.title}</h4>
                          <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${
                            n.severity === "High" 
                              ? "bg-red-50 text-red-600" 
                              : n.severity === "Medium"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-600"
                          }`}>
                            {n.severity} Priority
                          </span>
                        </div>
                        <p className="text-[11px] text-secondary-text leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-slate-400 block pt-0.5">{n.timestamp}</span>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 pt-0.5">
                        <button 
                          onClick={() => handleToggleNotificationRead(n.id)}
                          className="px-2 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          {n.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button 
                          onClick={() => handleDeleteNotification(n.id)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* 10. TAB 8: PORTAL SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              
              <div className="pb-2 border-b border-slate-100">
                <h2 className="text-lg font-bold text-primary-text">Platform Moderation Settings</h2>
                <p className="text-xs text-secondary-text">Configure automatic safeguards, dispute cutoff thresholds, and compliance flags.</p>
              </div>

              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-6">
                
                {/* Setting 1 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-slate-100 gap-4">
                  <div className="space-y-0.5 max-w-md">
                    <label className="block text-xs font-bold text-primary-text">Auto-Warning Threshold</label>
                    <p className="text-[10px] text-secondary-text">Automatically send warnings to vendors when cumulative complaints exceed this number.</p>
                  </div>
                  <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    <option>3 Complaints</option>
                    <option>5 Complaints (Default)</option>
                    <option>10 Complaints</option>
                  </select>
                </div>

                {/* Setting 2 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-slate-100 gap-4">
                  <div className="space-y-0.5 max-w-md">
                    <label className="block text-xs font-bold text-primary-text">Auto-Suspension Safeguard</label>
                    <p className="text-[10px] text-secondary-text">Freeze vendor listings instantly if a vendor receives multiple high-priority misconduct disputes.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-mint">
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                  </button>
                </div>

                {/* Setting 3 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 last:border-b-0 gap-4">
                  <div className="space-y-0.5 max-w-md">
                    <label className="block text-xs font-bold text-primary-text">Support Audit Email</label>
                    <p className="text-[10px] text-secondary-text">All resolved complaints and warning receipts are archived at this administrator account.</p>
                  </div>
                  <input 
                    type="email" 
                    key={adminUser.email}
                    defaultValue={adminUser.email || ""}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:outline-none"
                  />
                </div>

              </div>

            </div>
          )}

        </div>

        {/* DEVELOPER SANDBOX PANEL */}
        <div className="m-6 p-5 bg-white border border-slate-200/50 rounded-3xl shadow-card space-y-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Shield size={16} className="text-lemon" />
            <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Trust & Safety Developer Sandbox</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs font-semibold text-slate-700">
            
            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <input 
                id="force-skel-admin" 
                type="checkbox"
                checked={sandboxForceSkel}
                onChange={(e) => setSandboxForceSkel(e.target.checked)}
                className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
              />
              <label htmlFor="force-skel-admin" className="cursor-pointer text-[11px]">Force Loading Skeletons</label>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <input 
                id="force-empty-admin" 
                type="checkbox"
                checked={sandboxForceEmpty}
                onChange={(e) => setSandboxForceEmpty(e.target.checked)}
                className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
              />
              <label htmlFor="force-empty-admin" className="cursor-pointer text-[11px]">Force Empty Lists</label>
            </div>

            <button 
              onClick={handleSimulateDispute}
              className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1 border border-red-100"
            >
              <Plus size={12} />
              <span>Simulate Dispute</span>
            </button>

            <button 
              onClick={handleSimulateApplication}
              className="py-2.5 bg-mint/10 hover:bg-mint/20 text-mint text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1 border border-mint/10"
            >
              <Plus size={12} />
              <span>Simulate Application</span>
            </button>

            <button 
              onClick={handleResetSandbox}
              className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1"
            >
              <RefreshCw size={12} />
              <span>Reset Sandbox</span>
            </button>

          </div>
        </div>

      </main>

      {/* DETAIL MODAL 1: PENDING APPLICATION PROFILE DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-150 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4 flex flex-col md:flex-row gap-6">
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer z-10 bg-slate-100 hover:bg-slate-200 rounded-full p-1"
            >
              <X size={16} />
            </button>
            
            {/* Left Side: Chef Info & Documents */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <span className={`px-2 py-0.5 text-[9px] font-black rounded border uppercase tracking-wider inline-block ${
                  selectedApp.status === "Approved" 
                    ? "bg-mint-light text-mint border-mint/20" 
                    : selectedApp.status === "Rejected"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : selectedApp.status === "Suspended"
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : selectedApp.status === "Under Review"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                }`}>
                  {selectedApp.status}
                </span>
                <h3 className="text-base font-bold text-primary-text mt-1">{selectedApp.name}</h3>
                <p className="text-[10px] text-slate-400">Chef: {selectedApp.owner} • App ID: {selectedApp.id}</p>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600">
                <h4 className="text-[10px] font-black text-primary-text uppercase tracking-wider border-b border-slate-200/60 pb-1.5 mb-2">Vendor Information</h4>
                <div className="flex justify-between">
                  <span>Experience Details:</span>
                  <span className="text-primary-text">{selectedApp.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact Phone:</span>
                  <span className="text-primary-text">{selectedApp.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact Email:</span>
                  <span className="text-primary-text">{selectedApp.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cuisine Niche:</span>
                  <span className="text-primary-text">{selectedApp.cuisine}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location Area:</span>
                  <span className="text-primary-text">{selectedApp.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registration Date:</span>
                  <span className="text-primary-text">{selectedApp.date}</span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-primary-text uppercase tracking-wider pb-1">Required Documents Overview</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <span className="font-semibold text-slate-600">🪪 Government ID (Aadhaar/PAN)</span>
                    <span className="text-[9px] font-black text-mint px-1.5 py-0.5 bg-mint-light border border-mint/20 rounded">PDF Attached ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <span className="font-semibold text-slate-600">📜 Food License (FSSAI Certificate)</span>
                    <span className="text-[9px] font-black text-mint px-1.5 py-0.5 bg-mint-light border border-mint/20 rounded font-mono">{selectedApp.license} ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    <span className="font-semibold text-slate-600">🏠 Address Proof (Light Bill/Rent)</span>
                    <span className="text-[9px] font-black text-mint px-1.5 py-0.5 bg-mint-light border border-mint/20 rounded">PDF Attached ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Kitchen Photos & Moderation Actions */}
            <div className="flex-1 flex flex-col justify-between pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 space-y-4">
              {/* Kitchen Photos showcase */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-primary-text uppercase tracking-wider pb-1">Kitchen Showcase Photos</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300" className="object-cover w-full h-full" alt="Kitchen 1" />
                  </div>
                  <div className="h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=300" className="object-cover w-full h-full" alt="Kitchen 2" />
                  </div>
                </div>
              </div>

              {/* Status Change buttons */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-primary-text uppercase tracking-wider pb-1">Verification Console</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleUpdateVerificationStatus(selectedApp.id, "Under Review")}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer border border-slate-200"
                  >
                    Set Under Review
                  </button>
                  <button 
                    onClick={() => handleUpdateVerificationStatus(selectedApp.id, "Pending Documents")}
                    className="py-2 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Request Documents
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleRejectVendor(selectedApp.id)}
                    className="py-2 bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleSuspendVendorFromVerification(selectedApp.id)}
                    className="py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Suspend
                  </button>
                  <button 
                    onClick={() => handleApproveVendor(selectedApp.id)}
                    className="py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DETAIL MODAL 2: COMPLAINT DETAILS */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{selectedComplaint.id}</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-red-50 text-red-600">{selectedComplaint.priority} Priority</span>
              </div>
              <h3 className="text-base font-bold text-primary-text">{selectedComplaint.category}</h3>
            </div>

            <p className="text-xs text-secondary-text leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-150">
              "{selectedComplaint.message}"
            </p>

            <div className="space-y-2 text-xs font-semibold text-slate-600 px-1">
              <div className="flex justify-between">
                <span>Accused Party:</span>
                <span className="text-primary-text">{selectedComplaint.reportedUser}</span>
              </div>
              <div className="flex justify-between">
                <span>Filed By:</span>
                <span className="text-primary-text">{selectedComplaint.reporter}</span>
              </div>
              <div className="flex justify-between">
                <span>Filing Date:</span>
                <span className="text-primary-text">{selectedComplaint.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution Status:</span>
                <span className="text-amber-500 font-bold">{selectedComplaint.status}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => handleComplaintStatusChange(selectedComplaint.id, "Escalated")}
                className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-600 text-xs font-bold rounded-xl cursor-pointer"
              >
                Escalate
              </button>
              <button 
                onClick={() => handleComplaintStatusChange(selectedComplaint.id, "Resolved")}
                className="flex-1 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL 3: VENDOR MONITORING MANAGEMENT */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <button 
              onClick={() => setSelectedVendor(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{selectedVendor.id}</span>
              <h3 className="text-base font-bold text-primary-text">{selectedVendor.name}</h3>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Chef Owner:</span>
                <span className="text-primary-text">{selectedVendor.owner}</span>
              </div>
              <div className="flex justify-between">
                <span>Kitchen Location:</span>
                <span className="text-primary-text">{selectedVendor.city}</span>
              </div>
              <div className="flex justify-between">
                <span>Accumulated Rating:</span>
                <span className="text-primary-text">{selectedVendor.rating} ★</span>
              </div>
              <div className="flex justify-between">
                <span>Total Subscriptions:</span>
                <span className="text-primary-text">{selectedVendor.totalOrders} deliveries</span>
              </div>
              <div className="flex justify-between">
                <span>Report History:</span>
                <span className="text-red-500 font-bold">{selectedVendor.complaints} files logged</span>
              </div>
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-primary-text uppercase font-black">{selectedVendor.status}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              {selectedVendor.status === "Suspended" ? (
                <button 
                  onClick={() => handleRestoreVendor(selectedVendor.id)}
                  className="flex-grow py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Unsuspend Vendor Account
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleWarnVendor(selectedVendor.id)}
                    className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-600 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Issue Warning
                  </button>
                  <button 
                    onClick={() => handleSuspendVendor(selectedVendor.id)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Suspend Kitchen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL 4: CUSTOMER MONITORING MANAGEMENT */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 space-y-4">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{selectedCustomer.id}</span>
              <h3 className="text-base font-bold text-primary-text">{selectedCustomer.name}</h3>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Account Email:</span>
                <span className="text-primary-text">{selectedCustomer.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Subscription Plan:</span>
                <span className="text-primary-text">{selectedCustomer.activeSub}</span>
              </div>
              <div className="flex justify-between">
                <span>Misconduct Reports:</span>
                <span className="text-red-500 font-bold">{selectedCustomer.reports} flags</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="text-primary-text uppercase font-black">{selectedCustomer.status}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              {selectedCustomer.status === "Suspended" ? (
                <button 
                  onClick={() => handleRestoreCustomer(selectedCustomer.id)}
                  className="flex-grow py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Unsuspend Customer Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => handleWarnCustomer(selectedCustomer.id)}
                    className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-600 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Issue Warning
                  </button>
                  <button 
                    onClick={() => handleSuspendCustomer(selectedCustomer.id)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Suspend Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Backup Trash2 icon import
const Trash2 = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

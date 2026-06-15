import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import CustomerAuth from './pages/CustomerAuth';
import VendorAuth from './pages/VendorAuth';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Vendor Side Components
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMeals from './pages/vendor/VendorMeals';
import VendorPlans from './pages/vendor/VendorPlans';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorCustomers from './pages/vendor/VendorCustomers';
import VendorRevenue from './pages/vendor/VendorRevenue';
import ProfilePage from './pages/vendor/ProfilePage';
import VendorNotifications from './pages/vendor/VendorNotifications';
import VendorProtectedRoute from './components/vendor/VendorProtectedRoute';
import VendorDeliveryTeam from './pages/vendor/VendorDeliveryTeam';
import VendorDeliveryAssignments from './pages/vendor/VendorDeliveryAssignments';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Side Components
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDetails from './pages/VendorDetails';
import CustomerVendorMeals from './pages/VendorMeals';
import CustomerVendorPlans from './pages/VendorPlans';
import Checkout from './pages/Checkout';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import MySubscriptions from './pages/MySubscriptions';
import TrackOrders from './pages/TrackOrders';
import OrderHistory from './pages/OrderHistory';
import ProfileSettings from './pages/ProfileSettings';
import Notifications from './pages/Notifications';
import MyReviews from './pages/MyReviews';
import VendorReviews from './pages/vendor/VendorReviews';
import CustomerAddresses from './pages/CustomerAddresses';
import { NotificationProvider } from './auth/NotificationContext';

// Delivery Side Components
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <NotificationProvider>
      <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/customer-auth" element={<CustomerAuth />} />
        <Route path="/vendor-auth" element={<Navigate to="/vendor/login" replace />} />
        <Route path="/vendor/login" element={<VendorAuth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Admin Dashboard routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="dashboard" /></ProtectedRoute>} />
        <Route path="/admin/vendor-verification" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="verification" /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="reports" /></ProtectedRoute>} />
        <Route path="/admin/vendor-monitoring" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="vendor-monitoring" /></ProtectedRoute>} />
        <Route path="/admin/customer-monitoring" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="customer-monitoring" /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="analytics" /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="settings" /></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute allowedRole="admin"><AdminDashboard defaultTab="notifications" /></ProtectedRoute>} />
        
        {/* Vendor Dashboard routes */}
        <Route path="/vendor-dashboard" element={<VendorProtectedRoute><VendorDashboard /></VendorProtectedRoute>} />
        <Route path="/vendor/meals" element={<VendorProtectedRoute><VendorMeals /></VendorProtectedRoute>} />
        <Route path="/vendor/plans" element={<VendorProtectedRoute><VendorPlans /></VendorProtectedRoute>} />
        <Route path="/vendor/orders" element={<VendorProtectedRoute><VendorOrders /></VendorProtectedRoute>} />
        <Route path="/vendor/customers" element={<VendorProtectedRoute><VendorCustomers /></VendorProtectedRoute>} />
        <Route path="/vendor/revenue" element={<VendorProtectedRoute><VendorRevenue /></VendorProtectedRoute>} />
        <Route path="/vendor/profile" element={<VendorProtectedRoute><ProfilePage /></VendorProtectedRoute>} />
        <Route path="/vendor/notifications" element={<VendorProtectedRoute><VendorNotifications /></VendorProtectedRoute>} />
        <Route path="/vendor/reviews" element={<VendorProtectedRoute><VendorReviews /></VendorProtectedRoute>} />
        <Route path="/vendor/delivery-team" element={<VendorProtectedRoute><VendorDeliveryTeam /></VendorProtectedRoute>} />
        <Route path="/vendor/delivery-assignments" element={<VendorProtectedRoute><VendorDeliveryAssignments /></VendorProtectedRoute>} />

        {/* Customer Dashboard routes */}
        <Route path="/customer-dashboard" element={<ProtectedRoute allowedRole="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/my-subscriptions" element={<ProtectedRoute allowedRole="customer"><MySubscriptions /></ProtectedRoute>} />
        <Route path="/track-orders" element={<ProtectedRoute allowedRole="customer"><TrackOrders /></ProtectedRoute>} />
        <Route path="/order-history" element={<ProtectedRoute allowedRole="customer"><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile-settings" element={<ProtectedRoute allowedRole="customer"><ProfileSettings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRole="customer"><Notifications /></ProtectedRoute>} />
        <Route path="/my-reviews" element={<ProtectedRoute allowedRole="customer"><MyReviews /></ProtectedRoute>} />
        <Route path="/customer/addresses" element={<ProtectedRoute allowedRole="customer"><CustomerAddresses /></ProtectedRoute>} />
        <Route path="/browse-vendors" element={<ProtectedRoute allowedRole="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/vendor/:id" element={<ProtectedRoute allowedRole="customer"><VendorDetails preSelectedTab="details" /></ProtectedRoute>} />
        <Route path="/vendor/:id/meals" element={<ProtectedRoute allowedRole="customer"><CustomerVendorMeals /></ProtectedRoute>} />
        <Route path="/vendor/:id/plans" element={<ProtectedRoute allowedRole="customer"><CustomerVendorPlans /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRole="customer"><Checkout /></ProtectedRoute>} />
        <Route path="/subscription-success" element={<ProtectedRoute allowedRole="customer"><SubscriptionSuccess /></ProtectedRoute>} />

        {/* Delivery Dashboard routes */}
        <Route path="/delivery-login" element={<DeliveryLogin />} />
        <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard defaultTab="dashboard" /></ProtectedRoute>} />
        <Route path="/delivery/history" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard defaultTab="history" /></ProtectedRoute>} />
        <Route path="/delivery/notifications" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard defaultTab="notifications" /></ProtectedRoute>} />
        <Route path="/delivery/profile" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard defaultTab="profile" /></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;

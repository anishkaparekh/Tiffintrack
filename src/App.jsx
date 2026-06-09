import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import CustomerAuth from './pages/CustomerAuth';
import VendorAuth from './pages/VendorAuth';
import AdminLogin from './pages/AdminLogin';

// Vendor Side Components
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMeals from './pages/vendor/VendorMeals';
import VendorPlans from './pages/vendor/VendorPlans';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorCustomers from './pages/vendor/VendorCustomers';
import VendorRevenue from './pages/vendor/VendorRevenue';
import ProfilePage from './pages/vendor/ProfilePage';
import VendorNotifications from './pages/vendor/VendorNotifications';

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/customer-auth" element={<CustomerAuth />} />
        <Route path="/vendor-auth" element={<VendorAuth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Vendor Dashboard routes */}
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/meals" element={<VendorMeals />} />
        <Route path="/vendor/plans" element={<VendorPlans />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/customers" element={<VendorCustomers />} />
        <Route path="/vendor/revenue" element={<VendorRevenue />} />
        <Route path="/vendor/profile" element={<ProfilePage />} />
        <Route path="/vendor/notifications" element={<VendorNotifications />} />

        {/* Customer Dashboard routes */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
        <Route path="/track-orders" element={<TrackOrders />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/browse-vendors" element={<CustomerDashboard />} />
        <Route path="/vendor/:id" element={<VendorDetails preSelectedTab="details" />} />
        <Route path="/vendor/:id/meals" element={<CustomerVendorMeals />} />
        <Route path="/vendor/:id/plans" element={<CustomerVendorPlans />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

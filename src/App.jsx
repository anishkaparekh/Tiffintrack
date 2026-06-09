import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import CustomerAuth from './pages/CustomerAuth';
import VendorAuth from './pages/VendorAuth';
import AdminLogin from './pages/AdminLogin';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMeals from './pages/vendor/VendorMeals';
import VendorPlans from './pages/vendor/VendorPlans';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorCustomers from './pages/vendor/VendorCustomers';
import VendorRevenue from './pages/vendor/VendorRevenue';
import ProfilePage from './pages/vendor/ProfilePage';
import VendorNotifications from './pages/vendor/VendorNotifications';

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

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

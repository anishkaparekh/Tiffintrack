import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import CustomerAuth from './pages/CustomerAuth';
import VendorAuth from './pages/VendorAuth';
import AdminLogin from './pages/AdminLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorDetails from './pages/VendorDetails';
import VendorMeals from './pages/VendorMeals';
import VendorPlans from './pages/VendorPlans';
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
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
        <Route path="/track-orders" element={<TrackOrders />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/browse-vendors" element={<CustomerDashboard />} />
        <Route path="/vendor/:id" element={<VendorDetails preSelectedTab="details" />} />
        <Route path="/vendor/:id/meals" element={<VendorMeals />} />
        <Route path="/vendor/:id/plans" element={<VendorPlans />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

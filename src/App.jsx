import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import CustomerAuth from './pages/CustomerAuth';
import VendorAuth from './pages/VendorAuth';
import AdminLogin from './pages/AdminLogin';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/customer-auth" element={<CustomerAuth />} />
        <Route path="/vendor-auth" element={<VendorAuth />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

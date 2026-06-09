import React from 'react';
import { Navigate } from 'react-router-dom';
import { isVendorAuthenticated } from '../../auth/mockAuth';

interface VendorProtectedRouteProps {
  children: React.ReactNode;
}

export default function VendorProtectedRoute({ children }: VendorProtectedRouteProps) {
  const authenticated = isVendorAuthenticated();
  console.log(`[VendorProtectedRoute] Checking access. Authenticated: ${authenticated}`);
  
  if (!authenticated) {
    console.warn('[VendorProtectedRoute] Access denied: User not authenticated. Redirecting to /vendor/login');
    return <Navigate to="/vendor/login" replace />;
  }
  
  return <>{children}</>;
}

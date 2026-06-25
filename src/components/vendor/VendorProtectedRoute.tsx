import React from 'react';
import { Navigate } from 'react-router-dom';
import { isVendorAuthenticated } from '../../auth/session';

interface VendorProtectedRouteProps {
  children: React.ReactNode;
}

const getPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function VendorProtectedRoute({ children }: VendorProtectedRouteProps) {
  const authenticated = isVendorAuthenticated();
  const token = localStorage.getItem('token');
  
  console.log(`[VendorProtectedRoute] Checking access. Authenticated: ${authenticated}`);
  
  if (!authenticated || !token) {
    console.warn('[VendorProtectedRoute] Access denied: User not authenticated. Redirecting to /vendor/login');
    return <Navigate to="/vendor/login" replace />;
  }

  const payload = getPayload(token);
  if (!payload || payload.role !== 'vendor') {
    console.warn(
      `[VendorProtectedRoute] Access denied: Role mismatch. Required: 'vendor', Present: '${payload?.role}'. Redirecting to /vendor/login`
    );
    return <Navigate to="/vendor/login" replace />;
  }
  
  return <>{children}</>;
}

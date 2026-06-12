import React from 'react';
import { Navigate } from 'react-router-dom';

const getPayload = (token) => {
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

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn(`[ProtectedRoute] Access denied: No token found. Redirecting...`);
    const redirectPath =
      allowedRole === 'admin'
        ? '/admin-login'
        : allowedRole === 'vendor'
        ? '/vendor/login'
        : '/customer-auth';
    return <Navigate to={redirectPath} replace />;
  }

  const payload = getPayload(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    console.warn(`[ProtectedRoute] Access denied: Expired or invalid token. Redirecting...`);
    localStorage.removeItem('token');
    const redirectPath =
      allowedRole === 'admin'
        ? '/admin-login'
        : allowedRole === 'vendor'
        ? '/vendor/login'
        : '/customer-auth';
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRole && payload.role !== allowedRole) {
    console.warn(
      `[ProtectedRoute] Access denied: Role mismatch. Required: '${allowedRole}', Present: '${payload.role}'. Redirecting...`
    );
    const redirectPath =
      allowedRole === 'admin'
        ? '/admin-login'
        : allowedRole === 'vendor'
        ? '/vendor/login'
        : '/customer-auth';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRole }) {
  const { user, loading, initialized } = useAuth() || {};

  // wait until auth state is restored or login is in progress
  if (!initialized || loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // requiredRole can be a string or array of strings
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children;
}

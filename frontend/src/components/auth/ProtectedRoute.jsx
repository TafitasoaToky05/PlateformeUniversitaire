import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Eo am-pikarohana ny mombamomba anao...</div>; // Na asiana Spinner MUI
  }

  // Raha tsy mbola misy mpampiasa tafiditra (Not logged in)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Raha tsy mifanaraka amin'ny role nahazo alàlana ny role-ny
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Averina any amin'ny dashboard mifanaraka aminy izy
    return <Navigate to={user.role === 'admin' ? '/dashboard-admin' : '/dashboard-enseignant'} replace />;
  }

  return children;
}
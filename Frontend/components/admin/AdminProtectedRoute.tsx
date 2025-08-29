import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  // For a real app, you might have a loading state here while checking auth status
  
  if (!user || !user.isAdmin) {
    // Redirect them to the home page if not logged in or not an admin
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;

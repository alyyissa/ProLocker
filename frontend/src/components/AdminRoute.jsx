// AdminRoute.jsx - REPLACE ENTIRE FILE
import { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isLoggedIn, isAdmin, isCheckingAdmin } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If we're logged in but admin status is being checked, wait
    if (isLoggedIn && isCheckingAdmin) {
      setIsChecking(true);
    } else {
      // Give a small delay for state to propagate
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isAdmin, isCheckingAdmin]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized if not admin
  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and admin - render the route
  return <Outlet />;
};

export default AdminRoute;
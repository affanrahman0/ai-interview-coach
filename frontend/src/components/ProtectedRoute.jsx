// PHASE 1: Wrap protected pages - redirects to /login if no token found.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If the user is not logged in, redirect them to the login page immediately
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the protected page
  return children;
};

export default ProtectedRoute;


import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Router from 'next/router';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      Router.push('/login');
    }
  }, [user, loading]);

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return null;
  }

  // If we have a user, show the protected content
  return children;
};

export default ProtectedRoute;

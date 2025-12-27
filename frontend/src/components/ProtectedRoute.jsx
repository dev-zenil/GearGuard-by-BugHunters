import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

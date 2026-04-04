import React from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredUser, isAdminUser } from '../utils/auth';

export default function AdminRoute({ children }) {
  const user = getStoredUser();

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

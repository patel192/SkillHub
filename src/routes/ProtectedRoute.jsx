import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = ({ allowdRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowdRole && role !== allowdRole) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

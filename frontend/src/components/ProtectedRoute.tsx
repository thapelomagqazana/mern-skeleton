import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute ensures that only authenticated users can access certain routes.
 * If the user is not authenticated, they will be redirected to the sign-in page.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuth } = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;

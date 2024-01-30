import React from "react";
import { Outlet, Navigate } from "react-router-dom";
// Outlet is what we want to return if we logged in
// If we don't log in, we need Navigate to redirect us

import { useSelector } from "react-redux";
// we can get state to check if we have access token

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

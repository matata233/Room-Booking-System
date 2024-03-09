import React, { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";
import { useLoginMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { search } = useLocation(); // 'useLocation' hook returns the location object from the current URL
  // 'search' returns a string containing all the query parameters.
  const searchParams = new URLSearchParams(search); // extract the query parameter and its value
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (res) => {
    try {
      const response = await login({ token: res.credential }).unwrap();
      const decodedUserInfo = jwtDecode(response.token);
      const avatarLink = jwtDecode(res.credential).picture; // get the user's avatar link from the token
      dispatch(setCredentials({ ...decodedUserInfo, avatar: avatarLink }));
      console.log({ ...decodedUserInfo, avatar: avatarLink });
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      googleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="flex  items-center justify-center font-amazon-ember">
      <div className="group relative  shadow-xl ">
        <div className="absolute inset-0  rounded-md  bg-theme-orange opacity-40 duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => {
            console.log("Login Failed");
            // TODO: Handle the login failure
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;

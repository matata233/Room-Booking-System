import React, { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";


const LoginPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation(); // 'useLocation' hook returns the location object from the current URL
  // 'search' returns a string containing all the query parameters.
  const searchParams = new URLSearchParams(search); // extract the query parameter and its value
  const redirect = searchParams.get("redirect") || "/";
  const backendUrl = 'http://localhost:3001/aws-room-booking/api/v1/users/login'
  const sendTokenToBackend = async (credential) => {
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });

      const backendData = await response.json();
      console.log(backendData);
      return backendData; // This should include the backend session token
    } catch (error) {
      console.error('Error sending token to backend', error);
      throw error;
    }
  };

  const handleLogin = async (res) => {
    try {
      const decodedUserInfo = jwtDecode(res.credential);
      setUserInfo(decodedUserInfo);
      const backendResponse = await sendTokenToBackend(res.credential);
      console.log('Backend response', backendResponse);
      dispatch(setCredentials({...decodedUserInfo}));
      // Update credentials in redux store with backend response if needed
      // dispatch(setCredentials({ ...decodedUserInfo, ...backendResponse }));
      navigate(redirect);
    } catch (err) {
      console.log(err);
    }

  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      setUserInfo(null);
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

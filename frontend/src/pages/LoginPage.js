import React, { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";

// import { useCookies } from 'react-cookie';

const LoginPage = () => {
  // const [cookies, setCookie] = useCookies(['auth-token'])
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (res) => {
    try {
      const decodedUserInfo = jwtDecode(res.credential);
      setUserInfo(decodedUserInfo);
      console.log(decodedUserInfo);
      dispatch(setCredentials({ ...decodedUserInfo }));
      navigate("/");
    } catch (err) {
      console.log(err);
    }

    // setCookie('auth-token', res.credential, { path: '/', maxAge: 3600 });
    // setUser(jwtdecode(token));
    // navigate("/")//go to landing page
  };
  // const login = useGoogleLogin({
  //     onSuccess: tokenResponse => {
  //         console.log(tokenResponse);
  //         setUser(tokenResponse);
  //     },
  //     onError: () => console.log('Login Failed'),
  // });

  const handleLogout = () => {
    try {
      dispatch(logout());
      setUserInfo(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div className="flex h-[calc(100vh-15rem)] w-full items-center justify-center">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => {
          console.log("Login Failed");
          // TODO: Handle the login failure
        }}
      />
    </div>
  );
};

export default LoginPage;

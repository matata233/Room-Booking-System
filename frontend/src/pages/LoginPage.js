import React, { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "../slices/authSlice";

// import { useCookies } from 'react-cookie';

const LoginPage = () => {
  // const [cookies, setCookie] = useCookies(['auth-token'])
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation(); // 'useLocation' hook returns the location object from the current URL
  // 'search' returns a string containing all the query parameters.
  const searchParams = new URLSearchParams(search); // extract the query parameter and its value
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = (res) => {
    try {
      const decodedUserInfo = jwtDecode(res.credential);
      setUserInfo(decodedUserInfo);
      console.log(decodedUserInfo);
      dispatch(setCredentials({ ...decodedUserInfo }));
      navigate(redirect);
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

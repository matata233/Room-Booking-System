import React, { useState } from 'react';
import {CredentialResponse, GoogleLogin, useGoogleLogin} from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
// import { useCookies } from 'react-cookie';

const LoginPage = () => {
    // const [cookies, setCookie] = useCookies(['auth-token'])
    const [user, setUser] = useState(null);
    const navigate = useNavigate()

    const handleLogin = (res: CredentialResponse) => {
        console.log(res);
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

    return (
        <div>
            <h2>Login Page</h2>
            <GoogleLogin
                onSuccess={handleLogin}
                onError={() => {
                    console.log('Login Failed');
                    // TODO: Handle the login failure
                }}
            />
            {user && (
                    <div>
                        <p>Welcome, {user.name}</p>
                        <img src={user.picture} alt="Profile" />
                    </div>
                )}
        </div>
    );
};

export default LoginPage;

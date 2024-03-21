import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const TokenExpirationListener = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const handleTokenExpired = () => {
            console.log("listener works!");
            dispatch(logout());
        };

        window.addEventListener('token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('token-expired', handleTokenExpired);
        };
    }, [navigate]);

    return null;
};
export default TokenExpirationListener;

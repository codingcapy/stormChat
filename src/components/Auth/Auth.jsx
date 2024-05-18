
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: auth component for CapyChat client
 */

import { jwtDecode } from "jwt-decode";
import { setSession, getAccessToken } from "../../services/jwt.service";
import useAuthStore from "../../store/AuthStore";
import { useEffect } from "react";

export default function Auth({ children }) {

    const { loginWithToken, tokenLoading, logoutService } = useAuthStore((state) => state);

    async function handleAuthentication() {
        let token = getAccessToken();
        if (!token) {
            logoutService();
            return;
        }
        if (!isAuthTokenValid(token)) return;
        setSession(token);
        loginWithToken();
    }

    function isAuthTokenValid(token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn("access token expired");
            logoutService();
            return false;
        }
        else {
            return true;
        }
    }

    useEffect(() => {
        handleAuthentication();
    }, [])

    return <div>{tokenLoading ? "" : children}</div>
}
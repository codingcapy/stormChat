
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: jwt service for CapyChat client
 */

import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function setSession(token) {
    if (token) {
        localStorage.setItem("jwt_access_token", token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    else {
        localStorage.removeItem("jwt_access_token");
        delete axios.defaults.headers.common["Authorization"];
    }
}

export function getAccessToken() {
    return window.localStorage.getItem("jwt_access_token");
}

export function getUserIdFromToken() {
    const token = getAccessToken();
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.id;
        }
        catch (err) {
            console.log("Error decoding token: ", err);
            return null;
        }
    }
    else {
        return null;
    }
}
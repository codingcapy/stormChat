
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: AuthStore for CapyChat client
 */

import DOMAIN from "../services/endpoint";
import axios from "axios";
import { setSession } from "../services/jwt.service";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
    user: null,
    authLoading: false,
    tokenLoading: true,
    setUser: (args) => set({ user: args }),
    logoutService: () => {
        setSession(null);
        set({ user: null, authLoading: false, tokenLoading: false });
    },
    loginService: async (username, password) => {
        set({ authLoading: true });
        try {
            const res = await axios.post(`${DOMAIN}/api/user/login`, { username, password });
            if (res.data.result?.user && res.data.result?.token) {
                setSession(res.data.result?.token);
                set({ user: res.data.result?.user, authLoading: false });
            }
            else {
                set({ authLoading: false, user: null });
            }
        }
        catch (err) {
            console.log(err);
            set({ authLoading: false });
        }
    },
    loginWithToken: async () => {
        try {
            const res = await axios.post(`${DOMAIN}/api/user/validation`);
            if (res.data.result?.user && res.data.result?.token) {
                setSession(res.data.result?.token);
                set({ user: res.data.result?.user, tokenLoading: false });
            }
            else {
                set({ tokenLoading: false, user: null });
            }
        }
        catch (err) {
            console.log(err);
            get().logoutService();
        }
    }
}))

export default useAuthStore;
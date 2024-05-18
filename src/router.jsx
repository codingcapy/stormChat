
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: router for CapyChat client
 */

import React from "react"
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ForgotUsernamePage from "./pages/ForgotUsernamePage"
import Loader from "./components/Loader";

export function Router() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/capychat/loader" element={<Loader />} />
                <Route path="/capychat/" element={<React.Suspense fallback={<Loader />}><HomePage /></React.Suspense>} />
                <Route path="/capychat/users/login" element={<React.Suspense fallback={<Loader />}><LoginPage /></React.Suspense>} />
                <Route path="/capychat/users/signup" element={<React.Suspense fallback={<Loader />}><SignupPage /></React.Suspense>} />
                <Route path="/capychat/dashboard/:userId" element={<React.Suspense fallback={<Loader />}><Dashboard /></React.Suspense>} />
                <Route path="/capychat/about" element={<React.Suspense fallback={<Loader />}><AboutPage /></React.Suspense>} />
                <Route path="/capychat/contact" element={<React.Suspense fallback={<Loader />}><ContactPage /></React.Suspense>} />
                <Route path="/capychat/forgotpassword" element={<React.Suspense fallback={<Loader />}><ForgotPasswordPage /></React.Suspense>} />
                <Route path="/capychat/forgotusername" element={<React.Suspense fallback={<Loader />}><ForgotUsernamePage /></React.Suspense>} />
            </Route>
        )
    )
    return router;
}
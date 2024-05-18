
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: login page for CapyChat client
 */

import { NavLink, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import useAuthStore from "../store/AuthStore";

export default function LoginPage() {

    const navigate = useNavigate();
    const { loginService, authLoading, user } = useAuthStore((state) => state);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!!user) {
            navigate(`/capychat/dashboard/${user.user_id}`);
        }
    }, [user])

    function onLogin(e) {
        e.preventDefault();
        let username = e.target.username?.value;
        let password = e.target.password?.value;
        if (!username || !password) return;
        loginService(username, password);
        if (!user) {
            setMessage("Invalid login credentials");
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mx-auto">
                <form onSubmit={onLogin} className="flex flex-col">
                    <h2 className="py-10 text-2xl text-indigo-600 font-medium text-center">Login</h2>
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder="Username" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    </div>
                    <div className="flex flex-col my-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    </div>
                    <button className="rounded-xl my-5 py-2 px-2 bg-indigo-600 text-white">Login</button>
                    <div>New User? <NavLink to="/capychat/users/signup" className="text-center text-indigo-600">Sign Up</NavLink></div>
                    <div>Forgot Password? <NavLink to="/capychat/forgotpassword" className="text-center text-indigo-600">Reset</NavLink></div>
                    <div>Forgot Username? <NavLink to="/capychat/forgotusername" className="text-center text-indigo-600">Recover</NavLink></div>
                </form>
                {authLoading ? <h2>Loading...</h2> : null}
                <p>{message}</p>
            </main>
            <Footer />
        </div>
    )
}
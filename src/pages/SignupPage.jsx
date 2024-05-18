
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: signup page for CapyChat client
 */

import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import DOMAIN from "../services/endpoint";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function SignupPage() {

    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const email = e.target.email.value;
        const newUser = { username, password, email };
        const res = await axios.post(`${DOMAIN}/api/users/`, newUser);
        if (res?.data.success) {
            setMessage(res?.data.message);
            navigate("/capychat/users/login");
        }
        else {
            setMessage(res?.data.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <h2 className="py-10 text-2xl text-indigo-600 font-medium text-center">Sign Up</h2>
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder="Username" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    </div>
                    <div className="flex flex-col my-2">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    </div>
                    <div className="flex flex-col my-2">
                        <label htmlFor="password">Email (for password recovery and notifications)</label>
                        <input type="email" name="email" id="email" placeholder="example@example.com" required className="px-2 border rounded-lg border-slate-700 py-1" />
                    </div>
                    <button className="rounded-xl my-5 py-2 px-2 bg-indigo-600 text-white">Sign Up</button>
                    <NavLink to="/capychat/users/login" className="text-center text-indigo-600">Login</NavLink>
                </form>
                <p>{message}</p>
            </main>
            <Footer />
        </div>
    )
}
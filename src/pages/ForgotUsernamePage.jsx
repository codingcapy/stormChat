
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: forgot username page for CapyChat client
 */

import { NavLink, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import useAuthStore from "../store/AuthStore";
import axios from "axios";
import DOMAIN from "../services/endpoint";

export default function ForgotUsernamePage() {

    const navigate = useNavigate();
    const { loginService, authLoading, user } = useAuthStore((state) => state);
    const [message, setMessage] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    async function handleRecovery(e) {
        e.preventDefault();
        let email = e.target.email?.value;
        const res = await axios.post(`${DOMAIN}/api/users/forgotusername/${email}`, { email });
        if (res.data.success) {
            setMessage("A username recovery email was sent to your email address")
            setEmailSent(true)
        }
        else {
            setMessage("No account was found under that email address.")
        }
    }

    return (
        <div>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 mx-auto py-10">
                    {!emailSent && <form onSubmit={handleRecovery} className="flex flex-col">
                        <h2 className="py-10 text-2xl text-indigo-600 font-medium text-center">Forgot Username</h2>
                        <div className="flex flex-col">
                            <label htmlFor="username">Email</label>
                            <input type="email" name="email" id="email" placeholder="Your Email" required className="px-2 border rounded-lg border-slate-700 py-1" />
                        </div>
                        <button className="rounded-xl my-5 py-2 px-2 bg-indigo-600 text-white">Send</button>
                    </form>}
                    <p className="text-xl">{message}</p>
                    {emailSent && <div className="mx-auto border rounded-xl py-5 px-5 my-5 bg-indigo-600 w-[100px] text-white text-center">
                        <NavLink to="/capychat/users/login">Login</NavLink>
                    </div>}
                    <div>Returning User? <NavLink to="/capychat/users/login" className="text-center text-indigo-600">Login</NavLink></div>
                    <div>New User? <NavLink to="/capychat/users/signup" className="text-center text-indigo-600">Sign Up</NavLink></div>
                    <div>Forgot Password? <NavLink to="/capychat/forgotpassword" className="text-center text-indigo-600">Reset</NavLink></div>
                    {authLoading ? <h2>Loading...</h2> : null}
                </main>
                <Footer />
            </div>
        </div>
    )
}
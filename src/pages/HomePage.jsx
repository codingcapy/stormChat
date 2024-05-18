
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: home page for CapyChat client
 */

import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useAuthStore from "../store/AuthStore";
import { useEffect } from "react";

export default function HomePage() {

    const { user } = useAuthStore((state) => state);
    const navigate = useNavigate();

    useEffect(()=>{
        if (user){
            navigate(`dashboard/${user.user_id}`)
        }    
    }
    ,[])

    return (
        <div className="flex flex-col fixed min-h-full min-w-full">
            <Header />
            <h1 className="py-5 text-2xl font-medium text-center bg-indigo-600 text-white">CapyChat</h1>
            <p className="py-5 font-medium text-center bg-indigo-600 text-white">Chat, communicate, play with friends and have fun</p>
            <main className="flex-1 mx-auto ">
                {!user && <div className="flex flex-col items-center">
                    <div className="border rounded-xl py-5 px-5 my-5 bg-indigo-600 text-white">
                        <NavLink to="/capychat/users/login">Login</NavLink>
                    </div>
                    <NavLink to="/capychat/users/signup" className="underline text-indigo-800">Sign Up</NavLink>
                </div>}
            </main>
            <Footer />
        </div>
    )
}
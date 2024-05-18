
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: contact page for CapyChat client
 */

import axios from "axios";
import DOMAIN from "../services/endpoint";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {

    const [notification, setNotification] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [contentInput, setContentInput] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const content = e.target.content.value;
        const newMessage = { email, content };
        const res = await axios.post(`${DOMAIN}/api/comments`, newMessage);
        if (res?.data.success) {
            setNotification("Thank you for your message! If a response is required, we will get back to you as soon as possible!");
            setEmailInput("");
            setContentInput("");
        }
    }

    return (
        <div className="flex flex-col min-h-screen ">
            <Header />
            <main className="flex-1 mx-auto text-center md:max-w-screen-xl">
                <h1 className="text-3xl font-bold text-center py-5 text-indigo-600">
                    Contact Us
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex flex-col">
                        <label htmlFor="title" >Email Address</label>
                        <input type="email" name='email' id='email' placeholder="e.g. abc@gmail.com" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="px-2 w-80 border rounded-lg border-slate-700 py-1 text-black" />
                    </div>
                    <div className="flex flex-col my-2">
                        <label htmlFor="content">Message</label>
                        <textarea type="text" name='content' id='content' placeholder='Tell us your thoughts!' rows="10" cols="40" className="px-2 w-80 border rounded-lg border-slate-700 py-1 text-black" value={contentInput} onChange={(e) => setContentInput(e.target.value)} />
                    </div>
                    <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-indigo-600 text-white">Send</button>
                </form>
                {notification}
            </main>
            <Footer />
        </div>
    )
}
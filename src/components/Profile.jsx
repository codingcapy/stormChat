
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: profile component for CapyChat client
 */

import useAuthStore from "../store/AuthStore"
import DOMAIN from "../services/endpoint"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CgProfile } from "react-icons/cg";
import profilePic from "/capypaul01.jpg";

export default function Profile() {
    const { user } = useAuthStore((state) => state)
    const [editPasswordMode, setEditPasswordMode] = useState(false)
    const [editUsernameMode, setEditUsernameMode] = useState(false)
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function toggleEditPasswordMode() {
        setEditPasswordMode(!editPasswordMode)
    }

    async function handleEditPassword(e) {
        e.preventDefault()
        const password = e.target.password.value;
        const userId = user.user_id
        const updatedUser = { password };
        const res = await axios.post(`${DOMAIN}/api/users/${userId}`, updatedUser);
        toggleEditPasswordMode();
        setMessage("Password updated successfully!")
        if (res?.data.success) {
            navigate(`/capychat/dashboard/${userId}`);
        }
    }

    async function handleEditUsername(e) {
        e.preventDefault()
        const username = e.target.username.value;
        const userId = user.user_id
        const updatedUsername = { username };
        const res = await axios.post(`${DOMAIN}/api/users/update/${userId}`, updatedUsername);
        setEditUsernameMode(false);
        setMessage("Username updated successfully!")
        if (res?.data.success) {
            navigate(`/capychat/dashboard/${userId}`);
        }
    }

    return (
        <div className="px-5 border-2 border-slate-600 md:w-[900px] h-[89vh] md:h-screen overflow-y-auto">
            <h1 className="flex text-3xl font-bold text-center py-5 "><CgProfile size={35} className="text-center mx-2" />Your Profile</h1>
            <img src={profilePic} className="max-w-30 md:max-w-xs rounded-full mx-auto pb-2" />
            <p className="my-1 md:my-3">Username: {user.username}</p>
            <p className="my-1 md:my-3">Member Since: {user.created_at.slice(0, 10)}</p>
            {editUsernameMode ?
                <form onSubmit={handleEditUsername} className="flex flex-col">
                    <input type="text" id="username" name="username" placeholder="New Username" required className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                    <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" >Change Username</button>
                    <button className="" onClick={()=>setEditUsernameMode(false)}>Cancel</button>
                </form>
                : <button className="block rounded-xl my-1 md:my-2 py-2 px-2 bg-slate-700 text-white" onClick={()=>setEditUsernameMode(true)}>Change Username</button>}
            {editPasswordMode
                ? <form onSubmit={handleEditPassword} className="flex flex-col">
                    <input type="password" id="password" name="password" placeholder="New Password" required className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                    <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" >Change password</button>
                    <button className="" onClick={toggleEditPasswordMode}>Cancel</button>
                </form>
                :
                <button className="rounded-xl my-1 md:my-2 py-2 px-2 bg-slate-700 text-white" onClick={toggleEditPasswordMode}>Change password</button>}
            <p>{message}</p>
        </div>
    )
}

/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: add friend component for CapyChat client
 */

import { useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";

const socket = io("https://capychat-server-production.up.railway.app");

export default function AddFriend(props) {

    const [message, setMessage] = useState("");
    const [inputFriend, setinputFriend] = useState("");

    async function handleSubmit(e) {
        e.preventDefault()
        const username = props.user.username;
        const friend = e.target.frienduser.value;
        const data = { username, friend };
        const res = await axios.post(`${DOMAIN}/api/user/friends`, data);
        if (res?.data.success) {
            setMessage(res?.data.message);
            const friends = await axios.get(`${DOMAIN}/api/user/friends/${props.user.user_id}`)
            const newFriends = []
            friends.data.forEach((friend) => newFriends.push(friend.username))
            props.setFriends(newFriends)
            setinputFriend("");
            socket.emit("friend", data.friend);
        }
        else {
            setMessage(res?.data.message);
            setinputFriend("");
        }
    }

    return (
        <div className="px-5 flex-2 border-2 border-slate-600 md:w-[900px] h-[90vh] md:h-screen overflow-y-auto ">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <h2 className="py-10 text-2xl text-slate-700 font-medium text-center">Add Friend</h2>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="frienduser" id="frienduser" placeholder="Username" value={inputFriend} onChange={(e) => setinputFriend(e.target.value)} required className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                </div>
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Add</button>
            </form>
            <p>{message}</p>
        </div>
    )
}
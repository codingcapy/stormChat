
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friend profile component for CapyChat client
 */

import { CgProfile } from "react-icons/cg";
import profilePic from "/capypaul01.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
import DOMAIN from "../services/endpoint";

export default function FriendProfile(props) {

    const [blocked, setBlocked] = useState(false)
    const [blockMode, setBlockMode] = useState(false)
    const [unblockMode, setUnblockMode] = useState(false)

    async function handleBlock(e) {
        e.preventDefault();
        const userId = props.user.user_id;
        const res = await axios.post(`${DOMAIN}/api/users/block/${props.friendName}`, { userId });
        if (res?.data.success) {
            setBlocked(true);
            setBlockMode(false);
        }
        else {
            console.log(res.data.message);
        }
    }

    async function handleUnblock(e) {
        e.preventDefault();
        const userId = props.user.user_id;
        const res = await axios.post(`${DOMAIN}/api/users/unblock/${props.friendName}`, { userId });
        if (res?.data.success) {
            setBlocked(false);
            setUnblockMode(false);
        }
        else {
            console.log(res.data.message);
        }
    }

    useEffect(() => {
        async function getUserFriend() {
            const userId = props.user.user_id;
            const userFriend = await axios.post(`${DOMAIN}/api/users/userfriend/${props.friendName}`, {userId});
            if(userFriend.data.blocked){
                setBlocked(true);
            }
            else{
                setBlocked(false);
            }
        }
        getUserFriend()
    }, [props.friendName])

    return (
        <div className="px-5 border-2 border-slate-600 md:w-[900px] h-[89vh] md:h-screen overflow-y-auto">
            {blockMode && <div className="absolute z-[201] py-12 px-2 md:px-10 bg-slate-800 border border-white top-[35%] md:left-[40%] flex flex-col">
                <div className="py-2">Are you sure you want to block?</div>
                <div className="mx-auto py-2">
                    <form onSubmit={handleBlock} className="md:flex md:flex-col">
                        <button className="hidden md:block delete-btn cursor-pointer px-5 py-2 md:my-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" >Block</button>
                        <button className="hidden md:block md:pb-1 edit-btn cursor-pointer px-5 py-2 md:my-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300" onClick={() => setBlockMode(false)}>Cancel</button>
                        <button className="md:hidden edit-btn cursor-pointer px-5 mr-1 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300" onClick={() => setBlockMode(false)}>Cancel</button>
                        <button className="md:hidden delete-btn cursor-pointer px-5 mr-1 py-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300">Block</button>
                    </form>
                </div>
            </div>}
            {blockMode && <div className="fixed inset-0 bg-black z-[200] opacity-70"></div>}
            {unblockMode && <div className="absolute z-[201] py-12 px-2 md:px-10 bg-slate-800 border border-white top-[35%] md:left-[40%] flex flex-col">
                <div className="py-2">Are you sure you want to unblock?</div>
                <div className="mx-auto py-2">
                    <form onSubmit={handleUnblock} className="md:flex md:flex-col">
                        <button type="submit" className="hidden md:block delete-btn cursor-pointer px-5 py-2 md:my-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300" >Unblock</button>
                        <button className="hidden md:block md:pb-1 edit-btn cursor-pointer px-5 py-2 md:my-2 bg-red-800 rounded-xl hover:bg-red-600  transition-all ease duration-300" onClick={() => setUnblockMode(false)}>Cancel</button>
                        <button className="md:hidden edit-btn cursor-pointer px-5 py-2 mr-1 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" onClick={() => setUnblockMode(false)}>Cancel</button>
                        <button className="md:hidden delete-btn cursor-pointer px-5 py-2 mr-1 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Unblock</button>
                    </form>
                </div>
            </div>}
            {unblockMode && <div className="fixed inset-0 bg-black z-[200] opacity-70"></div>}
            <p className="flex py-5 text-xl"><CgProfile size={25} className="text-center mx-2" />{props.friendName}</p>
            <img src={profilePic} className="max-w-30 md:max-w-xs rounded-full mx-auto pb-2" />
            {blocked && <div className="rounded-2xl my-5 py-2 px-2  text-red-500" >BLOCKED</div>}
            {blocked && <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={() => setUnblockMode(true)}>Unblock</button>}
            {!blocked && <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={props.handleCreateChat}>Start Chat</button>}
            <br />
            {!blocked && <button className="rounded-xl my-5 py-2 px-2 bg-red-900 text-white" onClick={() => setBlockMode(true)}>Block</button>}
        </div>
    )
}
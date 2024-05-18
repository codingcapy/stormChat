
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: message component for CapyChat client
 */

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import profilePic from "/capypaul01.jpg";

const socket = io("https://capychat-server-production.up.railway.app");

export default function Message(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [messageContent, setMessageContent] = useState(props.message.content);
    const messagesEndRef = useRef(null);
    const [deleteMode, setDeleteMode] = useState(false)

    async function handleEditMessage(e) {
        e.preventDefault();
        const content = e.target.content.value;
        const messageId = e.target.messageid.value;
        const message = { content };
        const res = await axios.post(`${DOMAIN}/api/messages/update/${messageId}`, message);
        if (res?.data.success) {
            const newMessage = await axios.get(`${DOMAIN}/api/messages/${props.currentChat.chat_id}`);
            props.setCurrentMessages(newMessage.data);
            setEditMode(false);
            socket.emit("message", message);
            setDeleteMode(false)
        }
        else {
            setInputMessage("");
        }
    }

    useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setIsMenuSticky(scrollPosition > scrollThreshold);
        }
        window.addEventListener("scroll", handleScroll);
        scrollToBottom();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [props.currentMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="py-2 message-container group hover:bg-slate-600 transition-all ease duration-300">
            {deleteMode && <div className="absolute z-[201] py-12 px-2 md:px-10 bg-slate-800 border border-white top-[35%] md:left-[40%] flex flex-col">
                <div className="py-2">Are you sure you want to delete?</div>
                <div className="mx-auto py-2">
                    <form onSubmit={handleEditMessage}>
                        <input name="content" id="content" defaultValue="[this message was deleted]" className="hidden" />
                        <input name="messageid" id="messageid" defaultValue={`${props.message.message_id}`} className="hidden" />
                        <button className="hidden md:block md:pb-1 edit-btn cursor-pointer px-5 py-2 md:my-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Delete</button>
                        <button className="hidden md:block delete-btn cursor-pointer px-5 py-2 md:my-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" onClick={() => setDeleteMode(false)}>Cancel</button>
                        <button className="md:hidden delete-btn cursor-pointer px-5 mr-1 py-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" onClick={() => setDeleteMode(false)}>Cancel</button>
                        <button className="md:hidden edit-btn cursor-pointer px-5 py-2 mr-1 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Delete</button>
                    </form>
                </div>
            </div>}
            {deleteMode && <div className="fixed inset-0 bg-black z-[200] opacity-70"></div>}
            {props.message.reply_content && <div className="text-gray-400 pb-1">
                <div className="flex"><img src={profilePic} className="w-[20px] h-[20px]  rounded-full mx-2" /><span className="font-bold pr-2">@{props.message.reply_username}</span> {props.message.reply_content}</div>
            </div>}
            <div className="flex">
                <img src={profilePic} className="w-[40px] h-[40px] rounded-full mr-2" />
                <div>
                    <div className="md:flex md:w-[790px] justify-between px-1">
                        <div className="flex">
                            <div className="font-bold px-1">{props.message.username}</div><div className="pl-2">on {props.message.created_at.slice(0, 10)} {props.message.created_at.slice(11, 19)}</div>
                        </div>
                        <div className=" edit-delete hidden group-hover:flex opacity-100 transition-opacity">
                            {!editMode && <div onClick={() => setEditMode(true)} className="flex edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all ease duration-300">Edit <MdModeEditOutline size={20} className="ml-2" /></div>}
                            {!editMode &&
                                <button onClick={() => setDeleteMode(true)} className="flex delete-btn cursor-pointer px-2 mx-1 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300">Delete <FaTrashCan size={20} className="ml-2 pt-1" /></button>
                            }
                        </div>
                    </div>
                    {!editMode && <div>
                        <div className="overflow-wrap break-word pb-1">{props.message.content}</div>
                    </div>}
                    {editMode && <form onSubmit={handleEditMessage}>
                        <input type="text" name="content" id="content" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="text-black" />
                        <input name="messageid" id="messageid" defaultValue={`${props.message.message_id}`} className="hidden" />
                        <button className="edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl">Edit</button>
                        <button className="delete-btn cursor-pointer px-2 mx-1 bg-red-600 rounded-xl" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>}
                </div>
            </div>
        </div>
    )
}
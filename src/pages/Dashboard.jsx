
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: dashboard for CapyChat client
 */

import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import useAuthStore from "../store/AuthStore";
import Friends from "../components/Friends";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import AddFriend from "../components/AddFriend";
import FriendProfile from "../components/FriendProfile";
import Profile from "../components/Profile";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline, IoChatbubbleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const socket = io("https://capychat-server-production.up.railway.app");

export default function Dashboard() {

    const { logoutService, user } = useAuthStore((state) => state);
    const [chatsMode, setChatsMode] = useState(true);
    const [friendsMode, setFriendsMode] = useState(false);
    const [showDefault, setShowDefault] = useState(true);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showFriend, setShowFriend] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [friend, setFriend] = useState("");
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [inputChat, setInputChat] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [logoutMode, setLogoutMode] = useState(false);
    const [messageTooLong, setMessageTooLong] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function getFriends() {
            const friends = await axios.get(`${DOMAIN}/api/user/friends/${user.user_id}`)
            const newFriends = []
            friends.data.forEach((friend) => { newFriends.push(friend.username) })
            setFriends(newFriends)
        }
        getFriends()
    }, [user.user_id])

    function tappedChats() {
        setChatsMode(true);
        setFriendsMode(false);
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedChat() {
        setChatsMode(false);
        setShowMessages(true);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedFriends() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(true);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedAddFriend() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(true);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedFriend() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(true);
        setShowProfile(false);
    }

    function tappedProfile() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(true);
    }

    function clickedAddFriend() {
        setShowMessages(false);
        setShowAddFriend(true);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(false);
        tappedAddFriend();
    }

    async function clickedChat(chat) {
        const newChat = await axios.get(`${DOMAIN}/api/chats/${chat.chat_id}`);
        const newMessages = await axios.get(`${DOMAIN}/api/messages/${chat.chat_id}`);
        setCurrentChat(newChat.data);
        setCurrentMessages(newMessages.data);
        setShowMessages(true);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(false);
        tappedChat();
    }

    function clickedFriend(username) {
        setFriend(username);
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(true);
        setShowDefault(false);
        setShowProfile(false);
        tappedFriend();
    }

    function clickedProfile() {
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(true);
        tappedProfile();
    }

    function clickedLeaveChat() {
        setShowDefault(true);
        tappedChats();
    }

    async function handleCreateChat(e) {
        e.preventDefault();
        const currentUser = user.username;
        const currentFriend = friend;
        const title = `${currentUser}, ${currentFriend}`;
        const chat = { title, user: currentUser, friend: currentFriend };
        const res = await axios.post(`${DOMAIN}/api/chats`, chat);
        if (res?.data.success) {
            const response = await axios.get(`${DOMAIN}/api/chats/user/${user.user_id}`)
            setChats(response.data);
            setInputChat("");
            socket.emit("chat", chat);
            const newChat = response.data[response.data.length - 1]
            clickedChat(newChat)
        }
        else {
            setInputChat("");
        }
    }

    function sanitizeInput(input) {
        return input.replace(/[&<>"']/g, function (match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

    async function handleCreateMessage(e) {
        e.preventDefault();
        const content = e.target.content.value;
        const currentUser = user.username;
        if (content.length > 25000) {
            return setMessageTooLong(true)
        }
        const message = { content, user: currentUser, chatId: currentChat.chat_id };
        const res = await axios.post(`${DOMAIN}/api/messages`, message);
        if (res?.data.success) {
            const newMessage = await axios.get(`${DOMAIN}/api/messages/${currentChat.chat_id}`);
            setCurrentMessages(newMessage.data);
            setInputMessage("");
            socket.emit("message", message);
        }
        else {
            setInputMessage("");
        }
    }

    function handleLogout() {
        logoutService();
        navigate('/capychat/')
    }

    useEffect(() => {
        socket.on("message", receiveMessage);
        return () => socket.off("message", receiveMessage);
    }, [currentMessages]);

    async function receiveMessage() {
        const newMessage = await axios.get(`${DOMAIN}/api/messages/${currentChat.chat_id}`);
        setCurrentMessages(newMessage.data);
    }

    useEffect(() => {
        socket.on("chat", receiveChat);
        return () => socket.off("chat", receiveChat);
    }, [chats]);

    async function receiveChat() {
        const response = await axios.get(`${DOMAIN}/api/chats/user/${user.user_id}`)
        setChats(response.data);
    }

    useEffect(() => {
        socket.on("friend", receiveFriend);
        return () => socket.off("friend", receiveFriend);
    }, [friends]);

    async function receiveFriend() {
        const friends = await axios.get(`${DOMAIN}/api/user/friends/${user.user_id}`)
        const newFriends = []
        friends.data.forEach((friend) => newFriends.push(friend.username))
        setFriends(newFriends)
    }

    useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setIsMenuSticky(scrollPosition > scrollThreshold);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        async function getChats() {
            const res = await axios.get(`${DOMAIN}/api/chats/user/${user.user_id}`)
            setChats(res.data)
        }
        getChats()
    }, [user.user_id])

    return (
        <div className="flex flex-col fixed min-h-full min-w-full mx-auto bg-slate-800 text-white">
            <main className="flex-1">
                {logoutMode && <div className="absolute z-[201] py-12 px-2 md:px-10 bg-slate-800 border border-white top-[35%] left-[13%] md:left-[40%] flex flex-col">
                    <div className="py-2">Are you sure you want to logout?</div>
                    <div className="mx-auto py-2">
                        <form onSubmit={handleLogout} className="md:flex md:flex-col">
                            <button type="submit" className="hidden md:block md:pb-1 edit-btn cursor-pointer px-5 py-2 md:my-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Yes</button>
                            <button className="hidden md:block delete-btn cursor-pointer px-5 py-2 md:my-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" onClick={() => setLogoutMode(false)}>No</button>
                            <button className="md:hidden delete-btn cursor-pointer px-5 py-2 mr-1 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300" onClick={() => setLogoutMode(false)}>No</button>
                            <button type="submit" className="md:hidden edit-btn cursor-pointer px-5 mr-1 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Yes</button>
                        </form>
                    </div>
                </div>}
                {logoutMode && <div className="fixed inset-0 bg-black z-[200] opacity-70"></div>}
                {messageTooLong && <div className="absolute z-[201] py-12 px-2 md:px-10 bg-slate-800 border border-white top-[20%] md:left-[40%] flex flex-col">
                    <div className="py-2">Your message is too long!</div>
                    <div className="mx-auto py-2">
                        <button onClick={() => setMessageTooLong(false)} className="hidden md:block md:pb-1 edit-btn cursor-pointer px-5 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">OK</button>
                    </div>
                </div>}
                {messageTooLong && <div className="fixed inset-0 bg-black z-[200] opacity-70"></div>}
                <div className="hidden md:flex">
                    <div className="flex">
                        <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} user={user} friends={friends} setFriends={setFriends} />
                        <Chats clickedChat={clickedChat} chats={chats} />
                        {showDefault && <div className="px-5 border-2 border-slate-600 bg-slate-800 min-w-full h-screen overflow-y-auto">
                            <div className="flex text-xl sticky top-0 bg-slate-800 py-5"><IoChatbubbleOutline size={25} className="mx-2" />Messages</div>
                        </div>}
                        {showMessages && <Messages currentChat={currentChat} user={user} handleCreateMessage={handleCreateMessage} inputMessage={inputMessage} setInputMessage={setInputMessage} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages} clickedLeaveChat={clickedLeaveChat} setChats={setChats} setCurrentChat={setCurrentChat} clickedFriend={clickedFriend} />}
                        {showAddFriend && <AddFriend setFriends={setFriends} user={user} friends={friends} />}
                        {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} user={user} inputChat={inputChat} setInputChat={setInputChat} />}
                        {showProfile && <Profile />}
                        <div className="flex flex-col">
                            <div onClick={clickedProfile} className="flex px-2 py-5 rounded-xl hover:bg-slate-600 transition-all ease duration-300 font-bold cursor-pointer"><CgProfile size={25} className="text-center mx-2" />{user.username}</div>
                            <button onClick={() => setLogoutMode(true)} className="flex px-5 py-1 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Logout<IoExitOutline size={25} className="text-center mx-2" /></button>
                        </div>
                    </div>
                </div>
                <div className="px-3 flex flex-col md:hidden">
                    {chatsMode && <Chats chats={chats} clickedChat={clickedChat} />}
                    {friendsMode && <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} user={user} friends={friends} setFriends={setFriends} />}
                    {showMessages && <Messages currentChat={currentChat} user={user} handleCreateMessage={handleCreateMessage} inputMessage={inputMessage} setInputMessage={setInputMessage} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages} clickedLeaveChat={clickedLeaveChat} setChats={setChats} setCurrentChat={setCurrentChat} clickedFriend={clickedFriend} />}
                    {showAddFriend && <AddFriend setFriends={setFriends} user={user} />}
                    {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} user={user} inputChat={inputChat} setInputChat={setInputChat} />}
                    {showProfile && <Profile />}
                </div>
            </main>
            <div className={`flex justify-between py-5 px-5 md:hidden sticky z-90 bg-slate-800 ${isMenuSticky ? "top-0" : "bottom-0"
                }`}>
                <div className="" onClick={() => tappedFriends()}>
                    <FaUserFriends size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">Friends</p>
                </div>
                <div className="" onClick={tappedChats}>
                    <IoChatbubbleEllipsesOutline size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">Chats</p>
                </div>
                <div onClick={tappedProfile} className="">
                    <CgProfile size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">You</p>
                </div>
                <div onClick={() => setLogoutMode(true)} className="text-xs">
                    <IoExitOutline size={25} className="text-center mx-2" />Logout
                </div>
            </div>
        </div>
    )
}

/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: about page for CapyChat client
 */

import paulImg from "/paul_kim.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {

    return (
        <div className="flex flex-col min-h-screen ">
            <Header />
            <main className="flex-1 mx-auto text-center max-w-screen-xl">
                <h1 className="text-3xl font-bold text-center py-5 text-indigo-600">
                    About CapyChat
                </h1>
                <p className="py-2">CapyChat is a chat application developed in 2024 by Paul Sunghun Kim that allows you to communicate with your friends, family, coworkers, and loved ones. This web app uses clean, simple features that are easy for you to use and understand.</p>
                <h1 className="text-3xl font-bold text-center py-5 text-indigo-600">
                    Meet the Developer!
                </h1>
                <img src={paulImg} className="max-w-30 md:max-w-xs rounded-full mx-auto" />
                <p className="py-2">Paul Kim is a full stack developer based in Vancouver, British Columbia, Canada. He has been working in the financial industry for 7+ years before studying at British Columbia Institute of Technology for 3 years and graduating from the Applied Software Development and Applied Web Development programs in December 2023. He also loves capybaras, semi-aquatic rodents native to South America!</p>
            </main>
            <Footer />
        </div>
    )
}
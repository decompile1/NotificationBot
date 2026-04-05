/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiBell, HiVideoCamera, HiWifi } from "react-icons/hi";

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    avatar: string;
}

export default function MessageAnimation() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const allNotifications: Notification[] = [
        { id: 1, type: "social", title: "Social Notification", message: "katalinawinemixr93 went live on TikTok.", time: "23 minutes ago", avatar: "/discord.webp" },
        { id: 2, type: "clip", title: "Clip Sent", message: "New clip was created on ishowspeed's stream.", time: "1 hour ago", avatar: "/discord.webp" },
        { id: 3, type: "social", title: "Social Notification", message: "ishowspeed went live on Twitch.", time: "52 minutes ago", avatar: "/discord.webp" },
        { id: 4, type: "social", title: "Social Notification", message: "Ninja went live on TikTok.", time: "1 minute ago", avatar: "/discord.webp" },
        { id: 5, type: "clip", title: "Clip Sent", message: "Another highlight uploaded from stream.", time: "1 minute ago", avatar: "/discord.webp" },
        { id: 6, type: "social", title: "Social Notification", message: "Kai Cenat went live on Twitch.", time: "10 minutes ago", avatar: "/discord.webp" }
    ];

    useEffect(() => {
        setNotifications(allNotifications);

        const rotateNotifications = () => {
            setNotifications((prev) => {
                const newArray = [...prev];
                const lastItem = newArray.pop();
                if (lastItem) newArray.unshift(lastItem);
                return newArray;
            });
        };

        const interval = setInterval(rotateNotifications, 2000);
        return () => clearInterval(interval);
    }, []);

    if (notifications.length === 0) return null;

    const getNotificationIcon = (type: string) => {
        if (type === "social") return <HiWifi className="w-6 h-6 text-red-500" />;
        if (type === "clip") return <HiVideoCamera className="w-6 h-6 text-red-500" />;
        return <HiBell className="w-6 h-6 text-red-500" />;
    };

    return (
        <div className="w-fit text-white">
            <div className="max-w-3xl">

                {/* Notification List */}
                <div className="relative space-y-2 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {notifications.slice(0, 4).map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                layout
                                initial={index === 0 ? { opacity: 0, y: -30, scale: 0.95 } : false}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    layout: { type: "spring", stiffness: 350, damping: 25 },
                                    opacity: { duration: 0.4 },
                                    scale: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                                className="flex items-start gap-6 p-6 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <Image
                                        src={notification.avatar}
                                        alt={notification.title}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-xl object-cover bg-gray-700"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-200">
                                            {notification.title}
                                        </h3>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <p className="text-base text-gray-400">{notification.message}</p>
                                </div>

                                {/* Timestamp */}
                                <div className="shrink-0 text-sm text-gray-500">
                                    {notification.time}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-linear-to-t from-[#0a0a0a] to-transparent" />
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

import { useSelector } from "react-redux";

import api from "../../services/api.js";
import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(
        (state) => state.auth
    );

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/notifications"
            );

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            console.log(
                "Failed to fetch notifications:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    const handleMarkAsRead = async (
        notificationId
    ) => {

        try {

            await api.patch(
                `/notifications/${notificationId}/read`
            );

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.log(error);

        }

    };

    const handleMarkAllAsRead = async () => {

        try {

            await api.patch(
                "/notifications/read-all"
            );

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchNotifications();

        const socket = io(
            "http://localhost:5000",
            {
                withCredentials: true
            }
        );

        socket.on("connect", () => {

            if (user?._id) {

                socket.emit(
                    "register",
                    user._id
                );

            }

        });

        socket.on(
            "new_notification",
            (notification) => {

                setNotifications((prev) => {

                    const exists = prev.some(
                        (item) =>
                            item._id === notification._id
                    );

                    if (exists) {
                        return prev;
                    }

                    return [
                        notification,
                        ...prev
                    ];

                });

                toast.success(
                    notification.title ||
                    "New notification"
                );

            }
        );

        socket.on(
            "connect_error",
            (error) => {

                console.log(
                    "Socket connection error:",
                    error
                );

            }
        );

        return () => {

            socket.disconnect();

        };

    }, [user]);

    return (

        <div className="relative">

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >

                <FaBell size={20} />

                {
                    unreadCount > 0 && (

                        <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-md">

                            {unreadCount}

                        </span>

                    )
                }

            </button>

            {
                open && (

                    <NotificationDropdown
                        notifications={notifications}
                        loading={loading}
                        onRead={handleMarkAsRead}
                        onMarkAllAsRead={
                            handleMarkAllAsRead
                        }
                    />

                )
            }

        </div>

    );

}

export default NotificationBell;
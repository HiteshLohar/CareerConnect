import { useEffect, useRef, useState } from "react";
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
    const notificationRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get("/notifications");
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.log("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            setNotifications((prev) => prev.map((notification) => notification._id === notificationId ? { ...notification, isRead: true } : notification));
        } catch (error) {
            console.log(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch("/notifications/read-all");
            setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const socket = io(import.meta.env.VITE_API_URL.replace(/\/api\/?$/, ""), {
            withCredentials: true,
        });
        socket.on("connect", () => { if (user?._id) socket.emit("register", user._id); });
        socket.on("new_notification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            toast.success(notification.title || "New notification");
        });
        socket.on("connect_error", (error) => console.log("Socket connection error:", error));
        return () => socket.disconnect();
    }, [user?._id]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                open &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [open]);

    return (
        <div ref={notificationRef} className="relative shrink-0">
            <button
                onClick={() => setOpen(!open)}
                className="relative rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                aria-expanded={open}
            >
                <FaBell size={20} />
                {unreadCount > 0 && <span className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white shadow-md">{unreadCount}</span>}
            </button>

            {open && (
                <NotificationDropdown
                    notifications={notifications}
                    loading={loading}
                    onRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                />
            )}
        </div>
    );
}

export default NotificationBell;

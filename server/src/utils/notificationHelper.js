import User from "../models/User.js";
import Notification from "../models/Notification.js";

import { getIO, onlineUsers } from "../../socket.js";


// ========================================
// NOTIFY ADMINS
// ========================================

export const notifyAdmins = async ({
    sender,
    title,
    message,
    type = "SYSTEM"
}) => {

    const admins = await User.find({
        role: "admin"
    }).select("_id");

    if (admins.length === 0) {
        return [];
    }

    const notifications = admins.map((admin) => ({
        recipient: admin._id,
        sender,
        title,
        message,
        type
    }));

    const createdNotifications =
        await Notification.insertMany(
            notifications
        );

    const socketIO = getIO();

    createdNotifications.forEach((notification) => {

        const adminId =
            notification.recipient.toString();

        const socketId =
            onlineUsers.get(adminId);

        if (socketId) {
            socketIO
                .to(socketId)
                .emit(
                    "new_notification",
                    notification
                );
        }
    });

    return createdNotifications;
};


// ========================================
// NOTIFY USER
// ========================================

export const notifyUser = async ({
    recipient,
    sender,
    title,
    message,
    type
}) => {

    const notification =
        await Notification.create({
            recipient,
            sender,
            title,
            message,
            type
        });

    const socketIO = getIO();

    const userId =
        recipient.toString();

    const socketId =
        onlineUsers.get(userId);

    if (socketId) {
        socketIO
            .to(socketId)
            .emit(
                "new_notification",
                notification
            );
    }

    return notification;
};
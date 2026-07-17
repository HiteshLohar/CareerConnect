import mongoose from "mongoose";
import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.userId
        })
            .populate("sender", "fullName profilePhoto")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Notification ID"
            });
        }

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (notification.recipient.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Notification ID"
            });
        }

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (notification.recipient.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await Notification.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Application ID"
            });
        }

        const notification = await Notification.findById(id);

        if(!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        
        if(notification.recipient.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        notification.status = status;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            notification
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
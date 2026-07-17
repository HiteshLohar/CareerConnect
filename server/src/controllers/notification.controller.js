import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getNotifications = asyncHandler(async (req, res) => {

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
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Notification ID");
    }

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.recipient.toString() !== req.user.userId) {
        throw new ApiError(403, "Unauthorized");
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        notification
    });
});

export const deleteNotification = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Notification ID");
    }

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new ApiError(400, "Notification not found");
    }

    if (notification.recipient.toString() !== req.user.userId) {
        throw new ApiError(403, "Unauthorized");
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Application ID");
    }

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    if (notification.recipient.toString() !== req.user.userId) {
        throw new ApiError(403, "Unauthorized");
    }

    notification.status = status;
    await notification.save();

    return res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        notification
    });
});
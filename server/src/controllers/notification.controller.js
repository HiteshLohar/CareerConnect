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

export const markAllAsRead = asyncHandler(async (req, res) => {

    await Notification.updateMany(
        {
            recipient: req.user.userId,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    );

    return res.status(200).json({
        success: true,
        message: "All notifications marked as read"
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

    if (!["Accepted", "Rejected"].includes(status)) {
        throw new ApiError(400, "Invalid application status");
    }

    const application = await Application.findById(id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    const job = await Job.findById(application.job);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.postedBy.toString() !== req.user.userId) {
        throw new ApiError(
            403,
            "You are not authorized to update this application"
        );
    }

    application.status = status;

    await application.save();

    await Notification.create({
        recipient: application.student,
        sender: req.user.userId,
        title:
            status === "Accepted"
                ? "Application Accepted"
                : "Application Rejected",
        message:
            status === "Accepted"
                ? `Your application for ${job.title} has been accepted.`
                : `Your application for ${job.title} has been rejected.`,
        type:
            status === "Accepted"
                ? "APPLICATION_ACCEPTED"
                : "APPLICATION_REJECTED"
    });

    return res.status(200).json({
        success: true,
        message: `Application ${status.toLowerCase()} successfully`,
        application
    });
});
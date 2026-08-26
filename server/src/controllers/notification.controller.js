import Notification from "../models/Notification.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import isValidObjectId from "../utils/validateObjectId.js";

import { notifyUser } from "../utils/notificationHelper.js";


// ========================================
// GET MY NOTIFICATIONS
// ========================================

export const getNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await Notification.find({
                recipient: req.user.userId
            })
                .populate(
                    "sender",
                    "fullName profilePhoto"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({

            success: true,

            count: notifications.length,

            notifications

        });
    }
);


// ========================================
// MARK NOTIFICATION AS READ
// ========================================

export const markNotificationAsRead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new ApiError(
            400,
            "Invalid Notification ID"
        );
    }

    const notification =
        await Notification.findById(id);

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    // =========================
    // OWNER CHECK
    // =========================

    if (
        notification.recipient.toString() !==
        req.user.userId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this notification"
        );
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({

        success: true,

        message:
            "Notification marked as read",

        notification

    });
});


// ========================================
// MARK ALL NOTIFICATIONS AS READ
// ========================================

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

        message:
            "All notifications marked as read"

    });
});


// ========================================
// DELETE NOTIFICATION
// ========================================

export const deleteNotification = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new ApiError(
            400,
            "Invalid Notification ID"
        );
    }

    const notification =
        await Notification.findById(id);

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found"
        );
    }

    // =========================
    // OWNER CHECK
    // =========================

    if (
        notification.recipient.toString() !==
        req.user.userId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to delete this notification"
        );
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({

        success: true,

        message:
            "Notification deleted successfully"

    });
});


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

export const updateApplicationStatus = asyncHandler(async (req, res) => {

    const { id: applicationId } =
        req.params;

    const { status } = req.body;

    const recruiterId =
        req.user.userId;


    // =========================
    // VALIDATE APPLICATION ID
    // =========================

    if (!isValidObjectId(applicationId)) {
        throw new ApiError(
            400,
            "Invalid Application ID"
        );
    }


    // =========================
    // VALIDATE STATUS
    // =========================

    if (
        !["Accepted", "Rejected"].includes(
            status
        )
    ) {
        throw new ApiError(
            400,
            "Invalid application status"
        );
    }


    // =========================
    // FIND APPLICATION
    // =========================

    const application =
        await Application.findById(
            applicationId
        );

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }


    // =========================
    // FIND JOB
    // =========================

    const job =
        await Job.findById(
            application.job
        );

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }


    // =========================
    // RECRUITER OWNER CHECK
    // =========================

    if (
        job.postedBy.toString() !==
        recruiterId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this application"
        );
    }


    // =========================
    // PREVENT DUPLICATE STATUS
    // =========================

    if (application.status === status) {
        throw new ApiError(
            409,
            `Application is already ${status.toLowerCase()}`
        );
    }


    // =========================
    // UPDATE STATUS
    // =========================

    application.status = status;

    await application.save();


    // =========================
    // NOTIFY STUDENT
    // =========================

    const isAccepted =
        status === "Accepted";

    await notifyUser({

        recipient:
            application.student,

        sender:
            recruiterId,

        title:
            isAccepted
                ? "Application Accepted"
                : "Application Rejected",

        message:
            isAccepted
                ? `Your application for ${job.title} has been accepted.`
                : `Your application for ${job.title} has been rejected.`,

        type:
            isAccepted
                ? "APPLICATION_ACCEPTED"
                : "APPLICATION_REJECTED"

    });


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            `Application ${status.toLowerCase()} successfully`,

        application

    });
});
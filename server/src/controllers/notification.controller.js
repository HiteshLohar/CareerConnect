import Notification from "../models/Notification.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import isValidObjectId from "../utils/validateObjectId.js";



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

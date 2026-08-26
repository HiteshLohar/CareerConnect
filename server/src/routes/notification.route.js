import express from "express";

import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllAsRead
} from "../controllers/notification.controller.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// ========================================
// NOTIFICATIONS
// ========================================

router.get(
    "/",
    verifyToken,
    getNotifications
);


// ========================================
// MARK ALL AS READ
// ========================================

router.patch(
    "/read-all",
    verifyToken,
    markAllAsRead
);


// ========================================
// MARK SINGLE AS READ
// ========================================

router.patch(
    "/:id/read",
    verifyToken,
    markNotificationAsRead
);


// ========================================
// DELETE NOTIFICATION
// ========================================

router.delete(
    "/:id",
    verifyToken,
    deleteNotification
);

export default router;
import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification, markAllAsRead } from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);

router.patch("/read-all", verifyToken, markAllAsRead);

router.delete("/:id", verifyToken, deleteNotification);

export default router;
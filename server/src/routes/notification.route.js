import express from "express";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);


router.delete("/:id", verifyToken, deleteNotification);

export default router;
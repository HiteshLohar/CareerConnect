import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { getRecruiterDashboard, getStudentDashboard, getRecruiterAnalytics, getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/recruiter/analytics", verifyToken, authorizeRoles("recruiter"), getRecruiterAnalytics);

router.get('/recruiter', verifyToken, authorizeRoles("recruiter"), getRecruiterDashboard);

router.get('/student', verifyToken, authorizeRoles("student"), getStudentDashboard);

router.get("/admin", verifyToken, authorizeRoles("admin"), getAdminDashboard);


export default router;
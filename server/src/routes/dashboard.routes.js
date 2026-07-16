import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { getRecruiterDashboard, getStudentDashboard, getRecruiterAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get('/recruiter', verifyToken,authorizeRoles("recruiter"), getRecruiterDashboard);

router.get('/student', verifyToken,authorizeRoles("student"), getStudentDashboard);

router.get("/recruiter/analytics", verifyToken, authorizeRoles("recruiter"), getRecruiterAnalytics);


export default router;
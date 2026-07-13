import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { getRecruiterDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get('/recruiter', verifyToken,authorizeRoles("recruiter"), getRecruiterDashboard);

export default router;
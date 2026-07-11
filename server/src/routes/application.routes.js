import express from 'express';
import { applyJob, getApplicants, getMyApplications } from '../controllers/application.controllers.js';
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/:id/apply", verifyToken, authorizeRoles("student"), applyJob);

router.get("/:id/applicants", verifyToken, authorizeRoles('recruiter'), getApplicants);

router.get("/my-applications", verifyToken, authorizeRoles("student"), getMyApplications);

export default router;
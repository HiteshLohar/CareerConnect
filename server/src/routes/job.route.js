import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob } from "../controllers/job.controllers.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createJob);

export default router;
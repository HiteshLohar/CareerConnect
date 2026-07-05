import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById } from "../controllers/job.controllers.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);


export default router;
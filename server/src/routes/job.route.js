import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controllers.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createJob);

router.get("/", getAllJobs);

router.get("/:id", getJobById);

router.put("/:id", verifyToken, authorizeRoles("recruiter"), updateJob);

router.delete("/:id", verifyToken, authorizeRoles("recruiter"), deleteJob);


export default router;
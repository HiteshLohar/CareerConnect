import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, saveJob, removeSavedJob, getSavedJobs} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createJob);

router.get("/", getAllJobs);

router.get("/saved", verifyToken, authorizeRoles("student"), getSavedJobs);

router.get("/:id", getJobById);

router.put("/:id", verifyToken, authorizeRoles("recruiter"), updateJob);

router.delete("/:id", verifyToken, authorizeRoles("recruiter"), deleteJob);

router.post("/:id/save", verifyToken, authorizeRoles("student"), saveJob);

router.delete("/:id/save", verifyToken, authorizeRoles("student"), removeSavedJob);


export default router;
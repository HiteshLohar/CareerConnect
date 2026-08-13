import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, saveJob, removeSavedJob, getSavedJobs, getRecruiterJobs, getRecruiterJob, getAdminJobs, updateJobStatus } from "../controllers/job.controller.js";

const router = express.Router();


// ========================================
// RECRUITER
// ========================================

// Create Job
router.post(
    "/",
    verifyToken,
    authorizeRoles("recruiter"),
    createJob
);

// Get Recruiter's Jobs
router.get(
    "/recruiter",
    verifyToken,
    authorizeRoles("recruiter"),
    getRecruiterJobs
);

// Get Single Recruiter's Job
router.get(
    "/recruiter/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    getRecruiterJob
);


// ========================================
// ADMIN
// ========================================

// Get All Jobs - Admin
router.get(
    "/admin",
    verifyToken,
    authorizeRoles("admin"),
    getAdminJobs
);

// Update Job Status - Admin
router.patch(
    "/admin/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    updateJobStatus
);


// ========================================
// STUDENT / PUBLIC JOBS
// ========================================

// Get All Active Jobs
router.get(
    "/",
    getAllJobs
);


// ========================================
// SAVED JOBS
// ========================================

// Get Saved Jobs
// IMPORTANT: This must come before /:id
router.get(
    "/saved",
    verifyToken,
    authorizeRoles("student"),
    getSavedJobs
);

// Save Job
router.post(
    "/:id/save",
    verifyToken,
    authorizeRoles("student"),
    saveJob
);

// Remove Saved Job
router.delete(
    "/:id/save",
    verifyToken,
    authorizeRoles("student"),
    removeSavedJob
);


// ========================================
// RECRUITER UPDATE / DELETE
// ========================================

// Update Job
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    updateJob
);

// Delete Job
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    deleteJob
);


// ========================================
// GET SINGLE JOB
// ========================================

// IMPORTANT:
// Keep this route at the END
router.get(
    "/:id",
    getJobById
);


export default router;
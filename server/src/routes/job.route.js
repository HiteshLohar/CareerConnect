import express from "express";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, saveJob, removeSavedJob, getSavedJobs, getRecruiterJobs, getRecruiterJob, getAdminJobs, updateJobStatus } from "../controllers/job.controller.js";

const router = express.Router();


// ========================================
// RECRUITER
// ========================================

router.post(
    "/",
    verifyToken,
    authorizeRoles("recruiter"),
    createJob
);

router.get(
    "/recruiter",
    verifyToken,
    authorizeRoles("recruiter"),
    getRecruiterJobs
);

router.get(
    "/recruiter/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    getRecruiterJob
);


// ========================================
// ADMIN
// ========================================

router.get(
    "/admin",
    verifyToken,
    authorizeRoles("admin"),
    getAdminJobs
);

router.patch(
    "/admin/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    updateJobStatus
);


// ========================================
// STUDENT / PUBLIC JOBS
// ========================================

router.get(
    "/",
    getAllJobs
);

router.get(
    "/:id",
    getJobById
);


// ========================================
// SAVED JOBS
// ========================================

router.get(
    "/saved",
    verifyToken,
    authorizeRoles("student"),
    getSavedJobs
);

router.post(
    "/:id/save",
    verifyToken,
    authorizeRoles("student"),
    saveJob
);

router.delete(
    "/:id/save",
    verifyToken,
    authorizeRoles("student"),
    removeSavedJob
);


// ========================================
// RECRUITER UPDATE / DELETE
// ========================================

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    updateJob
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    deleteJob
);


export default router;
import express from "express";

import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany, getAdminCompanies, updateCompanyStatus, getBrowseCompanies, getBrowseCompanyById } from "../controllers/company.controller.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// ========================================
// ADMIN ROUTES
// ========================================

router.get(
    "/admin",
    verifyToken,
    authorizeRoles("admin"),
    getAdminCompanies
);

router.patch(
    "/admin/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    updateCompanyStatus
);


// ========================================
// RECRUITER ROUTES
// ========================================

router.post(
    "/",
    verifyToken,
    authorizeRoles("recruiter"),
    upload.single("logo"),
    createCompany
);


// ========================================
// COMPANY BROWSE
// ========================================

router.get(
    "/browse",
    verifyToken,
    authorizeRoles("student", "recruiter"),
    getBrowseCompanies
);

router.get(
    "/browse/:id",
    verifyToken,
    authorizeRoles("student", "recruiter"),
    getBrowseCompanyById
);


// ========================================
// RECRUITER MANAGEMENT
// ========================================

router.get(
    "/",
    verifyToken,
    authorizeRoles("recruiter"),
    getAllCompanies
);

router.get(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    getCompanyById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    upload.single("logo"),
    updateCompany
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("recruiter"),
    deleteCompany
);

export default router;
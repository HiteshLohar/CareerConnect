import express from "express";
import { createCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createCompany);

router.get("/", verifyToken, authorizeRoles("recruiter"), getAllCompanies);

router.get("/:id", verifyToken, authorizeRoles("recruiter"), getCompanyById);

router.put("/:id", verifyToken, authorizeRoles("recruiter"), updateCompany);

export default router;
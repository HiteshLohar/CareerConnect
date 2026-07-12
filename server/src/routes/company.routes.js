import express from "express";
import { createCompany } from "../controllers/company.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("recruiter"), createCompany);

export default router;
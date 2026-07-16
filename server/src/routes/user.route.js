import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMyProfile, updateProfile, updatePassword ,forgetPassword, verifyOTP, resetPassword} from "../controllers/user.controller.js";
import upload from "../middleware/upload.js";
import { verify } from "crypto";

const router = express.Router();

router.get("/profile", verifyToken, getMyProfile);

router.put("/profile", verifyToken, upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "resume", maxCount: 1 }]), updateProfile);

router.patch("/change-password", verifyToken, updatePassword);

router.post("/forget-password", forgetPassword);

router.post("/verify-otp", verifyOTP);

router.patch("/reset-password", resetPassword);


export default router;
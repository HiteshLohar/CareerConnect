import express from "express";

import {
    verifyToken,
    authorizeRoles
} from "../middleware/authMiddleware.js";

import {
    apiLimiter,
    passwordLimiter
} from "../middleware/rateLimiter.js";

import {
    getMyProfile,
    updateProfile,
    updatePassword,
    forgetPassword,
    verifyOTP,
    resetPassword,
    getAllUsers,
    updateUserStatus
} from "../controllers/user.controller.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// ========================================
// USER PROFILE
// ========================================

router.get(
    "/profile",
    verifyToken,
    getMyProfile
);

router.put(
    "/profile",
    verifyToken,
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    updateProfile
);


// ========================================
// PASSWORD
// ========================================

router.patch(
    "/change-password",
    verifyToken,
    updatePassword
);

router.post(
    "/forget-password",
    passwordLimiter,
    forgetPassword
);

router.post(
    "/verify-otp",
    passwordLimiter,
    verifyOTP
);

router.patch(
    "/reset-password",
    passwordLimiter,
    resetPassword
);


// ========================================
// ADMIN USER MANAGEMENT
// ========================================

router.get(
    "/admin/users",
    verifyToken,
    authorizeRoles("admin"),
    getAllUsers
);

router.patch(
    "/admin/users/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    updateUserStatus
);

export default router;
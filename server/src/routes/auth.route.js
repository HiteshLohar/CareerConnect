import express from "express";

import {
    register,
    login,
    logout,
    getCurrentUser
} from "../controllers/auth.controllers.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
    authLimiter
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
    "/register",
    authLimiter,
    register
);

router.post(
    "/login",
    authLimiter,
    login
);

router.get(
    "/me",
    verifyToken,
    getCurrentUser
);

router.post(
    "/logout",
    logout
);

export default router;
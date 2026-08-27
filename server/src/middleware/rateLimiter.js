import rateLimit from "express-rate-limit";

// ========================================
// GENERAL API LIMITER
// ========================================

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});


// ========================================
// AUTH LIMITER
// Login / Register
// ========================================

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});


// ========================================
// PASSWORD / OTP LIMITER
// ========================================

export const passwordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 5,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many password reset attempts. Please try again later."
    }
});
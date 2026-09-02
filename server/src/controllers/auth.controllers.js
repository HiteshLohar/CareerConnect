import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";


// ========================================
// REGISTER
// ========================================

export const register = asyncHandler(async (req, res) => {

    const {
        fullName,
        email,
        password,
        role,
        phone,
        profilePhoto,
        headline,
        skills,
        education,
        resumeUrl,
        location,
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (
        !fullName?.trim() ||
        !email?.trim() ||
        !password ||
        !location?.trim()
    ) {
        throw new ApiError(
            400,
            "Please fill all required fields"
        );
    }


    // ========================================
    // NORMALIZE DATA
    // ========================================

    const normalizedEmail =
        email.trim().toLowerCase();

    const normalizedFullName =
        fullName.trim();

    const normalizedLocation =
        location.trim();


    // ========================================
    // VALIDATE ROLE
    // ========================================

    const allowedRoles = [
        "student",
        "recruiter"
    ];

    const userRole =
        role || "student";

    if (!allowedRoles.includes(userRole)) {
        throw new ApiError(
            400,
            "Invalid role"
        );
    }


    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    if (password.length < 6) {
        throw new ApiError(
            400,
            "Password must be at least 6 characters long"
        );
    }


    // ========================================
    // CHECK EXISTING USER
    // ========================================

    const existingUser =
        await User.findOne({
            email: normalizedEmail
        });

    if (existingUser) {
        throw new ApiError(
            409,
            "Email already exists"
        );
    }


    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );


    // ========================================
    // CREATE USER
    // ========================================

    let user;

    try {

        user = await User.create({

            fullName:
                normalizedFullName,

            email:
                normalizedEmail,

            password:
                hashedPassword,

            role:
                userRole,

            phone,

            profilePhoto,

            headline,

            skills,

            education,

            resumeUrl,

            location:
                normalizedLocation,

        });

    } catch (error) {

        // MongoDB duplicate key error
        if (error.code === 11000) {

            throw new ApiError(
                409,
                "Email already exists"
            );
        }

        throw error;
    }


    // ========================================
    // FIND ADMINS
    // ========================================

    const admins =
        await User.find({
            role: "admin",
        }).select("_id");


    // ========================================
    // CREATE ADMIN NOTIFICATIONS
    // ========================================

    if (admins.length > 0) {

        const notifications =
            admins.map((admin) => ({

                recipient:
                    admin._id,

                sender:
                    user._id,

                title:
                    "New User Registered",

                message:
                    `${user.fullName} registered as a ${user.role}.`,

                type:
                    "SYSTEM",

            }));


        await Notification.insertMany(
            notifications
        );
    }


    // ========================================
    // REMOVE PASSWORD
    // ========================================

    user.password = undefined;


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({

        success: true,

        message:
            "User registered successfully",

        user,

    });

});


// ========================================
// LOGIN
// ========================================

export const login = asyncHandler(async (req, res) => {

    const {
        email,
        password
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (
        !email?.trim() ||
        !password
    ) {
        throw new ApiError(
            400,
            "Email and password are required"
        );
    }


    // ========================================
    // NORMALIZE EMAIL
    // ========================================

    const normalizedEmail =
        email.trim().toLowerCase();


    // ========================================
    // FIND USER
    // ========================================

    const user =
        await User.findOne({
            email: normalizedEmail
        }).select(
            "_id fullName email role password accountStatus"
        );


    if (!user) {

        throw new ApiError(
            401,
            "Invalid credentials"
        );

    }


    // ========================================
    // VERIFY PASSWORD
    // ========================================

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );


    if (!isMatch) {

        throw new ApiError(
            401,
            "Invalid credentials"
        );

    }


    // ========================================
    // CHECK ACCOUNT STATUS
    // ========================================

    if (user.accountStatus === "suspended") {

        throw new ApiError(
            403,
            "Your account has been suspended"
        );

    }


    if (user.accountStatus === "deleted") {

        throw new ApiError(
            403,
            "Your account is no longer active"
        );

    }


    // ========================================
    // JWT SECRET VALIDATION
    // ========================================

    if (!process.env.JWT_SECRET) {

        throw new ApiError(
            500,
            "JWT secret is not configured"
        );

    }


    // ========================================
    // GENERATE JWT
    // ========================================

    const token =
        jwt.sign(

            {
                userId: user._id,
                role: user.role,
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d",
            }

        );


    // ========================================
    // SET AUTH COOKIE
    // ========================================

    res.cookie(
        "token",
        token,
        {

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "lax",

            maxAge:
                7 * 24 * 60 * 60 * 1000,

        }
    );


    // ========================================
    // REMOVE PASSWORD
    // ========================================

    user.password = undefined;


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({

        success: true,

        message:
            "Login successful",

        user,

    });

});


// ========================================
// LOGOUT
// ========================================

export const logout = asyncHandler(async (req, res) => {

    res.clearCookie(
        "token",
        {

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "lax",

        }
    );


    return res.status(200).json({

        success: true,

        message:
            "Logout successful",

    });

});


// ========================================
// GET CURRENT USER
// ========================================

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user =
        await User.findById(
            req.user.userId
        ).select(
            "_id fullName email role accountStatus"
        );


    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );

    }


    return res.status(200).json({

        success: true,

        user,

    });

});
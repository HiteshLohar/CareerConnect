import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import isValidObjectId from "../utils/validateObjectId.js";


// ========================================
// GET MY PROFILE
// ========================================

export const getMyProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.userId)
        .select("-password");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user
    });
});


// ========================================
// UPDATE PROFILE
// ========================================

export const updateProfile = asyncHandler(async (req, res) => {

    const {
        fullName,
        phone,
        headline,
        location,
        skills,
        education,
        experience
    } = req.body;


    // =========================
    // FIND USER
    // =========================

    const userData = await User.findById(
        req.user.userId
    );

    if (!userData) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // =========================
    // BUILD UPDATE DATA
    // =========================

    const updateData = {};


    if (fullName !== undefined) {
        updateData.fullName =
            fullName.trim();
    }


    if (phone !== undefined) {
        updateData.phone =
            phone.trim();
    }


    if (headline !== undefined) {
        updateData.headline =
            headline.trim();
    }


    if (location !== undefined) {
        updateData.location =
            location.trim();
    }


    // =========================
    // SKILLS
    // =========================

    if (skills !== undefined) {

        try {

            updateData.skills =
                typeof skills === "string"
                    ? JSON.parse(skills)
                    : skills;

        } catch {

            throw new ApiError(
                400,
                "Invalid skills format"
            );
        }
    }


    // =========================
    // EDUCATION
    // =========================

    if (education !== undefined) {

        try {

            updateData.education =
                typeof education === "string"
                    ? JSON.parse(education)
                    : education;

        } catch {

            throw new ApiError(
                400,
                "Invalid education format"
            );
        }
    }


    // =========================
    // EXPERIENCE
    // =========================

    if (experience !== undefined) {

        try {

            updateData.experience =
                typeof experience === "string"
                    ? JSON.parse(experience)
                    : experience;

        } catch {

            throw new ApiError(
                400,
                "Invalid experience format"
            );
        }
    }


    // =========================
    // PROFILE PHOTO
    // =========================

    if (req.files?.profilePhoto) {

        if (userData.profilePhoto) {

            await deleteFromCloudinary(
                userData.profilePhoto
            );
        }

        updateData.profilePhoto =
            req.files.profilePhoto[0].path;
    }


    // =========================
    // RESUME
    // =========================

    if (req.files?.resume) {

        if (userData.resumeUrl) {

            await deleteFromCloudinary(
                userData.resumeUrl
            );
        }

        updateData.resumeUrl =
            req.files.resume[0].path;
    }


    // =========================
    // CHECK UPDATE DATA
    // =========================

    if (
        Object.keys(updateData).length === 0
    ) {

        throw new ApiError(
            400,
            "No fields provided for update"
        );
    }


    // =========================
    // UPDATE USER
    // =========================

    const user = await User.findByIdAndUpdate(
        req.user.userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");


    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
});


// ========================================
// UPDATE PASSWORD
// ========================================

export const updatePassword = asyncHandler(
    async (req, res) => {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        // =========================
        // REQUIRED FIELDS
        // =========================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            throw new ApiError(
                400,
                "All fields are required"
            );
        }


        // =========================
        // FIND USER
        // =========================

        const user = await User.findById(
            req.user.userId
        );

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }


        // =========================
        // VERIFY CURRENT PASSWORD
        // =========================

        const isPasswordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isPasswordMatch) {

            throw new ApiError(
                400,
                "Current password is incorrect"
            );
        }


        // =========================
        // CONFIRM NEW PASSWORD
        // =========================

        if (
            newPassword !==
            confirmPassword
        ) {

            throw new ApiError(
                400,
                "New password and confirm password do not match"
            );
        }


        // =========================
        // SAME PASSWORD CHECK
        // =========================

        if (
            currentPassword ===
            newPassword
        ) {

            throw new ApiError(
                400,
                "New password cannot be same as current password"
            );
        }


        // =========================
        // HASH PASSWORD
        // =========================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );

        user.password =
            hashedPassword;

        await user.save();


        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
);


// ========================================
// FORGOT PASSWORD
// ========================================

export const forgetPassword = asyncHandler(
    async (req, res) => {

        const { email } = req.body;

        if (!email?.trim()) {

            throw new ApiError(
                400,
                "Email is required"
            );
        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // =========================
        // FIND USER
        // =========================

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );
        }


        // =========================
        // GENERATE OTP
        // =========================

        const otp =
            crypto
                .randomInt(
                    100000,
                    1000000
                )
                .toString();


        user.resetOTP = otp;

        user.resetOTPExpires =
            Date.now() +
            10 * 60 * 1000;


        await user.save();


        // =========================
        // SEND EMAIL
        // =========================

        await sendEmail({

            to: user.email,

            subject:
                "CareerConnect Password Reset OTP",

            text:
                `Your OTP is ${otp}. It will expire in 10 minutes.`

        });


        return res.status(200).json({

            success: true,

            message:
                "OTP sent successfully"

        });
    }
);


// ========================================
// VERIFY OTP
// ========================================

export const verifyOTP = asyncHandler(
    async (req, res) => {

        const {
            email,
            otp
        } = req.body;


        if (
            !email?.trim() ||
            !otp
        ) {

            throw new ApiError(
                400,
                "Email and OTP are required"
            );
        }


        const user =
            await User.findOne({
                email:
                    email.trim().toLowerCase()
            });


        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );
        }


        // =========================
        // CHECK OTP EXISTS
        // =========================

        if (
            !user.resetOTP ||
            !user.resetOTPExpires
        ) {

            throw new ApiError(
                400,
                "No OTP found. Please request a new OTP."
            );
        }


        // =========================
        // CHECK OTP
        // =========================

        if (
            user.resetOTP !==
            otp.toString()
        ) {

            throw new ApiError(
                400,
                "Invalid OTP"
            );
        }


        // =========================
        // CHECK EXPIRY
        // =========================

        if (
            user.resetOTPExpires <
            Date.now()
        ) {

            throw new ApiError(
                400,
                "OTP has expired"
            );
        }


        return res.status(200).json({

            success: true,

            message:
                "OTP verified successfully"

        });
    }
);


// ========================================
// RESET PASSWORD
// ========================================

export const resetPassword = asyncHandler(
    async (req, res) => {

        const {
            email,
            otp,
            newPassword
        } = req.body;


        if (
            !email?.trim() ||
            !otp ||
            !newPassword
        ) {

            throw new ApiError(
                400,
                "Email, OTP and new password are required"
            );
        }


        const user =
            await User.findOne({
                email:
                    email.trim().toLowerCase()
            });


        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );
        }


        // =========================
        // CHECK OTP
        // =========================

        if (
            !user.resetOTP ||
            !user.resetOTPExpires
        ) {

            throw new ApiError(
                400,
                "No OTP found. Please request a new OTP."
            );
        }


        if (
            user.resetOTP !==
            otp.toString()
        ) {

            throw new ApiError(
                400,
                "Invalid OTP"
            );
        }


        // =========================
        // CHECK OTP EXPIRY
        // =========================

        if (
            user.resetOTPExpires <
            Date.now()
        ) {

            throw new ApiError(
                400,
                "OTP has expired"
            );
        }


        // =========================
        // HASH NEW PASSWORD
        // =========================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );


        user.password =
            hashedPassword;


        // =========================
        // CLEAR OTP
        // =========================

        user.resetOTP = undefined;

        user.resetOTPExpires =
            undefined;


        await user.save();


        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully"

        });
    }
);


// ========================================
// GET ALL USERS - ADMIN
// ========================================

export const getAllUsers = asyncHandler(
    async (req, res) => {

        const {
            search = "",
            role = ""
        } = req.query;


        // =========================
        // BASE FILTER
        // =========================

        const filter = {
            role: {
                $ne: "admin"
            }
        };


        // =========================
        // ROLE FILTER
        // =========================

        if (
            role === "student" ||
            role === "recruiter"
        ) {

            filter.role = role;
        }


        // =========================
        // SEARCH FILTER
        // =========================

        if (search.trim()) {

            const searchValue =
                search.trim();

            filter.$or = [

                {
                    fullName: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: searchValue,
                        $options: "i"
                    }
                }

            ];
        }


        // =========================
        // FETCH USERS
        // =========================

        const users =
            await User.find(filter)
                .select("-password")
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({

            success: true,

            message:
                "Users fetched successfully",

            count:
                users.length,

            users

        });
    }
);


// ========================================
// UPDATE USER STATUS - ADMIN
// ========================================

export const updateUserStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { accountStatus } =
        req.body;


    // =========================
    // VALIDATE USER ID
    // =========================

    if (!isValidObjectId(id)) {

        throw new ApiError(
            400,
            "Invalid User ID"
        );
    }


    // =========================
    // VALIDATE STATUS
    // =========================

    if (
        ![
            "active",
            "suspended",
            "deleted"
        ].includes(accountStatus)
    ) {

        throw new ApiError(
            400,
            "Invalid account status"
        );
    }


    // =========================
    // FIND USER
    // =========================

    const user =
        await User.findById(id);

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }


    // =========================
    // ADMIN PROTECTION
    // =========================

    if (
        user.role === "admin"
    ) {

        throw new ApiError(
            403,
            "Admin account cannot be modified"
        );
    }


    // =========================
    // UPDATE STATUS
    // =========================

    user.accountStatus =
        accountStatus;

    await user.save();


    return res.status(200).json({

        success: true,

        message:
            `User account ${accountStatus} successfully`,

        user: {

            _id: user._id,

            fullName:
                user.fullName,

            email:
                user.email,

            role:
                user.role,

            accountStatus:
                user.accountStatus

        }

    });
});
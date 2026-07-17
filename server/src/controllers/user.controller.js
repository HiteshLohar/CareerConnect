import User from '../models/User.js';
import bcrypt from "bcrypt";
import { deleteFromCloudinary } from '../utils/cloudinary.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from "crypto";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


export const getMyProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.userId)
        .select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user
    });
});

export const updateProfile = asyncHandler(async (req, res) => {

    const { fullName, phone, headline, location, skills, education } = req.body;


    const updateData = {};

    if (fullName != undefined) {
        updateData.fullName = fullName;
    }
    if (phone != undefined) {
        updateData.phone = phone;
    }
    if (headline != undefined) {
        updateData.headline = headline;
    }
    if (location != undefined) {
        updateData.location = location;
    }
    if (skills != undefined) {
        updateData.skills = skills;
    }
    if (education != undefined) {
        updateData.education = education;
    }

    const userData = await User.findById(req.user.userId);

    if (req.files?.profilePhoto) {
        if (userData.profilePhoto) {
            await deleteFromCloudinary(userData.profilePhoto);
        }

        updateData.profilePhoto = req.files.profilePhoto[0].path;
    }

    if (req.files?.resume) {
        if (userData.resumeUrl) {
            await deleteFromCloudinary(userData.resumeUrl);
        }

        updateData.resumeUrl = req.files.resume[0].path;
    }

    const user = await User.findByIdAndUpdate(
        req.user.userId,
        updateData,
        {
            returnDocument: "after",
            runValidators: true
        }

    ).select("-password");

    return res.status(200).json({
        success: true,
        message: "Profile update successfully",
        user
    });


});

export const updatePassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New Password and confirm password do not match");
    }

    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

export const forgetPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({
        to: user.email,
        subject: "CareerConnect Password Reset OTP",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    });

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    });
});

export const verifyOTP = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
        throw new ApiError(400, "No otp found. Please request a new OTP.");
    }

    if (user.resetOTP !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.resetOTPExpires < Date.now()) {
        throw new ApiError(400, "OTP has expired");
    }

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
    });

});

export const resetPassword = asyncHandler(async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        throw new ApiError(400, "Email, OTP and new password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
        throw new ApiError(400, "No OTP found. Please request a new OTP.");
    }

    if (user.resetOTP !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.resetOTPExpires < Date.now()) {
        throw new ApiError(400, "OTP has expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
});
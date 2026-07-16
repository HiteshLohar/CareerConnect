import User from '../models/User.js';
import bcrypt from "bcrypt";
import { deleteFromCloudinary } from '../utils/cloudinary.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from "crypto";


export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
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

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password and confirm password do not match"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be same as current password"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
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

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOTP || !user.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "No otp found. Please request a new OTP."
            });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.resetOTPExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOTP || !user.resetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please request a new OTP."
            });
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.resetOTPExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;

        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;

        await user.save();

        return res.status(200).json({
            success : true,
            message : "Password reset successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
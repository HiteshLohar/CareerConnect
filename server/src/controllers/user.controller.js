import User from '../models/User.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';


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
import User from "../models/User.js";
import Job from "../models/Job.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

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
        location
    } = req.body;

    if (!fullName || !email || !password || !location) {
        throw new ApiError(400, "Please fill all required fields");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role,
        phone,
        profilePhoto,
        headline,
        skills,
        education,
        resumeUrl,
        location
    });

    user.password = undefined;

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user
    });
});


export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    user.password = undefined;

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user
    });
});


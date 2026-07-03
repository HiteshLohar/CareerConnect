import User from "../models/User.js";
import Job from "../models/Job.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        console.log(req.body);
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
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already Exists"
            });
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
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


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


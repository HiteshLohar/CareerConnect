import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try{
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

        if(!fullName || !email || !password || !location){
            return res.status(400).json({
                success : false,
                message : "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({email});
        
        if(existingUser){
            res.status(409).json({
                sucess : false,
                message : "Email already Exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password : hashedPassword,
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

        res.status(201).json({
            success : true,
            message : "User registered successfully",
            user
        });
    } catch (error){
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
};
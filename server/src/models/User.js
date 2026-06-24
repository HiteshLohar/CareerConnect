import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "recruiter", "admin"],
        default: "student"
    },
    phone: {
        type: String
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    headline: {
        type: String
    },
    skills: [{
        type: String
    }],
    education: [{
        college: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    }],
    resumeUrl: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    accountStatus: {
        type: String,
        enum: ["active", "suspended", "deleted"],
        default: "active"
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;
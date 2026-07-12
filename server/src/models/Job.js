import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        required: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    skills: {
        type: [String],
        required: true,
    },
    vacancies: {
        type: Number,
        required: true,
        min: 1
    },
    deadline: {
        type: Date,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

export default Job;
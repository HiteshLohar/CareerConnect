import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        const studentId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job Id"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not Found"
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            student: studentId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        const application = await Application.create({
            job: jobId,
            student: studentId
        });

        return res.status(201).json({
            success: true,
            message: "Job applied successfully",
            application
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const { id: jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job Id"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (req.user.userId !== job.postedBy.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applicants for this job"
            });
        }

        const applications = await Application.find({ job: jobId })
            .populate("student", "fullName email headline skills location");

        return res.status(200).json({
            success: true,
            message: "Applicants fetched successfully",
            count: applications.length,
            applications
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.userId;

        const applications = await Application.find({ student: studentId })
            .select("-student")
            .populate({
                path: "job", 
                select: "title company location salary jobType createdAt postedBy",
                populate: {
                    path: "postedBy",
                    select: "fullName email"
                }
            });


        if (applications.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No applications found",
                count: 0,
                applications: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            count: applications.length,
            applications
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}   
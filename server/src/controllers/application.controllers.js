import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";


export const applyJob = asyncHandler(async (req, res) => {
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

        if (!job.isActive) {
            return res.status(400).json({
                success: false,
                message: "This job is no longer active"
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

        const student = await User.findById(studentId);

        const notification = await Notification.create({
            recipient: job.postedBy,
            sender: studentId,
            title: "New Job Application",
            message: `${student.fullName} applied for ${job.title}.`,
            type: "NEW_APPLICATION"
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
});

export const getApplicants = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job Id");
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (req.user.userId !== job.postedBy.toString()) {
        throw new ApiError(403, "You are not authorized to view applicants for this job");
    }

    const applications = await Application.find({ job: jobId })
        .populate("student", "fullName email headline skills location");

    return res.status(200).json({
        success: true,
        message: "Applicants fetched successfully",
        count: applications.length,
        applications
    });
});

export const getMyApplications = asyncHandler(async (req, res) => {
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
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {

    const { id: applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid Application ID");
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (req.user.userId !== application.job.postedBy.toString()) {
        throw new ApiError(403, "You are not authorized to update this application");
    }

    const allowedStatus = ["Pending", "Accepted", "Rejected"];

    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    if (application.status.toLowerCase() === status.toLowerCase()) {
        throw new ApiError(400, "Application already has this status");
    }

    application.status = status;
    await application.save();

    const job = await Job.findById(application.job);

    await Notification.create({
        recipient: application.student,
        sender: req.user.userId,
        title: status === "Accepted" ? "Application Accepted" : "Application Rejected",
        message: status === "Accepted" ? `Congratulations! Your application for ${job.title} has been accepted.` : `Your application for ${job.title} has been rejected.`,
        type: status === "Accepted" ? "APPLICATION_ACCEPTED" : "APPLICATION_REJECTED"
    });

    return res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        application: {
            _id: application._id,
            status: application.status,
            updatedAt: application.updatedAt
        }
    });
});
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { getIO, onlineUsers } from "../../socket.js";

export const applyJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const studentId = req.user.userId;

    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid job ID");
    }

    // =========================
    // FIND JOB
    // =========================

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // =========================
    // CHECK ACTIVE JOB
    // =========================

    if (!job.isActive) {
        throw new ApiError(400, "This job is no longer active");
    }

    // =========================
    // CHECK EXISTING APPLICATION
    // =========================

    const existingApplication = await Application.findOne({
        job: jobId,
        student: studentId,
    });

    if (existingApplication) {
        throw new ApiError(
            409,
            "You have already applied for this job"
        );
    }

    // =========================
    // FIND STUDENT
    // =========================

    const student = await User.findById(studentId);

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // =========================
    // CREATE APPLICATION
    // =========================

    const application = await Application.create({
        job: jobId,
        student: studentId,
    });

    // =========================
    // CREATE NOTIFICATION
    // =========================

    const notification = await Notification.create({
        recipient: job.postedBy,
        sender: studentId,
        title: "New Job Application",
        message: `${student.fullName} applied for ${job.title}.`,
        type: "NEW_APPLICATION",
    });

    // =========================
    // SEND REAL-TIME NOTIFICATION
    // =========================

    const recruiterId = job.postedBy.toString();
    const socketId = onlineUsers.get(recruiterId);

    if (socketId) {
        const socketIO = getIO();

        socketIO
            .to(socketId)
            .emit("new_notification", notification);
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
        success: true,
        message: "Job applied successfully",
        application,
    });
});


export const checkApplicationStatus = asyncHandler(async (req, res) => {
    const studentId = req.user.userId;
    const { id: jobId } = req.params;

    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid job ID");
    }

    // =========================
    // FIND APPLICATION
    // =========================

    const application = await Application.findOne({
        student: studentId,
        job: jobId,
    });

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message: application
            ? "Application found"
            : "Application not found",
        applied: !!application,
    });
});


export const getApplicants = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;

    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid job ID");
    }

    // =========================
    // FIND JOB
    // =========================

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // =========================
    // CHECK RECRUITER AUTHORIZATION
    // =========================

    if (req.user.userId !== job.postedBy.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to view applicants for this job"
        );
    }

    // =========================
    // FIND APPLICATIONS
    // =========================

    const applications = await Application.find({
        job: jobId,
    }).populate(
        "student",
        "fullName email headline skills location resumeUrl"
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message: "Applicants fetched successfully",
        count: applications.length,
        applications,
    });
});


export const getMyApplications = asyncHandler(async (req, res) => {
    const studentId = req.user.userId;

    // =========================
    // FIND APPLICATIONS
    // =========================

    const applications = await Application.find({
        student: studentId,
    })
        .select("-student")
        .populate({
            path: "job",
            select: "title company location salary jobType createdAt postedBy",
            populate: {
                path: "postedBy",
                select: "fullName email",
            },
        });

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message:
            applications.length > 0
                ? "Applications fetched successfully"
                : "No applications found",
        count: applications.length,
        applications,
    });
});


export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id: applicationId } = req.params;
    const { status } = req.body;

    // =========================
    // VALIDATE APPLICATION ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(
            400,
            "Invalid application ID"
        );
    }

    // =========================
    // VALIDATE STATUS
    // =========================

    const allowedStatus = [
        "Pending",
        "Accepted",
        "Rejected",
    ];

    if (!allowedStatus.includes(status)) {
        throw new ApiError(
            400,
            "Invalid application status"
        );
    }

    // =========================
    // FIND APPLICATION
    // =========================

    const application = await Application.findById(applicationId)
        .populate("job");

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    // =========================
    // CHECK RECRUITER AUTHORIZATION
    // =========================

    if (
        req.user.userId !==
        application.job.postedBy.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this application"
        );
    }

    // =========================
    // CHECK CURRENT STATUS
    // =========================

    if (application.status !== "Pending") {
        throw new ApiError(
            409,
            "Application status has already been updated"
        );
    }

    // =========================
    // UPDATE STATUS
    // =========================

    application.status = status;

    await application.save();

    // =========================
    // CREATE NOTIFICATION
    // =========================

    const notification = await Notification.create({
        recipient: application.student,
        sender: req.user.userId,
        title:
            status === "Accepted"
                ? "Application Accepted"
                : "Application Rejected",
        message:
            status === "Accepted"
                ? `Congratulations! Your application for ${application.job.title} has been accepted.`
                : `Your application for ${application.job.title} has been rejected.`,
        type:
            status === "Accepted"
                ? "APPLICATION_ACCEPTED"
                : "APPLICATION_REJECTED",
    });

    // =========================
    // SEND REAL-TIME NOTIFICATION
    // =========================

    const studentId = application.student.toString();
    const socketId = onlineUsers.get(studentId);

    if (socketId) {
        const socketIO = getIO();

        socketIO
            .to(socketId)
            .emit("new_notification", notification);
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        application: {
            _id: application._id,
            status: application.status,
            updatedAt: application.updatedAt,
        },
    });
});


export const getAdminApplications = asyncHandler(async (req, res) => {
    // =========================
    // FIND APPLICATIONS
    // =========================

    const applications = await Application.find()
        .populate(
            "student",
            "fullName email headline skills location resumeUrl"
        )
        .populate({
            path: "job",
            select: "title company location salary jobType postedBy",
            populate: [
                {
                    path: "company",
                    select: "name logo location",
                },
                {
                    path: "postedBy",
                    select: "fullName email",
                },
            ],
        })
        .sort({ createdAt: -1 });

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message:
            applications.length > 0
                ? "Admin applications fetched successfully"
                : "No applications found",
        count: applications.length,
        applications,
    });
});
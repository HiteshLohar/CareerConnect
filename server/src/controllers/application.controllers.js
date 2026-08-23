import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { getIO, onlineUsers } from "../../socket.js";

export const applyJob = asyncHandler(async (req, res) => {

    console.log("🔥 APPLY JOB CONTROLLER HIT");
    console.log("🔥 Job ID:", req.params.id);
    console.log("🔥 Student ID:", req.user.userId);

    const { id: jobId } = req.params;

    const studentId = req.user.userId;


    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(jobId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid Job Id"
        });

    }


    // =========================
    // FIND JOB
    // =========================

    const job = await Job.findById(jobId);

    if (!job) {

        return res.status(404).json({
            success: false,
            message: "Job not Found"
        });

    }


    // =========================
    // CHECK ACTIVE JOB
    // =========================

    if (!job.isActive) {

        return res.status(400).json({
            success: false,
            message: "This job is no longer active"
        });

    }


    // =========================
    // CHECK EXISTING APPLICATION
    // =========================

    const existingApplication =
        await Application.findOne({
            job: jobId,
            student: studentId
        });

    if (existingApplication) {

        return res.status(400).json({
            success: false,
            message: "You have already applied for this job"
        });

    }


    // =========================
    // CREATE APPLICATION
    // =========================

    const application =
        await Application.create({
            job: jobId,
            student: studentId
        });

    console.log("🔥 APPLY JOB HIT");
    // =========================
    // FIND STUDENT
    // =========================

    const student =
        await User.findById(studentId);


    // =========================
    // CREATE NOTIFICATION
    // =========================

    const notification =
        await Notification.create({

            recipient: job.postedBy,

            sender: studentId,

            title: "New Job Application",

            message:
                `${student.fullName} applied for ${job.title}.`,

            type: "NEW_APPLICATION"

        });

    console.log("🔥 Notification created:", notification._id);


    // =========================
    // SEND REAL-TIME SOCKET
    // =========================

    const recruiterId =
        job.postedBy.toString();

    const socketId =
        onlineUsers.get(recruiterId);


    console.log("🔥 Recruiter ID:", recruiterId);
    console.log("🔥 Recruiter Socket ID:", socketId);

    if (socketId) {
        const socketIO = getIO();

        socketIO
            .to(socketId)
            .emit(
                "new_notification",
                notification
            );

        console.log(
            "🔔 New application notification sent to recruiter:",
            recruiterId
        );

    } else {

        console.log(
            "ℹ️ Recruiter is offline:",
            recruiterId
        );

    }


    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({

        success: true,

        message: "Job applied successfully",

        application

    });

});

export const checkApplicationStatus = asyncHandler(async (req, res) => {

    const studentId = req.user.userId;
    const jobId = req.params.id;

    const application = await Application.findOne({
        student: studentId,
        job: jobId,
    });


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
        .populate("student", "fullName email headline skills location resumeUrl");

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


    // =========================
    // VALIDATE APPLICATION ID
    // =========================

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {

        throw new ApiError(
            400,
            "Invalid Application ID"
        );

    }


    // =========================
    // VALIDATE STATUS
    // =========================

    const allowedStatus = [
        "Pending",
        "Accepted",
        "Rejected"
    ];

    if (!allowedStatus.includes(status)) {

        throw new ApiError(
            400,
            "Invalid status"
        );

    }


    // =========================
    // FIND APPLICATION
    // =========================

    const application =
        await Application.findById(applicationId)
            .populate("job");

    if (!application) {

        throw new ApiError(
            404,
            "Application not found"
        );

    }


    // =========================
    // CHECK RECRUITER
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
            "Application status has already been updated."
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

    const notification =
        await Notification.create({

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
                    : "APPLICATION_REJECTED"

        });


    // =========================
    // SEND REAL-TIME SOCKET
    // =========================

    const studentId =
        application.student.toString();

    const socketId =
        onlineUsers.get(studentId);


    console.log(
        "🔥 Student ID:",
        studentId
    );

    console.log(
        "🔥 Student Socket ID:",
        socketId
    );


    if (socketId) {

        const socketIO = getIO();

        socketIO
            .to(socketId)
            .emit(
                "new_notification",
                notification
            );

        console.log(
            "🔔 Application status notification sent to student:",
            studentId
        );

    } else {

        console.log(
            "ℹ️ Student is offline:",
            studentId
        );

    }


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            "Application status updated successfully",

        application: {

            _id: application._id,

            status: application.status,

            updatedAt: application.updatedAt

        }

    });

});

export const getAdminApplications = asyncHandler(async (req, res) => {

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
                    select: "name logo location"
                },
                {
                    path: "postedBy",
                    select: "fullName email"
                }
            ]
        })
        .sort({ createdAt: -1 });


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
        message: "Admin applications fetched successfully",
        count: applications.length,
        applications
    });

});
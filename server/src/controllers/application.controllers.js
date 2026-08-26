import mongoose from "mongoose";

import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

import { notifyUser } from "../utils/notificationHelper.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";


// ========================================
// APPLY JOB
// ========================================

export const applyJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const studentId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (!job.isActive) {
        throw new ApiError(
            400,
            "This job is no longer active"
        );
    }

    if (new Date() > new Date(job.deadline)) {
        throw new ApiError(
            400,
            "Application deadline has passed"
        );
    }

    const existingApplication =
        await Application.findOne({
            job: jobId,
            student: studentId
        });

    if (existingApplication) {
        throw new ApiError(
            409,
            "You have already applied for this job"
        );
    }

    const student = await User.findById(studentId);

    if (!student) {
        throw new ApiError(
            404,
            "Student not found"
        );
    }

    const application = await Application.create({
        job: jobId,
        student: studentId
    });

    await notifyUser({
        recipient: job.postedBy,
        sender: studentId,
        title: "New Job Application",
        message:
            `${student.fullName} applied for ${job.title}.`,
        type: "NEW_APPLICATION"
    });

    return res.status(201).json({
        success: true,
        message: "Job applied successfully",
        application
    });
});


// ========================================
// CHECK APPLICATION STATUS
// ========================================

export const checkApplicationStatus = asyncHandler(
    async (req, res) => {

        const studentId = req.user.userId;
        const { id: jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            throw new ApiError(
                400,
                "Invalid Job ID"
            );
        }

        const application =
            await Application.findOne({
                student: studentId,
                job: jobId
            });

        return res.status(200).json({
            success: true,
            message: application
                ? "Application found"
                : "Application not found",
            applied: !!application
        });
    }
);


// ========================================
// GET APPLICANTS
// ========================================

export const getApplicants = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (req.user.userId !== job.postedBy.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to view applicants for this job"
        );
    }

    const applications =
        await Application.find({
            job: jobId
        }).populate(
            "student",
            "fullName email headline skills location resumeUrl"
        );

    return res.status(200).json({
        success: true,
        message: "Applicants fetched successfully",
        count: applications.length,
        applications
    });
});


// ========================================
// GET MY APPLICATIONS
// ========================================

export const getMyApplications = asyncHandler(
    async (req, res) => {

        const studentId = req.user.userId;

        const applications =
            await Application.find({
                student: studentId
            })
                .select("-student")
                .populate({
                    path: "job",
                    select:
                        "title company location salary jobType createdAt postedBy",
                    populate: {
                        path: "postedBy",
                        select: "fullName email"
                    }
                });

        return res.status(200).json({
            success: true,
            message: applications.length
                ? "Applications fetched successfully"
                : "No applications found",
            count: applications.length,
            applications
        });
    }
);


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

export const updateApplicationStatus =
    asyncHandler(async (req, res) => {

        const { id: applicationId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            throw new ApiError(
                400,
                "Invalid Application ID"
            );
        }

        if (!["Accepted", "Rejected"].includes(status)) {
            throw new ApiError(
                400,
                "Invalid application status"
            );
        }

        const application =
            await Application.findById(applicationId)
                .populate("job");

        if (!application) {
            throw new ApiError(
                404,
                "Application not found"
            );
        }

        if (
            req.user.userId !==
            application.job.postedBy.toString()
        ) {
            throw new ApiError(
                403,
                "You are not authorized to update this application"
            );
        }

        if (application.status !== "Pending") {
            throw new ApiError(
                409,
                "Application status has already been updated"
            );
        }

        application.status = status;

        await application.save();

        await notifyUser({
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


// ========================================
// GET ADMIN APPLICATIONS
// ========================================

export const getAdminApplications =
    asyncHandler(async (req, res) => {

        const applications =
            await Application.find()
                .populate(
                    "student",
                    "fullName email headline skills location resumeUrl"
                )
                .populate({
                    path: "job",
                    select:
                        "title company location salary jobType postedBy",
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
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            message: applications.length
                ? "Admin applications fetched successfully"
                : "No applications found",
            count: applications.length,
            applications
        });
    });
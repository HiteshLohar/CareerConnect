import mongoose from "mongoose";
import Company from "../models/Company.js"
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { populate } from "dotenv";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';


export const getRecruiterDashboard = asyncHandler(async (req, res) => {

    const jobs = await Job.find({ postedBy: req.user.userId })
        .select("_id");

    const jobIds = jobs.map(job => job._id);

    const [
        totalCompanies,
        totalJobs,
        activeJobs,
        inactiveJobs,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentJobs,
        recentApplications
    ] = await Promise.all([
        Company.countDocuments({ owner: req.user.userId }),

        Job.countDocuments({ postedBy: req.user.userId }),

        Job.countDocuments({ postedBy: req.user.userId, isActive: true }),

        Job.countDocuments({ postedBy: req.user.userId, isActive: false }),

        Application.countDocuments({ job: { $in: jobIds } }),
        Application.countDocuments({ job: { $in: jobIds }, status: "Pending" }),

        Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" }),

        Application.countDocuments({ job: { $in: jobIds }, status: "Rejected" }),

        Job.find({ postedBy: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title location salary jobType isActive createdAt"),

        Application.find({ job: { $in: jobIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("student", "fullName email")
            .populate({
                path: "job",
                select: "title company",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
    ]);

    return res.status(200).json({
        success: true,
        message: "Recruiter dashboard fetched successfully",
        dashboard: {
            totalCompanies,
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            recentJobs,
            recentApplications
        }
    });
});


export const getStudentDashboard = asyncHandler(async (req, res) => {

    const [
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentApplications
    ] = await Promise.all([

        Application.countDocuments({
            student: req.user.userId
        }),

        Application.countDocuments({
            student: req.user.userId,
            status: "Pending"
        }),

        Application.countDocuments({
            student: req.user.userId,
            status: "Accepted"
        }),

        Application.countDocuments({
            student: req.user.userId,
            status: "Rejected"
        }),

        Application.find({
            student: req.user.userId
        })
            .select("-student")
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "job",
                select: "title company location salary jobType",
                populate: {
                    path: "company",
                    select: "name logo location"
                }
            })
    ]);

    return res.status(200).json({
        success: true,
        message: "Student dashboard fetched successfully",
        dashboard: {
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            recentApplications
        }
    });
});

export const getRecruiterAnalytics = asyncHandler(async (req, res) => {

    const recruiterId = new mongoose.Types.ObjectId(req.user.userId);

    const applicationStatus = await Application.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $match: {
                "job.postedBy": recruiterId
            }
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);
    const statusSummary = { pending: 0, accepted: 0, rejected: 0 };
    applicationStatus.forEach(status => {
        switch (status._id) {
            case "Pending":
                statusSummary.pending = status.count;
                break;

            case "Accepted":
                statusSummary.accepted = status.count;
                break;

            case "Rejected":
                statusSummary.rejected = status.count;
                break;
        }
    });
    const totalApplications = statusSummary.pending + statusSummary.accepted + statusSummary.rejected;

    const acceptanceRate = totalApplications === 0 ? 0 : Number(
        ((statusSummary.accepted / totalApplications) * 100).toFixed(2)
    );

    const rejectionRate = totalApplications === 0 ? 0 : Number(
        ((statusSummary.rejected / totalApplications) * 100).toFixed(2)
    );


    const topJobs = await Application.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $match: {
                "job.postedBy": recruiterId
            }
        },
        {
            $group: {
                _id: "$job._id",
                title: {
                    $first: "$job.title"
                },
                applications: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                applications: -1
            }
        },
        {
            $limit: 5
        }
    ]);

    const monthlyApplications = await Application.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $match: {
                "job.postedBy": recruiterId
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                applications: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                applications: 1
            }
        }
    ]);

    const monthlyJobs = await Job.aggregate([
        {
            $match: {
                postedBy: recruiterId
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                jobs: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                jobs: 1
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        applicationStatus: statusSummary,
        acceptanceRate,
        rejectionRate,
        topJobs,
        monthlyApplications,
        monthlyJobs
    });
});
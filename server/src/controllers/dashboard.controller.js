import mongoose from "mongoose";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";


export const getRecruiterDashboard = asyncHandler(async (req, res) => {
    const recruiterId = req.user.userId;

    // =========================
    // FIND RECRUITER JOBS
    // =========================

    const jobs = await Job.find({
        postedBy: recruiterId,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // =========================
    // FETCH DASHBOARD DATA
    // =========================

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
        recentApplications,
    ] = await Promise.all([
        Company.countDocuments({
            owner: recruiterId,
        }),

        Job.countDocuments({
            postedBy: recruiterId,
        }),

        Job.countDocuments({
            postedBy: recruiterId,
            isActive: true,
        }),

        Job.countDocuments({
            postedBy: recruiterId,
            isActive: false,
        }),

        Application.countDocuments({
            job: { $in: jobIds },
        }),

        Application.countDocuments({
            job: { $in: jobIds },
            status: "Pending",
        }),

        Application.countDocuments({
            job: { $in: jobIds },
            status: "Accepted",
        }),

        Application.countDocuments({
            job: { $in: jobIds },
            status: "Rejected",
        }),

        Job.find({
            postedBy: recruiterId,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "title location salary jobType isActive createdAt"
            ),

        Application.find({
            job: { $in: jobIds },
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("student", "fullName email")
            .populate({
                path: "job",
                select: "title company",
                populate: {
                    path: "company",
                    select: "name logo",
                },
            }),
    ]);

    // =========================
    // RESPONSE
    // =========================

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
            recentApplications,
        },
    });
});


export const getStudentDashboard = asyncHandler(async (req, res) => {
    const studentId = req.user.userId;

    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const [
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentApplications,
    ] = await Promise.all([
        Application.countDocuments({
            student: studentId,
        }),

        Application.countDocuments({
            student: studentId,
            status: "Pending",
        }),

        Application.countDocuments({
            student: studentId,
            status: "Accepted",
        }),

        Application.countDocuments({
            student: studentId,
            status: "Rejected",
        }),

        Application.find({
            student: studentId,
        })
            .select("-student")
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "job",
                select: "title company location salary jobType",
                populate: {
                    path: "company",
                    select: "name logo location",
                },
            }),
    ]);

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message: "Student dashboard fetched successfully",
        dashboard: {
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            recentApplications,
        },
    });
});


export const getRecruiterAnalytics = asyncHandler(async (req, res) => {
    const recruiterId = new mongoose.Types.ObjectId(
        req.user.userId
    );

    // =========================
    // APPLICATION STATUS
    // =========================

    const applicationStatus = await Application.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job",
            },
        },
        {
            $unwind: "$job",
        },
        {
            $match: {
                "job.postedBy": recruiterId,
            },
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1,
                },
            },
        },
    ]);

    const statusSummary = {
        pending: 0,
        accepted: 0,
        rejected: 0,
    };

    applicationStatus.forEach(({ _id, count }) => {
        if (_id === "Pending") {
            statusSummary.pending = count;
        } else if (_id === "Accepted") {
            statusSummary.accepted = count;
        } else if (_id === "Rejected") {
            statusSummary.rejected = count;
        }
    });

    const totalApplications =
        statusSummary.pending +
        statusSummary.accepted +
        statusSummary.rejected;

    const acceptanceRate =
        totalApplications === 0
            ? 0
            : Number(
                  (
                      (statusSummary.accepted /
                          totalApplications) *
                      100
                  ).toFixed(2)
              );

    const rejectionRate =
        totalApplications === 0
            ? 0
            : Number(
                  (
                      (statusSummary.rejected /
                          totalApplications) *
                      100
                  ).toFixed(2)
              );

    // =========================
    // TOP JOBS
    // =========================

    const topJobs = await Application.aggregate([
        {
            $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job",
            },
        },
        {
            $unwind: "$job",
        },
        {
            $match: {
                "job.postedBy": recruiterId,
            },
        },
        {
            $group: {
                _id: "$job._id",
                title: {
                    $first: "$job.title",
                },
                applications: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                applications: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);

    // =========================
    // MONTHLY APPLICATIONS
    // =========================

    const monthlyApplications =
        await Application.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job",
                },
            },
            {
                $unwind: "$job",
            },
            {
                $match: {
                    "job.postedBy": recruiterId,
                },
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt",
                        },
                        month: {
                            $month: "$createdAt",
                        },
                    },
                    applications: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    applications: 1,
                },
            },
        ]);

    // =========================
    // MONTHLY JOBS
    // =========================

    const monthlyJobs = await Job.aggregate([
        {
            $match: {
                postedBy: recruiterId,
            },
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt",
                    },
                    month: {
                        $month: "$createdAt",
                    },
                },
                jobs: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                jobs: 1,
            },
        },
    ]);

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        applicationStatus: statusSummary,
        acceptanceRate,
        rejectionRate,
        topJobs,
        monthlyApplications,
        monthlyJobs,
    });
});


export const getAdminDashboard = asyncHandler(async (req, res) => {
    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const [
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        activeJobs,
        inactiveJobs,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        recentUsers,
        recentJobs,
    ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
            role: "student",
        }),

        User.countDocuments({
            role: "recruiter",
        }),

        Company.countDocuments(),

        Job.countDocuments(),

        Job.countDocuments({
            isActive: true,
        }),

        Job.countDocuments({
            isActive: false,
        }),

        Application.countDocuments(),

        Application.countDocuments({
            status: "Pending",
        }),

        Application.countDocuments({
            status: "Accepted",
        }),

        Application.countDocuments({
            status: "Rejected",
        }),

        User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "fullName email role accountStatus createdAt"
            ),

        Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "title location salary jobType isActive createdAt"
            )
            .populate("company", "name logo"),
    ]);

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
        success: true,
        message: "Admin dashboard fetched successfully",
        dashboard: {
            totalUsers,
            totalStudents,
            totalRecruiters,
            totalCompanies,
            totalJobs,
            activeJobs,
            inactiveJobs,
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            recentUsers,
            recentJobs,
        },
    });
});
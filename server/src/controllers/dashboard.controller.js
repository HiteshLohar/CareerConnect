import Company from "../models/Company.js"
import Application from "../models/Application.js"
import Job from "../models/Job.js";
import { populate } from "dotenv";


export const getRecruiterDashboard = async (req, res) => {
    try {

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
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}


export const getStudentDashboard = async (req, res) => {
    try {

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

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
import Company from "../models/Company.js"
import Application from "../models/Application.js"
import Job from "../models/Job.js";


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
            rejectedApplications
        ] = await Promise.all([
            Company.countDocuments({ owner: req.user.userId }),
            Job.countDocuments({ postedBy: req.user.userId }),
            Job.countDocuments({ postedBy: req.user.userId, isActive: true }),
            Job.countDocuments({ postedBy: req.user.userId, isActive: false }),
            Application.countDocuments({ job: { $in: jobIds } }),
            Application.countDocuments({ job: { $in: jobIds }, status: "Pending" }),
            Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" }),
            Application.countDocuments({ job: { $in: jobIds }, status: "Rejected" })

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
                rejectedApplications
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

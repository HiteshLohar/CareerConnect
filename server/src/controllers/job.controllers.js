import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const { title, company, description, location, salary, jobType, experience, skills, vacancies, deadline } = req.body;
        const postedBy = req.user.userId;

        if (
            !title ||
            !company ||
            !description ||
            !location ||
            salary === undefined ||
            !jobType ||
            experience === undefined ||
            !skills || skills.length === 0 ||
            vacancies === undefined ||
            !deadline
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const job = await Job.create({
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills,
            vacancies,
            deadline,
            postedBy
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllJobs = async (req, res) => {

    try {

        const jobs = await Job.find({ isActive: true })
            .select("title company location salary jobType createdAt")
            .populate("postedBy", "fullName email")
            .sort({ createdAt: -1 })
            .lean();

        if (jobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No jobs available",
                jobs: []
            });
        }

        return res.status(200).json({
            "success": true,
            "message": "Jobs fetched successfully",
            "count": jobs.length,
            jobs
        });
    }
    catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        });
    }
}
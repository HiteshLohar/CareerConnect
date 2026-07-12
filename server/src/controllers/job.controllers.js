import Job from "../models/Job.js";
import Company from "../models/Company.js";
import mongoose from 'mongoose';

export const createJob = async (req, res) => {
    try {
        const { title, company, description, location, salary, jobType, experience, skills, vacancies, deadline } = req.body;
        const postedBy = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(company)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Company ID"
            });
        }

        const companyExists = await Company.findById(company);

        if (!companyExists) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        if (companyExists.owner.toString() !== postedBy) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create jobs for this company"
            });
        }



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
            .populate("company", "name logo location")
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

export const getJobById = async (req, res) => {

    try {
        const { id: jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID"
            });
        }

        const job = await Job.findOne({ _id: jobId, isActive: true })
            .select("title company description location salary jobType experience skills vacancies deadline createdAt")
            .populate("postedBy", "fullName email")
            .populate("company", "name description website location logo");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            "message": "Job fetched successfully",
            job
        });


    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }

}

export const updateJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID"
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
                message: "You are not authorized to update this job"
            });
        }

        const {
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills,
            vacancies,
            deadline
        } = req.body;

        // Validate company if recruiter wants to change it
        if (company !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(company)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Company ID"
                });
            }

            const companyExists = await Company.findById(company);

            if (!companyExists) {
                return res.status(404).json({
                    success: false,
                    message: "Company not found"
                });
            }

            if (companyExists.owner.toString() !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to use this company"
                });
            }
        }

        // Only update fields that are provided
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (company !== undefined) updateData.company = company;
        if (description !== undefined) updateData.description = description;
        if (location !== undefined) updateData.location = location;
        if (salary !== undefined) updateData.salary = salary;
        if (jobType !== undefined) updateData.jobType = jobType;
        if (experience !== undefined) updateData.experience = experience;
        if (skills !== undefined) updateData.skills = skills;
        if (vacancies !== undefined) updateData.vacancies = vacancies;
        if (deadline !== undefined) updateData.deadline = deadline;

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job Id"
            })
        }
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job Not Found"
            });
        }
        if (!(req.user.userId === job.postedBy.toString())) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job"
            });
        }
        await Job.findByIdAndDelete(jobId);
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

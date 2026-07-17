import Job from "../models/Job.js";
import Company from "../models/Company.js";
import mongoose from 'mongoose';
import User from "../models/User.js";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createJob = asyncHandler(async (req, res) => {

    const { title, company, description, location, salary, jobType, experience, skills, vacancies, deadline } = req.body;
    const postedBy = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(company)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    const companyExists = await Company.findById(company);

    if (!companyExists) {
        throw new ApiError(404, "Company not found");
    }

    if (companyExists.owner.toString() !== postedBy) {
        throw new ApiError(403, "You are not authorized to create jobs for this company");
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
        throw new ApiError(400, "Please fill all required fields.");
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
});


export const getAllJobs = asyncHandler(async (req, res) => {

    const { keyword, location, jobType, page = 1, limit = 5, sort, experience, minSalary, maxSalary, company } = req.query;
    const filter = { isActive: true };

    if (keyword) {
        filter.title = {
            $regex: keyword,
            $options: "i"
        }
    }

    if (location) {
        filter.location = {
            $regex: location,
            $options: "i"
        }
    }

    if (jobType) {
        filter.jobType = {
            $regex: jobType,
        }
    }

    if (experience) {
        filter.experience = {
            $gte: Number(experience)
        };
    }

    if (minSalary || maxSalary) {
        filter.salary = {};

        if (minSalary) {
            filter.salary.$gte = Number(minSalary);
        }

        if (maxSalary) {
            filter.salary.$lte = Number(maxSalary);
        }
    }

    if (company) {
        if (!mongoose.Types.ObjectId.isValid(company)) {
            throw new ApiError(400, "Invalid Company ID");
        }
        filter.company = company;
    }

    const sortOption = {};
    if (sort === "latest") {
        sortOption.createdAt = -1;
    } else if (sort === "oldest") {
        sortOption.createdAt = 1;
    } else if (sort === "salary_asc") {
        sortOption.salary = 1;
    } else if (sort === "salary_desc") {
        sortOption.salary = -1;
    } else {
        sortOption.createdAt = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const totalJobs = await Job.countDocuments(filter);

    const totalPages = Math.ceil(totalJobs / Number(limit));


    const jobs = await Job.find(filter)
        .select("title company location salary jobType createdAt")
        .populate("company", "name logo location")
        .populate("postedBy", "fullName email")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean();

    if (jobs.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No jobs found",
            count: 0,
            currantPage: Number(page),
            totalPages,
            totalJobs,
            jobs: []
        });
    }

    return res.status(200).json({
        "success": true,
        "message": "Jobs fetched successfully",
        "count": jobs.length,
        currentPage: Number(page),
        totalPages,
        totalJobs,
        jobs
    });

});

export const getJobById = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const job = await Job.findOne({ _id: jobId, isActive: true })
        .select("title company description location salary jobType experience skills vacancies deadline createdAt")
        .populate("postedBy", "fullName email")
        .populate("company", "name description website location logo");

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json({
        success: true,
        "message": "Job fetched successfully",
        job
    });
});

export const updateJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (req.user.userId !== job.postedBy.toString()) {
        throw new ApiError(403, "You are not authorized to update this job");
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

    if (req.user.userId !== job.postedBy.toString()) {
        throw new ApiError(403, "You are not authorized to update this job");
    }

    // Validate company if recruiter wants to change it
    if (company !== undefined) {

        if (!mongoose.Types.ObjectId.isValid(company)) {
            throw new ApiError(400, "Invalid Company ID");
        }

        const companyExists = await Company.findById(company);

        if (!companyExists) {
            throw new ApiError(404, "Company not found");
        }

        if (companyExists.owner.toString() !== req.user.userId) {
            throw new ApiError(403, "You are not authorized to use this company");
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
});

export const deleteJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job Id");
    }
    const job = await Job.findById(jobId)

    if (!job) {
        throw new ApiError(404, "Job Not Found");
    }
    if (!(req.user.userId === job.postedBy.toString())) {
        throw new ApiError(403, "You are not authorized to delete this job");
    }

    if (!job.isActive) {
        throw new ApiError(400, "Job is already deleted");
    }

    job.isActive = false;
    await job.save();

    return res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });
});

export const saveJob = asyncHandler(async (req, res) => {

    const { id: jobID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobID)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const job = await Job.findById(jobID);

    if (!job) {
        throw new ApiError(404, "Job Not Found");
    }

    const user = await User.findById(req.user.userId);

    const alreadySaved = user.savedJobs.some(
        id => id.toString() === jobID
    );

    if (alreadySaved) {
        throw new ApiError(400, "Job already saved");
    }

    user.savedJobs.push(jobID);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Job saved succesfully",
        savedJob: jobID
    });
});

export const removeSavedJob = asyncHandler(async (req, res) => {

        const { id: jobID } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobID)) {
            throw new ApiError(400, "Invalid Job ID");
        }

        const job = await Job.findById(jobID);

        if (!job) {
            throw new ApiError(404, "Job not found");
        }

        const user = await User.findById(req.user.userId);

        const isSaved = user.savedJobs.some(
            id => id.toString() === jobID
        );

        if (!isSaved) {
            throw new ApiError(400, "Job is not saved");
        }

        user.savedJobs = user.savedJobs.filter(
            id => id.toString() !== jobID
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Saved job removed successfully"
        });
});

export const getSavedJobs = asyncHandler(async (req, res) => {

        const user = await User.findById(req.user.userId)
            .populate({
                path: "savedJobs",
                select: "title company location salary jobType isActive createdAt",
                populate: {
                    path: "company",
                    select: "name logo location"
                }
            });

        return res.status(200).json({
            success: true,
            message: "Saved jobs fetched successfully",
            count: user.savedJobs.length,
            savedJobs: user.savedJobs
        });
});
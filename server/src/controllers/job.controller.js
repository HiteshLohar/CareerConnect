import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

import { notifyAdmins } from "../utils/notificationHelper.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import isValidObjectId from "../utils/validateObjectId.js";


// ========================================
// CREATE JOB
// ========================================

export const createJob = asyncHandler(async (req, res) => {

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


    const recruiterId = req.user.userId;


    // =========================
    // REQUIRED FIELDS
    // =========================

    if (
        !title?.trim() ||
        !company ||
        !description?.trim() ||
        !location?.trim() ||
        salary === undefined ||
        !jobType ||
        experience === undefined ||
        !Array.isArray(skills) ||
        skills.length === 0 ||
        vacancies === undefined ||
        !deadline
    ) {
        throw new ApiError(
            400,
            "Please fill all required fields"
        );
    }


    // =========================
    // VALIDATE COMPANY ID
    // =========================

    if (!isValidObjectId(company)) {
        throw new ApiError(
            400,
            "Invalid Company ID"
        );
    }


    // =========================
    // VALIDATE SALARY
    // =========================

    if (
        Number.isNaN(Number(salary)) ||
        Number(salary) < 0
    ) {
        throw new ApiError(
            400,
            "Invalid salary"
        );
    }


    // =========================
    // VALIDATE EXPERIENCE
    // =========================

    if (
        Number.isNaN(Number(experience)) ||
        Number(experience) < 0
    ) {
        throw new ApiError(
            400,
            "Invalid experience"
        );
    }


    // =========================
    // VALIDATE VACANCIES
    // =========================

    if (
        !Number.isInteger(Number(vacancies)) ||
        Number(vacancies) < 1
    ) {
        throw new ApiError(
            400,
            "Vacancies must be at least 1"
        );
    }


    // =========================
    // VALIDATE DEADLINE
    // =========================

    const deadlineDate =
        new Date(deadline);

    if (
        Number.isNaN(
            deadlineDate.getTime()
        )
    ) {
        throw new ApiError(
            400,
            "Invalid deadline"
        );
    }

    if (
        deadlineDate <= new Date()
    ) {
        throw new ApiError(
            400,
            "Deadline must be a future date"
        );
    }


    // =========================
    // CHECK COMPANY
    // =========================

    const companyExists =
        await Company.findById(company);

    if (!companyExists) {
        throw new ApiError(
            404,
            "Company not found"
        );
    }


    // =========================
    // CHECK COMPANY OWNERSHIP
    // =========================

    if (
        companyExists.owner.toString() !==
        recruiterId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to create jobs for this company"
        );
    }


    // =========================
    // CREATE JOB
    // =========================

    const job = await Job.create({

        title: title.trim(),

        company,

        description:
            description.trim(),

        location:
            location.trim(),

        salary:
            Number(salary),

        jobType,

        experience:
            Number(experience),

        skills,

        vacancies:
            Number(vacancies),

        deadline:
            deadlineDate,

        postedBy:
            recruiterId

    });


    // =========================
    // NOTIFY ADMINS
    // =========================

    await notifyAdmins({

        sender: recruiterId,

        title: "New Job Posted",

        message:
            `A new job "${job.title}" has been posted.`,

        type: "SYSTEM"

    });


    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({

        success: true,

        message:
            "Job created successfully",

        job

    });
});


// ========================================
// GET RECRUITER JOBS
// ========================================

export const getRecruiterJobs = asyncHandler(async (req, res) => {

    const recruiterId =
        req.user.userId;


    // =========================
    // FETCH RECRUITER JOBS
    // =========================

    const jobs =
        await Job.find({
            postedBy: recruiterId
        })
            .populate(
                "company",
                "name logo"
            )
            .sort({
                createdAt: -1
            });


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            jobs.length
                ? "Jobs fetched successfully"
                : "No jobs found",

        count:
            jobs.length,

        jobs

    });
});


// ========================================
// UPDATE JOB
// ========================================

export const updateJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const recruiterId = req.user.userId;


    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }


    // =========================
    // FIND JOB
    // =========================

    const job =
        await Job.findById(jobId);

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }


    // =========================
    // OWNERSHIP CHECK
    // =========================

    if (
        job.postedBy.toString() !==
        recruiterId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this job"
        );
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


    const updateData = {};


    // =========================
    // TITLE
    // =========================

    if (title !== undefined) {

        if (!title?.trim()) {
            throw new ApiError(
                400,
                "Job title cannot be empty"
            );
        }

        updateData.title =
            title.trim();
    }


    // =========================
    // COMPANY
    // =========================

    if (company !== undefined) {

        if (!isValidObjectId(company)) {
            throw new ApiError(
                400,
                "Invalid Company ID"
            );
        }

        const companyExists =
            await Company.findById(company);

        if (!companyExists) {
            throw new ApiError(
                404,
                "Company not found"
            );
        }

        if (
            companyExists.owner.toString() !==
            recruiterId
        ) {
            throw new ApiError(
                403,
                "You are not authorized to use this company"
            );
        }

        updateData.company =
            company;
    }


    // =========================
    // DESCRIPTION
    // =========================

    if (description !== undefined) {

        if (!description?.trim()) {
            throw new ApiError(
                400,
                "Job description cannot be empty"
            );
        }

        updateData.description =
            description.trim();
    }


    // =========================
    // LOCATION
    // =========================

    if (location !== undefined) {

        if (!location?.trim()) {
            throw new ApiError(
                400,
                "Job location cannot be empty"
            );
        }

        updateData.location =
            location.trim();
    }


    // =========================
    // SALARY
    // =========================

    if (salary !== undefined) {

        if (
            Number.isNaN(Number(salary)) ||
            Number(salary) < 0
        ) {
            throw new ApiError(
                400,
                "Invalid salary"
            );
        }

        updateData.salary =
            Number(salary);
    }


    // =========================
    // JOB TYPE
    // =========================

    if (jobType !== undefined) {

        const allowedJobTypes = [
            "Full-time",
            "Part-time",
            "Internship",
            "Contract"
        ];

        if (
            !allowedJobTypes.includes(jobType)
        ) {
            throw new ApiError(
                400,
                "Invalid job type"
            );
        }

        updateData.jobType =
            jobType;
    }


    // =========================
    // EXPERIENCE
    // =========================

    if (experience !== undefined) {

        if (
            Number.isNaN(Number(experience)) ||
            Number(experience) < 0
        ) {
            throw new ApiError(
                400,
                "Invalid experience"
            );
        }

        updateData.experience =
            Number(experience);
    }


    // =========================
    // SKILLS
    // =========================

    if (skills !== undefined) {

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {
            throw new ApiError(
                400,
                "Skills must contain at least one skill"
            );
        }

        updateData.skills =
            skills;
    }


    // =========================
    // VACANCIES
    // =========================

    if (vacancies !== undefined) {

        if (
            !Number.isInteger(
                Number(vacancies)
            ) ||
            Number(vacancies) < 1
        ) {
            throw new ApiError(
                400,
                "Vacancies must be at least 1"
            );
        }

        updateData.vacancies =
            Number(vacancies);
    }


    // =========================
    // DEADLINE
    // =========================

    if (deadline !== undefined) {

        const deadlineDate =
            new Date(deadline);

        if (
            Number.isNaN(
                deadlineDate.getTime()
            )
        ) {
            throw new ApiError(
                400,
                "Invalid deadline"
            );
        }

        if (
            deadlineDate <= new Date()
        ) {
            throw new ApiError(
                400,
                "Deadline must be a future date"
            );
        }

        updateData.deadline =
            deadlineDate;
    }


    // =========================
    // CHECK UPDATE DATA
    // =========================

    if (
        Object.keys(updateData).length === 0
    ) {
        throw new ApiError(
            400,
            "No fields provided for update"
        );
    }


    // =========================
    // UPDATE JOB
    // =========================

    const updatedJob =
        await Job.findByIdAndUpdate(
            jobId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            "Job updated successfully",

        job:
            updatedJob

    });
});


// ========================================
// DELETE JOB
// ========================================

export const deleteJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const recruiterId = req.user.userId;


    // =========================
    // VALIDATE JOB ID
    // =========================

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }


    // =========================
    // FIND JOB
    // =========================

    const job =
        await Job.findById(jobId);

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }


    // =========================
    // OWNERSHIP CHECK
    // =========================

    if (
        job.postedBy.toString() !==
        recruiterId
    ) {
        throw new ApiError(
            403,
            "You are not authorized to delete this job"
        );
    }


    // =========================
    // CHECK ALREADY INACTIVE
    // =========================

    if (!job.isActive) {
        throw new ApiError(
            400,
            "Job is already inactive"
        );
    }


    // =========================
    // SOFT DELETE
    // =========================

    job.isActive = false;

    await job.save();


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            "Job deleted successfully"

    });
});


// ========================================
// GET ALL ACTIVE JOBS
// ========================================

export const getAllJobs = asyncHandler(async (req, res) => {

    const {
        keyword,
        location,
        jobType,
        page = 1,
        limit = 5,
        sort,
        experience,
        minSalary,
        maxSalary,
        company
    } = req.query;


    // =========================
    // PAGINATION
    // =========================

    const currentPage =
        Number(page);

    const pageLimit =
        Number(limit);


    if (
        !Number.isInteger(currentPage) ||
        currentPage < 1
    ) {
        throw new ApiError(
            400,
            "Invalid page number"
        );
    }


    if (
        !Number.isInteger(pageLimit) ||
        pageLimit < 1 ||
        pageLimit > 100
    ) {
        throw new ApiError(
            400,
            "Invalid limit"
        );
    }


    // =========================
    // BASE FILTER
    // =========================

    const filter = {
        isActive: true
    };


    // =========================
    // KEYWORD SEARCH
    // =========================

    if (keyword?.trim()) {

        filter.title = {
            $regex: keyword.trim(),
            $options: "i"
        };
    }


    // =========================
    // LOCATION FILTER
    // =========================

    if (location?.trim()) {

        filter.location = {
            $regex: location.trim(),
            $options: "i"
        };
    }


    // =========================
    // JOB TYPE
    // =========================

    if (jobType) {

        const allowedJobTypes = [
            "Full-time",
            "Part-time",
            "Internship",
            "Contract"
        ];

        if (
            !allowedJobTypes.includes(jobType)
        ) {
            throw new ApiError(
                400,
                "Invalid job type"
            );
        }

        filter.jobType =
            jobType;
    }


    // =========================
    // EXPERIENCE
    // =========================

    if (experience !== undefined) {

        const experienceValue =
            Number(experience);

        if (
            !Number.isFinite(experienceValue) ||
            experienceValue < 0
        ) {
            throw new ApiError(
                400,
                "Invalid experience value"
            );
        }

        filter.experience = {
            $gte: experienceValue
        };
    }


    // =========================
    // SALARY FILTER
    // =========================

    if (
        minSalary !== undefined ||
        maxSalary !== undefined
    ) {

        filter.salary = {};


        if (minSalary !== undefined) {

            const minimumSalary =
                Number(minSalary);

            if (
                !Number.isFinite(
                    minimumSalary
                ) ||
                minimumSalary < 0
            ) {
                throw new ApiError(
                    400,
                    "Invalid minimum salary"
                );
            }

            filter.salary.$gte =
                minimumSalary;
        }


        if (maxSalary !== undefined) {

            const maximumSalary =
                Number(maxSalary);

            if (
                !Number.isFinite(
                    maximumSalary
                ) ||
                maximumSalary < 0
            ) {
                throw new ApiError(
                    400,
                    "Invalid maximum salary"
                );
            }

            filter.salary.$lte =
                maximumSalary;
        }


        if (
            minSalary !== undefined &&
            maxSalary !== undefined &&
            Number(minSalary) >
            Number(maxSalary)
        ) {
            throw new ApiError(
                400,
                "Minimum salary cannot be greater than maximum salary"
            );
        }
    }


    // =========================
    // COMPANY FILTER
    // =========================

    if (company) {

        if (
            !isValidObjectId(company)
        ) {
            throw new ApiError(
                400,
                "Invalid Company ID"
            );
        }

        filter.company =
            company;
    }


    // =========================
    // SORTING
    // =========================

    const sortOption = {
        createdAt: -1
    };


    if (sort === "oldest") {

        sortOption.createdAt = 1;

    } else if (
        sort === "salary_asc"
    ) {

        delete sortOption.createdAt;

        sortOption.salary = 1;

    } else if (
        sort === "salary_desc"
    ) {

        delete sortOption.createdAt;

        sortOption.salary = -1;
    }


    // =========================
    // PAGINATION CALCULATION
    // =========================

    const skip =
        (currentPage - 1) *
        pageLimit;


    // =========================
    // COUNT JOBS
    // =========================

    const totalJobs =
        await Job.countDocuments(
            filter
        );


    const totalPages =
        Math.ceil(
            totalJobs / pageLimit
        );


    // =========================
    // FETCH JOBS
    // =========================

    const jobs =
        await Job.find(filter)
            .select(
                "title company location salary jobType experience vacancies deadline isActive createdAt"
            )
            .populate(
                "company",
                "name logo location"
            )
            .populate(
                "postedBy",
                "fullName email"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(pageLimit)
            .lean();


    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

        success: true,

        message:
            jobs.length
                ? "Jobs fetched successfully"
                : "No jobs found",

        count:
            jobs.length,

        currentPage,

        totalPages,

        totalJobs,

        jobs

    });
});


// ========================================
// GET JOB BY ID
// ========================================

export const getJobById = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const job = await Job.findOne({
        _id: jobId,
        isActive: true
    })
        .select(
            "title company description location salary jobType experience skills vacancies deadline createdAt"
        )
        .populate(
            "postedBy",
            "fullName email"
        )
        .populate(
            "company",
            "name description website location logo"
        );

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    return res.status(200).json({
        success: true,
        message: "Job fetched successfully",
        job
    });
});


// ========================================
// SAVE JOB
// ========================================

export const saveJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const studentId = req.user.userId;

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const user = await User.findById(studentId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const jobExists = await Job.exists({
        _id: jobId,
        isActive: true
    });

    if (!jobExists) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    const alreadySaved =
        user.savedJobs.some(
            id => id.toString() === jobId
        );

    if (alreadySaved) {
        throw new ApiError(
            409,
            "Job already saved"
        );
    }

    user.savedJobs.push(jobId);

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Job saved successfully",
        savedJob: jobId
    });
});


// ========================================
// REMOVE SAVED JOB
// ========================================

export const removeSavedJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const studentId = req.user.userId;

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const user = await User.findById(studentId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const isSaved =
        user.savedJobs.some(
            id => id.toString() === jobId
        );

    if (!isSaved) {
        throw new ApiError(
            409,
            "Job is not saved"
        );
    }

    user.savedJobs =
        user.savedJobs.filter(
            id => id.toString() !== jobId
        );

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Saved job removed successfully"
    });
});


// ========================================
// GET SAVED JOBS
// ========================================

export const getSavedJobs = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.userId)
        .populate({
            path: "savedJobs",
            select:
                "title company location salary jobType isActive createdAt",
            populate: {
                path: "company",
                select: "name logo location"
            }
        });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json({
        success: true,
        message: user.savedJobs.length
            ? "Saved jobs fetched successfully"
            : "No saved jobs found",
        count: user.savedJobs.length,
        savedJobs: user.savedJobs
    });
});


// ========================================
// GET RECRUITER JOB
// ========================================

export const getRecruiterJob = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const recruiterId = req.user.userId;

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    const job = await Job.findById(jobId)
        .populate(
            "company",
            "name logo"
        );

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    if (job.postedBy.toString() !== recruiterId) {
        throw new ApiError(
            403,
            "You are not authorized to view this job"
        );
    }

    return res.status(200).json({
        success: true,
        message: "Job fetched successfully",
        job
    });
});


// ========================================
// GET ADMIN JOBS
// ========================================

export const getAdminJobs = asyncHandler(async (req, res) => {

    const jobs = await Job.find()
        .populate(
            "company",
            "name logo location"
        )
        .populate(
            "postedBy",
            "fullName email"
        )
        .sort({
            createdAt: -1
        });

    return res.status(200).json({
        success: true,
        message: jobs.length
            ? "Jobs fetched successfully"
            : "No jobs found",
        count: jobs.length,
        jobs
    });
});


// ========================================
// UPDATE JOB STATUS
// ========================================

export const updateJobStatus = asyncHandler(async (req, res) => {

    const { id: jobId } = req.params;
    const { isActive } = req.body;

    if (!isValidObjectId(jobId)) {
        throw new ApiError(
            400,
            "Invalid Job ID"
        );
    }

    if (typeof isActive !== "boolean") {
        throw new ApiError(
            400,
            "isActive must be true or false"
        );
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(
            404,
            "Job not found"
        );
    }

    job.isActive = isActive;

    await job.save();

    return res.status(200).json({
        success: true,
        message: isActive
            ? "Job activated successfully"
            : "Job deactivated successfully",
        job
    });
});
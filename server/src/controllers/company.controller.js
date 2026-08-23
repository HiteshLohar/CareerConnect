import Company from "../models/Company.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

import User from "../models/User.js";
import Notification from "../models/Notification.js";

import { getIO, onlineUsers } from "../../socket.js";


export const createCompany = asyncHandler(async (req, res) => {

    const owner = req.user.userId;

    const {
        name,
        description,
        website,
        location
    } = req.body;

    const logo = req.file?.path || "";


    // =========================
    // VALIDATE COMPANY NAME
    // =========================

    if (!name || name.trim() === "") {

        throw new ApiError(
            400,
            "Company name is required"
        );

    }


    // =========================
    // CHECK DUPLICATE COMPANY
    // =========================

    const companyExists = await Company.findOne({

        name: {
            $regex: new RegExp(
                `^${name.trim()}$`,
                "i"
            )
        }

    });

    if (companyExists) {

        throw new ApiError(
            400,
            "Company already exists"
        );

    }


    // =========================
    // CREATE COMPANY
    // =========================

    const company = await Company.create({

        name: name.trim(),

        description:
            description?.trim() || "",

        website:
            website?.trim() || "",

        location:
            location?.trim() || "",

        logo:
            logo?.trim() || "",

        owner

    });


    // =========================
    // FIND ADMINS
    // =========================

    const admins = await User.find({
        role: "admin"
    }).select("_id");


    // =========================
    // CREATE ADMIN NOTIFICATIONS
    // =========================

    if (admins.length > 0) {

        const notifications =
            admins.map((admin) => ({

                recipient: admin._id,

                sender: owner,

                title: "New Company Created",

                message:
                    `A new company "${company.name}" has been created.`,

                type: "SYSTEM"

            }));


        const createdNotifications =
            await Notification.insertMany(
                notifications
            );


        // =========================
        // SEND SOCKET NOTIFICATION
        // =========================

        const socketIO = getIO();


        for (
            const notification
            of createdNotifications
        ) {

            const adminId =
                notification.recipient.toString();

            const socketId =
                onlineUsers.get(adminId);


            console.log(
                "🔥 Admin ID:",
                adminId
            );

            console.log(
                "🔥 Admin Socket ID:",
                socketId
            );


            if (socketId) {

                socketIO
                    .to(socketId)
                    .emit(
                        "new_notification",
                        notification
                    );

                console.log(
                    "🔔 Company notification sent to admin:",
                    adminId
                );

            } else {

                console.log(
                    "ℹ️ Admin is offline:",
                    adminId
                );

            }

        }

    }


    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({

        success: true,

        message:
            "Company created successfully",

        company

    });

});

export const getAllCompanies = asyncHandler(async (req, res) => {

    const userId = req.user.userId;

    const companies = await Company.find({
        owner: userId,
        accountStatus: "active"
    }).sort({ createdAt: -1 });

    if (companies.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No companies found",
            count: 0,
            companies: []
        });
    }

    return res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        count: companies.length,
        companies
    });

});

export const getCompanyById = asyncHandler(async (req, res) => {

    const { id: companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    const company = await Company.findById({ _id: companyId });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    if (req.user.userId !== company.owner.toString()) {
        throw new ApiError(403, "You are not authorized to view this company");
    }

    return res.status(200).json({
        success: true,
        message: "Company fetched successfully",
        company
    });
});

export const updateCompany = asyncHandler(async (req, res) => {

    const userId = req.user.userId;
    const { id: companyId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    if (company.owner.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to update this company");
    }

    const {
        name,
        description,
        website,
        location
    } = req.body;

    // Check duplicate company name only if recruiter wants to change it
    if (name !== undefined) {

        const existingCompany = await Company.findOne({ name: name.trim() });

        if (
            existingCompany &&
            existingCompany._id.toString() !== companyId
        ) {
            throw new ApiError(400, "Company name already exists");
        }
    }

    // Only update fields that are provided
    const updateData = {};

    if (req.file) {

        if (company.logo) {
            await deleteFromCloudinary(company.logo);
        }

        updateData.logo = req.file.path;
    }

    if (name !== undefined) {
        updateData.name = name.trim();
    }

    if (description !== undefined) {
        updateData.description = description;
    }

    if (website !== undefined) {
        updateData.website = website;
    }

    if (location !== undefined) {
        updateData.location = location;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        updateData,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    return res.status(200).json({
        success: true,
        message: "Company updated successfully",
        company: updatedCompany
    });
});

export const deleteCompany = asyncHandler(async (req, res) => {

    const userId = req.user.userId;
    const { id: companyId } = req.params;

    // Validate Company ID
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    // Find Company
    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Owner Check
    if (company.owner.toString() !== userId) {
        throw new ApiError(
            403,
            "You are not authorized to delete this company"
        );
    }

    // Delete Logo from Cloudinary
    if (company.logo) {
        await deleteFromCloudinary(company.logo);
    }

    // Delete Company from MongoDB
    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
        success: true,
        message: "Company deleted successfully"
    });

});


//admin operations
export const getAdminCompanies = asyncHandler(async (req, res) => {

    const companies = await Company.find()
        .populate("owner", "fullName email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        count: companies.length,
        companies
    });

});

export const updateCompanyStatus = asyncHandler(async (req, res) => {

    const { id: companyId } = req.params;
    const { accountStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    if (!["active", "suspended"].includes(accountStatus)) {
        throw new ApiError(
            400,
            "Invalid company status"
        );
    }

    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    company.accountStatus = accountStatus;

    await company.save();

    return res.status(200).json({
        success: true,
        message: `Company ${accountStatus} successfully`,
        company
    });

});

// ================================
// PUBLIC / STUDENT COMPANY LIST
// ================================

export const getBrowseCompanies = asyncHandler(async (req, res) => {

    const companies = await Company.find({
        accountStatus: "active"
    })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        count: companies.length,
        companies
    });

});


// ================================
// COMPANY DETAILS + ACTIVE JOBS
// ================================

export const getBrowseCompanyById = asyncHandler(async (req, res) => {

    const { id: companyId } = req.params;

    // Validate Company ID
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }


    // Find active company
    const company = await Company.findOne({
        _id: companyId,
        accountStatus: "active"
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }


    // Find active jobs of this company
    const jobs = await Job.find({
        company: companyId,
        isActive: true,
        deadline: {
            $gte: new Date()
        }
    })
        .sort({ createdAt: -1 });


    return res.status(200).json({
        success: true,
        message: "Company fetched successfully",
        company,
        jobs,
        jobCount: jobs.length
    });

});
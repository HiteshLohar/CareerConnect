import Company from "../models/Company.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createCompany = asyncHandler(async (req, res) => {

    const owner = req.user.userId;

    const {
        name,
        description,
        website,
        location,
        logo
    } = req.body;

    // Validate company name
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Company name is required");
    }

    // Check duplicate company (case-insensitive)
    const companyExists = await Company.findOne({
        name: {
            $regex: new RegExp(`^${name.trim()}$`, "i")
        }
    });

    if (companyExists) {
        throw new ApiError(400, "Company already exists");
    }

    const company = await Company.create({
        name: name.trim(),
        description: description?.trim() || "",
        website: website?.trim() || "",
        location: location?.trim() || "",
        logo: logo?.trim() || "",
        owner
    });

    return res.status(201).json({
        success: true,
        message: "Company created successfully",
        company
    });
});

export const getAllCompanies = asyncHandler(async (req, res) => {

    const userId = req.user.userId;

    const companies = await Company.find({ owner: userId }).sort({ createdAt: -1 });

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
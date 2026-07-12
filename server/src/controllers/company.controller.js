import Company from "../models/Company.js";

export const createCompany = async (req, res) => {
    try {
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
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        // Check duplicate company (case-insensitive)
        const companyExists = await Company.findOne({
            name: {
                $regex: new RegExp(`^${name.trim()}$`, "i")
            }
        });

        if (companyExists) {
            return res.status(400).json({
                success: false,
                message: "Company already exists"
            });
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

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//      
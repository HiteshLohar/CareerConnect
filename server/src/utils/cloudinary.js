import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) return;

        const parts = fileUrl.split("/");

        const publicIdWithExtension = parts.slice(7).join("/");

        const publicId = publicIdWithExtension.substring(
            0,
            publicIdWithExtension.lastIndexOf(".")
        );

        const result = await cloudinary.uploader.destroy(publicId);

        console.log("Cloudinary Delete:", result);

        return result;

    } catch (error) {
        console.error("Cloudinary Delete Error:", error.message);
    }
};
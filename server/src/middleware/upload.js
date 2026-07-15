import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder  = "CareerConnect/others";

        if(file.fieldname === "profilePhoto"){
            folder = "CareerConnect/profile-photos";
        }else if(file.fieldname === "logo"){
            folder = "CareerConnect/company-logos";
        }else if(file.fieldname === "resume"){
            folder = "CareerConnect/resumes"
        }

        return{
            folder,
            resource_type: "auto",
            allowed_formats : ["jpg", "jpeg", "png", "pdf"]
        };
    }   
});

const upload = multer({storage});

export default upload;
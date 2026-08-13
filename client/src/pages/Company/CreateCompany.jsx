import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";

import api from "../../services/api";

function CreateCompany() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: ""
    });

    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================
    // HANDLE TEXT INPUT
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // HANDLE LOGO
    // =========================

    const handleLogoChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            toast.error("Please select an image file");

            return;
        }

        setLogo(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    // =========================
    // REMOVE LOGO
    // =========================

    const handleRemoveLogo = () => {

        setLogo(null);
        setPreview("");

    };


    // =========================
    // CREATE COMPANY
    // =========================

    const handleCreateCompany = async () => {

        try {

            setLoading(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("website", formData.website);
            data.append("location", formData.location);

            if (logo) {
                data.append("logo", logo);
            }


            const response = await api.post(
                "/companies",
                data
            );


            toast.success(
                response.data.message
            );

            navigate("/companies");


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="max-w-3xl mx-auto py-10 px-4">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Create Company
                </h1>


                <div className="space-y-6">


                    {/* =========================
                        COMPANY LOGO
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Logo
                        </label>

                        <div className="flex items-center gap-5">

                            {preview ? (

                                <div className="relative">

                                    <img
                                        src={preview}
                                        alt="Company logo preview"
                                        className="w-24 h-24 rounded-xl border object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <FiX size={16} />
                                    </button>

                                </div>

                            ) : (

                                <label
                                    htmlFor="companyLogo"
                                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                                >

                                    <FiUpload
                                        size={24}
                                        className="text-gray-500"
                                    />

                                    <span className="text-xs text-gray-500 mt-1">
                                        Upload
                                    </span>

                                </label>

                            )}

                            <input
                                id="companyLogo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                            />

                            {!preview && (
                                <div className="text-sm text-gray-500">
                                    Upload your company logo
                                    <br />
                                    JPG, JPEG or PNG
                                </div>
                            )}

                        </div>

                    </div>


                    {/* =========================
                        COMPANY NAME
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter company description"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* =========================
                        WEBSITE
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                        </label>

                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://company.com"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* =========================
                        LOCATION
                    ========================= */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter company location"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>


                {/* =========================
                    BUTTON
                ========================= */}

                <div className="mt-8 flex justify-end">

                    <button
                        onClick={handleCreateCompany}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:bg-gray-400"
                    >

                        {loading
                            ? "Creating..."
                            : "Create Company"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateCompany;
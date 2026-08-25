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

        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">

            <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">

                <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
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

                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">

                            {preview ? (

                                <div className="relative">

                                    <img
                                        src={preview}
                                        alt="Company logo preview"
                                        className="h-20 w-20 rounded-xl border object-cover sm:h-24 sm:w-24"
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
                                    className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-blue-500 hover:bg-blue-50 sm:h-24 sm:w-24"
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

                <div className="mt-8 flex">

                    <button
                        onClick={handleCreateCompany}
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:bg-gray-400 sm:ml-auto sm:w-auto"
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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";


function EditCompany() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        logo: null
    });
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };
    const handleLogoChange = (e) => {

        setFormData({
            ...formData,
            logo: e.target.files[0]
        });

    };

    const fetchCompany = async () => {

        try {

            const response = await api.get(`/companies/${id}`);

            const company = response.data.company;

            setFormData({
                name: company.name || "",
                description: company.description || "",
                website: company.website || "",
                location: company.location || "",
                logo: null
            });

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch company"
            );

            navigate("/companies");

        } finally {

            setLoading(false);

        }

    };


    const handleUpdateCompany = async () => {

        try {

            setIsSaving(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("website", formData.website);
            data.append("location", formData.location);

            if (formData.logo) {
                data.append("logo", formData.logo);
            }

            const response = await api.put(
                `/companies/${id}`,
                data
            );

            toast.success(response.data.message);

            navigate("/companies");

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setIsSaving(false);

        }

    };

    useEffect(() => {

        fetchCompany();

    }, []);

    if (loading) {

        return (

            <div className="text-center py-20 text-xl">
                Loading...
            </div>

        );

    }


    return (

        <div className="max-w-4xl mx-auto py-10 px-4">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Edit Company
                </h1>

                <div className="space-y-6">

                    {/* Company Name */}

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

                    {/* Description */}

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

                    {/* Website */}

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

                    {/* Location */}

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

                    {/* Logo */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Logo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                    </div>

                </div>

                <div className="mt-8 flex justify-end">

                    <button
                        onClick={handleUpdateCompany}
                        disabled={isSaving}
                        className={`px-6 py-3 rounded-lg text-white transition ${isSaving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default EditCompany;
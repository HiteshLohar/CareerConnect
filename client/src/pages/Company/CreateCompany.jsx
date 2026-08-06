import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";


function CreateCompany() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        website: "",
        location: ""
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateCompany = async () => {

        try {

            const response = await api.post(
                "/companies",
                formData
            );

            toast.success(response.data.message);
            navigate("/companies");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };

    return (

        <div className="max-w-3xl mx-auto py-10 px-4">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Create Company
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

                </div>



                <div className="mt-8 flex justify-end">

                    <button
                        onClick={handleCreateCompany}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateCompany;
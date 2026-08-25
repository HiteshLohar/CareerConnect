import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

function CreateJob() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
        jobType: "",
        experience: "",
        skills: "",
        vacancies: "",
        deadline: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const fetchCompanies = async () => {

        try {

            const response = await api.get("/companies");

            setCompanies(response.data.companies);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch companies"
            );

        }

    };

    const handleCreateJob = async () => {

        try {

            setIsSaving(true);

            const response = await api.post(
                "/jobs",
                {
                    ...formData,

                    salary: Number(formData.salary),

                    experience: Number(formData.experience),

                    vacancies: Number(formData.vacancies),

                    skills: formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill !== "")
                }
            );

            toast.success(response.data.message);

            navigate("/recruiter/jobs");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setIsSaving(false);

        }

    };

    useEffect(() => {

        fetchCompanies();

    }, []);

    return (

        <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6">

            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">

                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                    Create Job
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter Job Title"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Company
                        </label>

                        <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Select Company
                            </option>

                            {companies.map((company) => (

                                <option
                                    key={company._id}
                                    value={company._id}
                                >
                                    {company.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Salary
                        </label>

                        <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="Salary"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Experience (Years)
                        </label>

                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Experience"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Job Type
                        </label>

                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="">
                                Select Job Type
                            </option>

                            <option value="Full-time">
                                Full-time
                            </option>

                            <option value="Part-time">
                                Part-time
                            </option>

                            <option value="Internship">
                                Internship
                            </option>

                            <option value="Contract">
                                Contract
                            </option>

                        </select>

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Vacancies
                        </label>

                        <input
                            type="number"
                            name="vacancies"
                            value={formData.vacancies}
                            onChange={handleChange}
                            placeholder="Vacancies"
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Deadline
                        </label>

                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                <div className="mt-5 sm:mt-6">

                    <label className="block text-sm font-medium mb-2">
                        Description
                    </label>

                    <textarea
                        rows="6"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Job Description"
                        className="w-full min-w-0 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end">

                    <button
                        onClick={handleCreateJob}
                        disabled={isSaving}
                        className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white transition ${
                            isSaving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isSaving
                            ? "Creating..."
                            : "Create Job"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CreateJob;
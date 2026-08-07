import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

function EditJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchJob = async () => {

        try {

            const response = await api.get(
                `/jobs/recruiter/${id}`
            );

            const job = response.data.job;

            setFormData({
                title: job.title || "",
                company: job.company?._id || job.company || "",
                description: job.description || "",
                location: job.location || "",
                salary: job.salary ?? "",
                jobType: job.jobType || "",
                experience: job.experience ?? "",
                skills: job.skills?.join(", ") || "",
                vacancies: job.vacancies ?? "",
                deadline: job.deadline
                    ? job.deadline.split("T")[0]
                    : ""
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch job"
            );

            navigate("/recruiter/jobs");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchCompanies();
        fetchJob();

    }, [id]);

    const handleUpdateJob = async () => {

        try {

            setIsSaving(true);

            const response = await api.put(
                `/jobs/${id}`,
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

    if (loading) {

        return (
            <div className="flex justify-center items-center py-20">

                <p className="text-gray-500">
                    Loading job...
                </p>

            </div>
        );

    }

    return (

        <div className="max-w-4xl mx-auto py-10 px-4">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Edit Job
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Job Title */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Company */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Company
                        </label>

                        <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Location */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Salary */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Experience */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Job Type */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Job Type
                        </label>

                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Skills */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Vacancies */}

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
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Deadline */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Deadline
                        </label>

                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                {/* Description */}

                <div className="mt-6">

                    <label className="block text-sm font-medium mb-2">
                        Description
                    </label>

                    <textarea
                        rows="6"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Job Description"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                {/* Buttons */}

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/recruiter/jobs")}
                        disabled={isSaving}
                        className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleUpdateJob}
                        disabled={isSaving}
                        className={`px-6 py-3 rounded-lg text-white ${
                            isSaving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isSaving ? "Updating..." : "Update Job"}
                    </button>

                </div>

            </div>

        </div>

    );
}

export default EditJob;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";

function MyJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get("/jobs/recruiter");

            const activeJobs = response.data.jobs.filter(
                (job) => job.isActive
            );

            setJobs(activeJobs);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch jobs"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleDeleteJob = async (jobId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/jobs/${jobId}`);

            toast.success("Job deleted successfully");

            setJobs((prevJobs) =>
                prevJobs.filter((job) => job._id !== jobId)
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete job"
            );

        }

    };

    useEffect(() => {

        fetchJobs();

    }, []);

    if (loading) {

        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-500">
                    Loading jobs...
                </p>
            </div>
        );

    }

    return (

        <div className="max-w-6xl mx-auto py-10 px-4">

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    My Jobs
                </h1>

                <Link
                    to="/jobs/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                >
                    + Create Job
                </Link>

            </div>


            {/* No Jobs */}

            {jobs.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <p className="text-gray-500 mb-5">
                        You haven't posted any jobs yet.
                    </p>

                    <Link
                        to="/jobs/create"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                    >
                        Create Your First Job
                    </Link>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {jobs.map((job) => (

                        <div
                            key={job._id}
                            className="bg-white rounded-xl shadow-md p-6"
                        >

                            {/* Company */}

                            <div className="flex items-center gap-4 mb-5">

                                {job.company?.logo ? (

                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="w-14 h-14 rounded-lg object-cover border"
                                    />

                                ) : (

                                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-xl">
                                            🏢
                                        </span>
                                    </div>

                                )}

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        {job.title}
                                    </h2>

                                    <p className="text-gray-500">
                                        {job.company?.name}
                                    </p>

                                </div>

                            </div>


                            {/* Job Info */}

                            <div className="space-y-2 text-sm text-gray-600">

                                <p>
                                    📍 {job.location}
                                </p>

                                <p>
                                    💰 ₹{job.salary}
                                </p>

                                <p>
                                    💼 {job.jobType}
                                </p>

                                <p>
                                    🎯 {job.experience} years experience
                                </p>

                                <p>
                                    👥 {job.vacancies} vacancies
                                </p>

                                <p>
                                    📅 Deadline:{" "}
                                    {new Date(
                                        job.deadline
                                    ).toLocaleDateString()}
                                </p>

                            </div>


                            {/* Skills */}

                            <div className="flex flex-wrap gap-2 mt-5">

                                {job.skills?.map((skill, index) => (

                                    <span
                                        key={index}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>

                                ))}

                            </div>


                            {/* Actions */}

                            <div className="flex justify-end gap-3 mt-6">

                                <Link
                                    to={`/jobs/${job._id}/edit`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyJobs;
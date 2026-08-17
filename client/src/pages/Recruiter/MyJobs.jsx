import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    FiBriefcase,
    FiMapPin,
    FiDollarSign,
    FiTarget,
    FiUsers,
    FiCalendar,
    FiEdit,
    FiTrash2,
    FiUserCheck,
    FiPlus
} from "react-icons/fi";

import api from "../../services/api";

function MyJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH RECRUITER JOBS
    // =========================

    const fetchJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/jobs/recruiter"
            );

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


    // =========================
    // DELETE JOB
    // =========================

    const handleDeleteJob = async (jobId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/jobs/${jobId}`
            );

            toast.success(
                "Job deleted successfully"
            );

            setJobs((prevJobs) =>
                prevJobs.filter(
                    (job) => job._id !== jobId
                )
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete job"
            );

        }

    };


    // =========================
    // FETCH ON PAGE LOAD
    // =========================

    useEffect(() => {

        fetchJobs();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center">

                <div className="flex items-center gap-3 text-gray-500">

                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                    <p>
                        Loading jobs...
                    </p>

                </div>

            </div>

        );

    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="max-w-6xl mx-auto py-10 px-4">


            {/* =========================
                HEADER
            ========================= */}

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    My Jobs
                </h1>


                <Link
                    to="/jobs/create"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                >

                    <FiPlus size={18} />

                    <span>
                        Create Job
                    </span>

                </Link>

            </div>


            {/* =========================
                NO JOBS
            ========================= */}

            {jobs.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center">

                        <FiBriefcase
                            size={26}
                            className="text-blue-600"
                        />

                    </div>

                    <p className="text-gray-500 mt-4 mb-5">
                        You haven't posted any jobs yet.
                    </p>

                    <Link
                        to="/jobs/create"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                    >

                        <FiPlus size={18} />

                        <span>
                            Create Your First Job
                        </span>

                    </Link>

                </div>

            ) : (


                /* =========================
                    JOB GRID
                ========================= */

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {jobs.map((job) => (

                        <div
                            key={job._id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition"
                        >


                            {/* =========================
                                COMPANY
                            ========================= */}

                            <div className="flex items-center gap-4 mb-5">

                                {job.company?.logo ? (

                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="w-14 h-14 rounded-lg object-cover border"
                                    />

                                ) : (

                                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">

                                        <FiBriefcase
                                            size={24}
                                            className="text-gray-400"
                                        />

                                    </div>

                                )}


                                <div className="min-w-0">

                                    <h2 className="text-xl font-semibold text-gray-900 truncate">
                                        {job.title}
                                    </h2>

                                    <p className="text-gray-500 truncate">
                                        {job.company?.name}
                                    </p>

                                </div>

                            </div>


                            {/* =========================
                                JOB INFO
                            ========================= */}

                            <div className="space-y-2.5 text-sm text-gray-600">


                                {/* Location */}

                                <div className="flex items-center gap-2">

                                    <FiMapPin
                                        size={16}
                                        className="text-blue-600 shrink-0"
                                    />

                                    <span>
                                        {job.location}
                                    </span>

                                </div>


                                {/* Salary */}

                                <div className="flex items-center gap-2">

                                    <FiDollarSign
                                        size={16}
                                        className="text-green-600 shrink-0"
                                    />

                                    <span>
                                        ₹{job.salary}
                                    </span>

                                </div>


                                {/* Job Type */}

                                <div className="flex items-center gap-2">

                                    <FiBriefcase
                                        size={16}
                                        className="text-blue-600 shrink-0"
                                    />

                                    <span>
                                        {job.jobType}
                                    </span>

                                </div>


                                {/* Experience */}

                                <div className="flex items-center gap-2">

                                    <FiTarget
                                        size={16}
                                        className="text-purple-600 shrink-0"
                                    />

                                    <span>
                                        {job.experience}{" "}
                                        {job.experience === 1
                                            ? "year"
                                            : "years"}{" "}
                                        experience
                                    </span>

                                </div>


                                {/* Vacancies */}

                                <div className="flex items-center gap-2">

                                    <FiUsers
                                        size={16}
                                        className="text-orange-600 shrink-0"
                                    />

                                    <span>
                                        {job.vacancies} vacancies
                                    </span>

                                </div>


                                {/* Deadline */}

                                <div className="flex items-center gap-2">

                                    <FiCalendar
                                        size={16}
                                        className="text-red-600 shrink-0"
                                    />

                                    <span>
                                        Deadline:{" "}
                                        {new Date(
                                            job.deadline
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>


                            {/* =========================
                                SKILLS
                            ========================= */}

                            {job.skills?.length > 0 && (

                                <div className="flex flex-wrap gap-2 mt-5">

                                    {job.skills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            )}


                            {/* =========================
                                ACTIONS
                            ========================= */}

                            <div className="flex justify-end gap-2 mt-6">


                                {/* Applicants */}

                                <Link
                                    to={`/jobs/${job._id}/applicants`}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                >

                                    <FiUserCheck size={16} />

                                    <span>
                                        Applicants
                                    </span>

                                </Link>


                                {/* Edit */}

                                <Link
                                    to={`/jobs/${job._id}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >

                                    <FiEdit size={16} />

                                    <span>
                                        Edit
                                    </span>

                                </Link>


                                {/* Delete */}

                                <button
                                    onClick={() =>
                                        handleDeleteJob(job._id)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                                >

                                    <FiTrash2 size={16} />

                                    <span>
                                        Delete
                                    </span>

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
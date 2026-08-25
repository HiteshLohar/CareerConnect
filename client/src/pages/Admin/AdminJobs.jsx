import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // =========================
    // FETCH ALL JOBS
    // =========================

    const fetchJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get("/jobs/admin");

            setJobs(response.data.jobs);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch jobs"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchJobs();

    }, []);


    // =========================
    // SEARCH
    // =========================

    const filteredJobs = jobs.filter((job) => {

        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            job.title
                ?.toLowerCase()
                .includes(searchText) ||

            job.company?.name
                ?.toLowerCase()
                .includes(searchText) ||

            job.postedBy?.fullName
                ?.toLowerCase()
                .includes(searchText) ||

            job.postedBy?.email
                ?.toLowerCase()
                .includes(searchText) ||

            job.location
                ?.toLowerCase()
                .includes(searchText)
        );

    });


    // =========================
    // UPDATE JOB STATUS
    // =========================

    const handleStatusChange = async (
        jobId,
        currentStatus
    ) => {

        const newStatus = !currentStatus;

        try {

            const response = await api.patch(
                `/jobs/admin/${jobId}/status`,
                {
                    isActive: newStatus
                }
            );

            toast.success(response.data.message);

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job._id === jobId
                        ? {
                            ...job,
                            isActive: newStatus
                        }
                        : job
                )
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update job status"
            );

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[400px] px-4">

                <p className="text-lg sm:text-xl text-gray-600 text-center">
                    Loading Jobs...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Job Management
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Manage all jobs posted on CareerConnect
                </p>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="mb-5 sm:mb-6">

                <input
                    type="text"
                    placeholder="Search job, company, recruiter or location..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =========================
                COUNT
            ========================= */}

            <div className="mb-4 text-sm sm:text-base text-gray-600">

                Showing{" "}

                <span className="font-semibold">
                    {filteredJobs.length}
                </span>{" "}

                jobs

            </div>


            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden lg:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4">
                                    Job
                                </th>

                                <th className="text-left p-4">
                                    Company
                                </th>

                                <th className="text-left p-4">
                                    Recruiter
                                </th>

                                <th className="text-left p-4">
                                    Location
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredJobs.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No jobs found
                                    </td>

                                </tr>

                            ) : (

                                filteredJobs.map((job) => (

                                    <tr
                                        key={job._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >

                                        {/* JOB */}

                                        <td className="p-4">

                                            <p className="font-semibold text-gray-900">
                                                {job.title}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {job.jobType}
                                            </p>

                                        </td>


                                        {/* COMPANY */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                {job.company?.logo ? (

                                                    <img
                                                        src={job.company.logo}
                                                        alt={job.company.name}
                                                        className="w-9 h-9 rounded-lg object-cover"
                                                    />

                                                ) : (

                                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                        {job.company?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                )}

                                                <span className="font-medium">
                                                    {job.company?.name ||
                                                        "Unknown"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* RECRUITER */}

                                        <td className="p-4">

                                            <p className="font-medium text-gray-900">
                                                {job.postedBy?.fullName ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {job.postedBy?.email ||
                                                    "No email"}
                                            </p>

                                        </td>


                                        {/* LOCATION */}

                                        <td className="p-4 text-gray-600">
                                            {job.location || "N/A"}
                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    job.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {job.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="p-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        job._id,
                                                        job.isActive
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg text-white transition ${
                                                    job.isActive
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >
                                                {job.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                MOBILE + TABLET CARDS
            ================================================== */}

            <div className="lg:hidden space-y-4">

                {filteredJobs.length === 0 ? (

                    <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                        No jobs found
                    </div>

                ) : (

                    filteredJobs.map((job) => (

                        <div
                            key={job._id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5"
                        >

                            {/* JOB HEADER */}

                            <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                    <h2 className="font-semibold text-gray-900 text-base sm:text-lg break-words">
                                        {job.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {job.jobType}
                                    </p>

                                </div>


                                {/* STATUS */}

                                <span
                                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                        job.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {job.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>


                            {/* COMPANY */}

                            <div className="flex items-center gap-3 mt-5">

                                {job.company?.logo ? (

                                    <img
                                        src={job.company.logo}
                                        alt={job.company.name}
                                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                                    />

                                ) : (

                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                        {job.company?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                )}

                                <div className="min-w-0">

                                    <p className="font-medium text-gray-900 truncate">
                                        {job.company?.name ||
                                            "Unknown"}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Company
                                    </p>

                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className="mt-5 space-y-3 text-sm">

                                <div>

                                    <p className="text-gray-400">
                                        Recruiter
                                    </p>

                                    <p className="font-medium text-gray-900 break-words">
                                        {job.postedBy?.fullName ||
                                            "Unknown"}
                                    </p>

                                    <p className="text-gray-500 break-all">
                                        {job.postedBy?.email ||
                                            "No email"}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-gray-400">
                                        Location
                                    </p>

                                    <p className="text-gray-700">
                                        {job.location || "N/A"}
                                    </p>

                                </div>

                            </div>


                            {/* ACTION */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleStatusChange(
                                        job._id,
                                        job.isActive
                                    )
                                }
                                className={`w-full mt-5 px-4 py-2.5 rounded-lg text-white font-medium transition ${
                                    job.isActive
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {job.isActive
                                    ? "Deactivate Job"
                                    : "Activate Job"}
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default AdminJobs;
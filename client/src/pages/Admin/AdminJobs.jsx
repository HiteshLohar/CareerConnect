import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    // =====================================
    // FETCH ALL JOBS
    // =====================================

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


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchJobs();

    }, []);


    // =====================================
    // SEARCH
    // =====================================

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


    // =====================================
    // UPDATE JOB STATUS
    // =====================================

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


            // Update only the selected job
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


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[400px]">

                <p className="text-xl text-gray-600">
                    Loading Jobs...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 py-10">


            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Job Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage all jobs posted on CareerConnect
                </p>

            </div>


            {/* SEARCH */}

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search job, company, recruiter or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* COUNT */}

            <div className="mb-4 text-gray-600">

                Showing{" "}
                <span className="font-semibold">
                    {filteredJobs.length}
                </span>{" "}
                jobs

            </div>


            {/* TABLE */}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">


                        {/* HEADER */}

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


                        {/* BODY */}

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

        </div>

    );

}

export default AdminJobs;
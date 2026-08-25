import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    // =====================================
    // FETCH ALL APPLICATIONS
    // =====================================

    const fetchApplications = async () => {

        try {

            setLoading(true);

            const response = await api.get("/applications/admin");

            setApplications(response.data.applications);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch applications"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchApplications();

    }, []);


    // =====================================
    // SEARCH
    // =====================================

    const filteredApplications = applications.filter((application) => {

        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            application.student?.fullName
                ?.toLowerCase()
                .includes(searchText) ||

            application.student?.email
                ?.toLowerCase()
                .includes(searchText) ||

            application.job?.title
                ?.toLowerCase()
                .includes(searchText) ||

            application.job?.company?.name
                ?.toLowerCase()
                .includes(searchText) ||

            application.job?.postedBy?.fullName
                ?.toLowerCase()
                .includes(searchText) ||

            application.job?.postedBy?.email
                ?.toLowerCase()
                .includes(searchText) ||

            application.status
                ?.toLowerCase()
                .includes(searchText)
        );

    });


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[400px]">

                <p className="text-lg sm:text-xl text-gray-600">
                    Loading Applications...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-6 sm:py-10">


            {/* =================================
                HEADER
            ================================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Application Management
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    View all applications submitted on CareerConnect
                </p>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

            <div className="mb-5 sm:mb-8">

                <input
                    type="text"
                    placeholder="Search student, job, company or recruiter..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =================================
                RESULT COUNT
            ================================= */}

            <div className="mb-4 text-sm sm:text-base text-gray-600">

                Showing{" "}
                <span className="font-semibold">
                    {filteredApplications.length}
                </span>{" "}
                applications

            </div>


            {/* =====================================================
                DESKTOP TABLE
            ===================================================== */}

            <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        {/* TABLE HEADER */}

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Student
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Job
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Company
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Recruiter
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Status
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Applied Date
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {filteredApplications.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No applications found
                                    </td>

                                </tr>

                            ) : (

                                filteredApplications.map((application) => (

                                    <tr
                                        key={application._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >

                                        {/* STUDENT */}

                                        <td className="p-4">

                                            <p className="font-semibold text-gray-900">
                                                {application.student?.fullName ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500 break-all">
                                                {application.student?.email ||
                                                    "No email"}
                                            </p>

                                        </td>


                                        {/* JOB */}

                                        <td className="p-4">

                                            <p className="font-semibold text-gray-900">
                                                {application.job?.title ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {application.job?.location ||
                                                    "N/A"}
                                            </p>

                                        </td>


                                        {/* COMPANY */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                {application.job?.company?.logo ? (

                                                    <img
                                                        src={
                                                            application.job.company.logo
                                                        }
                                                        alt={
                                                            application.job.company.name
                                                        }
                                                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                                                    />

                                                ) : (

                                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">

                                                        {application.job?.company?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                )}

                                                <span className="font-medium">
                                                    {application.job?.company?.name ||
                                                        "Unknown"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* RECRUITER */}

                                        <td className="p-4">

                                            <p className="font-medium text-gray-900">
                                                {application.job?.postedBy?.fullName ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-sm text-gray-500 break-all">
                                                {application.job?.postedBy?.email ||
                                                    "No email"}
                                            </p>

                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                                                    application.status ===
                                                    "Accepted"
                                                        ? "bg-green-100 text-green-700"
                                                        : application.status ===
                                                          "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {application.status}
                                            </span>

                                        </td>


                                        {/* APPLIED DATE */}

                                        <td className="p-4 text-gray-600 whitespace-nowrap">

                                            {application.createdAt
                                                ? new Date(
                                                      application.createdAt
                                                  ).toLocaleDateString()
                                                : "N/A"}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                MOBILE CARDS
            ===================================================== */}

            <div className="md:hidden space-y-4">

                {filteredApplications.length === 0 ? (

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-12 text-gray-500">

                        No applications found

                    </div>

                ) : (

                    filteredApplications.map((application) => (

                        <div
                            key={application._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                        >

                            {/* TOP SECTION */}

                            <div className="flex items-start justify-between gap-3 mb-4">

                                <div className="min-w-0">

                                    <p className="font-bold text-gray-900 truncate">
                                        {application.student?.fullName ||
                                            "Unknown"}
                                    </p>

                                    <p className="text-sm text-gray-500 break-all">
                                        {application.student?.email ||
                                            "No email"}
                                    </p>

                                </div>


                                {/* STATUS */}

                                <span
                                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        application.status === "Accepted"
                                            ? "bg-green-100 text-green-700"
                                            : application.status === "Rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {application.status}
                                </span>

                            </div>


                            {/* JOB */}

                            <div className="border-t border-gray-100 pt-3 mb-3">

                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Job
                                </p>

                                <p className="font-semibold text-gray-900 mt-1">
                                    {application.job?.title ||
                                        "Unknown"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {application.job?.location ||
                                        "N/A"}
                                </p>

                            </div>


                            {/* COMPANY */}

                            <div className="border-t border-gray-100 pt-3 mb-3">

                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                    Company
                                </p>

                                <div className="flex items-center gap-3">

                                    {application.job?.company?.logo ? (

                                        <img
                                            src={
                                                application.job.company.logo
                                            }
                                            alt={
                                                application.job.company.name
                                            }
                                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                                        />

                                    ) : (

                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">

                                            {application.job?.company?.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>

                                    )}

                                    <span className="font-medium text-gray-900">
                                        {application.job?.company?.name ||
                                            "Unknown"}
                                    </span>

                                </div>

                            </div>


                            {/* RECRUITER */}

                            <div className="border-t border-gray-100 pt-3 mb-3">

                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Recruiter
                                </p>

                                <p className="font-medium text-gray-900 mt-1">
                                    {application.job?.postedBy?.fullName ||
                                        "Unknown"}
                                </p>

                                <p className="text-sm text-gray-500 break-all">
                                    {application.job?.postedBy?.email ||
                                        "No email"}
                                </p>

                            </div>


                            {/* DATE */}

                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">

                                <span className="text-xs font-semibold text-gray-400 uppercase">
                                    Applied
                                </span>

                                <span className="text-sm text-gray-600">
                                    {application.createdAt
                                        ? new Date(
                                              application.createdAt
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default AdminApplications;
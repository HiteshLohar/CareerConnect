import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/dashboard/recruiter");

            setDashboard(response.data.dashboard);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchDashboard();
    }, []);


    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <p className="text-center text-lg text-gray-500 sm:text-xl">
                    Loading Dashboard...
                </p>
            </div>
        );

    }


    if (!dashboard) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <p className="text-gray-500">
                    Unable to load dashboard.
                </p>
            </div>
        );

    }


    return (

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Recruiter Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your jobs and track applications.
                </p>

            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">


                {/* Companies */}

                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">

                    <p className="text-gray-500">
                        Total Companies
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalCompanies}
                    </h2>

                </div>


                {/* Jobs */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Jobs
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalJobs}
                    </h2>

                </div>


                {/* Active Jobs */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Active Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {dashboard.activeJobs}
                    </h2>

                </div>


                {/* Applications */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalApplications}
                    </h2>

                </div>

            </div>


            {/* =========================
                APPLICATION STATUS
            ========================= */}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-5 md:grid-cols-3">


                {/* Pending */}

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:p-6">

                    <p className="text-yellow-700 font-medium">
                        Pending Applications
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {dashboard.pendingApplications}
                    </h2>

                </div>


                {/* Accepted */}

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-6">

                    <p className="text-green-700 font-medium">
                        Accepted Applications
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.acceptedApplications}
                    </h2>

                </div>


                {/* Rejected */}

                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6">

                    <p className="text-red-700 font-medium">
                        Rejected Applications
                    </p>

                    <h2 className="text-3xl font-bold text-red-700 mt-2">
                        {dashboard.rejectedApplications}
                    </h2>

                </div>

            </div>


            {/* =========================
                RECENT JOBS
            ========================= */}

            <div className="mt-6 rounded-2xl border bg-white shadow-sm sm:mt-8">

                <div className="flex items-center justify-between gap-4 border-b p-4 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Recent Jobs
                    </h2>

                    <button
                        onClick={() => navigate("/recruiter/jobs")}
                        className="text-blue-600 hover:underline"
                    >
                        View All
                    </button>

                </div>


                <div className="divide-y">

                    {
                        dashboard.recentJobs.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">
                                No jobs posted yet.
                            </div>

                        ) : (

                            dashboard.recentJobs.map((job) => (

                                <div
                                    key={job._id}
                                    className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between"
                                >

                                    <div>

                                        <h3 className="font-semibold text-lg">
                                            {job.title}
                                        </h3>

                                        <p className="text-gray-500 mt-1">
                                            📍 {job.location}
                                        </p>

                                        <p className="text-gray-500 mt-1">
                                            ₹ {(job.salary / 100000).toFixed(1)} LPA
                                        </p>

                                    </div>


                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                job.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {job.isActive
                                                ? "Active"
                                                : "Inactive"
                                            }
                                        </span>

                                    </div>

                                </div>

                            ))

                        )
                    }

                </div>

            </div>


            {/* =========================
                RECENT APPLICATIONS
            ========================= */}

            <div className="mt-6 rounded-2xl border bg-white shadow-sm sm:mt-8">

                <div className="border-b p-4 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Recent Applications
                    </h2>

                </div>


                <div className="divide-y">

                    {
                        dashboard.recentApplications.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">
                                No applications yet.
                            </div>

                        ) : (

                            dashboard.recentApplications.map(
                                (application) => (

                                    <div
                                        key={application._id}
                                        className="flex flex-col gap-4 p-4 sm:p-6 md:flex-row md:items-center md:justify-between"
                                    >

                                        <div>

                                            <h3 className="font-semibold">
                                                {application.student.fullName}
                                            </h3>

                                            <p className="text-gray-500">
                                                {application.student.email}
                                            </p>

                                            <p className="text-gray-600 mt-1">
                                                Applied for{" "}
                                                <span className="font-medium">
                                                    {application.job.title}
                                                </span>
                                            </p>

                                        </div>


                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
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

                                )
                            )

                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default RecruiterDashboard;

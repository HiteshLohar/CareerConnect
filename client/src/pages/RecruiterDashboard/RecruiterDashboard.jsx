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
            <div className="flex justify-center items-center min-h-[70vh]">
                <p className="text-xl text-gray-500">
                    Loading Dashboard...
                </p>
            </div>
        );

    }


    if (!dashboard) {

        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <p className="text-gray-500">
                    Unable to load dashboard.
                </p>
            </div>
        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Recruiter Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your jobs and track applications.
                </p>

            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                {/* Companies */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">


                {/* Pending */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">

                    <p className="text-yellow-700 font-medium">
                        Pending Applications
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {dashboard.pendingApplications}
                    </h2>

                </div>


                {/* Accepted */}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700 font-medium">
                        Accepted Applications
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.acceptedApplications}
                    </h2>

                </div>


                {/* Rejected */}

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

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

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="flex justify-between items-center p-6 border-b">

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
                                    className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
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


                                    <div className="flex items-center gap-4">

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

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="p-6 border-b">

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
                                        className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
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
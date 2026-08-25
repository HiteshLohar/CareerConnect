import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/dashboard/admin");

            setDashboard(response.data.dashboard);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchDashboard();
    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">

                <p className="text-base sm:text-xl text-gray-500 text-center">
                    Loading Admin Dashboard...
                </p>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (!dashboard) {

        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">

                <p className="text-gray-500 text-center">
                    Unable to load dashboard.
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Monitor users, jobs, companies and applications.
                </p>

            </div>


            {/* =====================================================
                USERS
            ===================================================== */}

            <section
                onClick={() => navigate("/admin/users")}
                className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition"
            >

                <div className="mb-5">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Users
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Overview of platform users
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Total Users */}

                    <div className="border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Total Users
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                            {dashboard.totalUsers}
                        </h3>

                    </div>


                    {/* Students */}

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                        <p className="text-sm text-blue-700">
                            Students
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">
                            {dashboard.totalStudents}
                        </h3>

                    </div>


                    {/* Recruiters */}

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">

                        <p className="text-sm text-purple-700">
                            Recruiters
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mt-2">
                            {dashboard.totalRecruiters}
                        </h3>

                    </div>


                    {/* Companies */}

                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                        <p className="text-sm text-green-700">
                            Companies
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
                            {dashboard.totalCompanies}
                        </h3>

                    </div>

                </div>

            </section>


            {/* =====================================================
                JOBS
            ===================================================== */}

            <section
                onClick={() => navigate("/admin/jobs")}
                className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 mt-6 cursor-pointer hover:shadow-md hover:border-green-300 transition"
            >

                <div className="mb-5">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Jobs
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Overview of posted jobs
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Total Jobs */}

                    <div className="border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Total Jobs
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                            {dashboard.totalJobs}
                        </h3>

                    </div>


                    {/* Active Jobs */}

                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                        <p className="text-sm text-green-700">
                            Active Jobs
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
                            {dashboard.activeJobs}
                        </h3>

                    </div>


                    {/* Inactive Jobs */}

                    <div className="bg-gray-100 border rounded-xl p-5">

                        <p className="text-sm text-gray-600">
                            Inactive Jobs
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mt-2">
                            {dashboard.inactiveJobs}
                        </h3>

                    </div>

                </div>

            </section>


            {/* =====================================================
                APPLICATIONS
            ===================================================== */}

            <section
                onClick={() => navigate("/admin/applications")}
                className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 mt-6 cursor-pointer hover:shadow-md hover:border-yellow-300 transition"
            >

                <div className="mb-5">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Applications
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Application status overview
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Total Applications */}

                    <div className="border rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Total Applications
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                            {dashboard.totalApplications}
                        </h3>

                    </div>


                    {/* Pending */}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">

                        <p className="text-sm text-yellow-700">
                            Pending
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-700 mt-2">
                            {dashboard.pendingApplications}
                        </h3>

                    </div>


                    {/* Accepted */}

                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                        <p className="text-sm text-green-700">
                            Accepted
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
                            {dashboard.acceptedApplications}
                        </h3>

                    </div>


                    {/* Rejected */}

                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                        <p className="text-sm text-red-700">
                            Rejected
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">
                            {dashboard.rejectedApplications}
                        </h3>

                    </div>

                </div>

            </section>


            {/* =====================================================
                RECENT USERS
            ===================================================== */}

            <section className="bg-white border rounded-2xl shadow-sm mt-6 overflow-hidden">

                <div className="p-4 sm:p-6 border-b">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Recent Users
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Recently registered users
                    </p>

                </div>


                <div className="divide-y">

                    {dashboard.recentUsers.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No users found.
                        </div>

                    ) : (

                        dashboard.recentUsers.map((user) => (

                            <div
                                key={user._id}
                                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >

                                <div className="min-w-0">

                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {user.fullName}
                                    </h3>

                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {user.email}
                                    </p>

                                </div>


                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
                                        {user.role}
                                    </span>

                                    <span className="text-xs sm:text-sm text-gray-400">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>


            {/* =====================================================
                RECENT JOBS
            ===================================================== */}

            <section className="bg-white border rounded-2xl shadow-sm mt-6 overflow-hidden">

                <div className="p-4 sm:p-6 border-b">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Recent Jobs
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Recently posted jobs
                    </p>

                </div>


                <div className="divide-y">

                    {dashboard.recentJobs.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No jobs found.
                        </div>

                    ) : (

                        dashboard.recentJobs.map((job) => (

                            <div
                                key={job._id}
                                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >

                                <div className="min-w-0">

                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                                        {job.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1 truncate">
                                        {job.company?.name}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        📍 {job.location}
                                    </p>

                                </div>


                                <div className="flex flex-wrap items-center gap-3">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${job.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {job.isActive
                                            ? "Active"
                                            : "Inactive"
                                        }
                                    </span>

                                    <span className="text-xs sm:text-sm text-gray-400">
                                        {new Date(
                                            job.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </div>

    );

}

export default AdminDashboard;
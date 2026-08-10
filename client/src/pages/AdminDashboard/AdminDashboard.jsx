import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

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


    if (loading) {

        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <p className="text-xl text-gray-500">
                    Loading Admin Dashboard...
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

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Monitor users, jobs, companies and applications.
                </p>

            </div>


            {/* Users */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Users
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalUsers}
                    </h2>

                </div>


                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

                    <p className="text-blue-700">
                        Students
                    </p>

                    <h2 className="text-3xl font-bold text-blue-700 mt-2">
                        {dashboard.totalStudents}
                    </h2>

                </div>


                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">

                    <p className="text-purple-700">
                        Recruiters
                    </p>

                    <h2 className="text-3xl font-bold text-purple-700 mt-2">
                        {dashboard.totalRecruiters}
                    </h2>

                </div>


                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700">
                        Companies
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.totalCompanies}
                    </h2>

                </div>

            </div>


            {/* Jobs */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Jobs
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalJobs}
                    </h2>

                </div>


                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700">
                        Active Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.activeJobs}
                    </h2>

                </div>


                <div className="bg-gray-100 border rounded-2xl p-6">

                    <p className="text-gray-600">
                        Inactive Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-gray-700 mt-2">
                        {dashboard.inactiveJobs}
                    </h2>

                </div>

            </div>


            {/* Applications */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalApplications}
                    </h2>

                </div>


                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">

                    <p className="text-yellow-700">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {dashboard.pendingApplications}
                    </h2>

                </div>


                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700">
                        Accepted
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.acceptedApplications}
                    </h2>

                </div>


                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                    <p className="text-red-700">
                        Rejected
                    </p>

                    <h2 className="text-3xl font-bold text-red-700 mt-2">
                        {dashboard.rejectedApplications}
                    </h2>

                </div>

            </div>


            {/* Recent Users */}

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Recent Users
                    </h2>

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
                                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >

                                <div>

                                    <h3 className="font-semibold">
                                        {user.fullName}
                                    </h3>

                                    <p className="text-gray-500">
                                        {user.email}
                                    </p>

                                </div>


                                <div className="flex items-center gap-3">

                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                        {user.role}
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* Recent Jobs */}

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Recent Jobs
                    </h2>

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
                                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >

                                <div>

                                    <h3 className="font-semibold text-lg">
                                        {job.title}
                                    </h3>

                                    <p className="text-gray-600">
                                        {job.company?.name}
                                    </p>

                                    <p className="text-gray-500 mt-1">
                                        📍 {job.location}
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

                                    <span className="text-sm text-gray-400">
                                        {new Date(
                                            job.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;
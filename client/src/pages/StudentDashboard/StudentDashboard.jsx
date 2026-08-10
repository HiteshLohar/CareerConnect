import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/dashboard/student");

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

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Student Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Track your job applications and their status.
                </p>

            </div>


            {/* Statistics */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                {/* Total */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.totalApplications}
                    </h2>

                </div>


                {/* Pending */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">

                    <p className="text-yellow-700 font-medium">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {dashboard.pendingApplications}
                    </h2>

                </div>


                {/* Accepted */}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700 font-medium">
                        Accepted
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {dashboard.acceptedApplications}
                    </h2>

                </div>


                {/* Rejected */}

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                    <p className="text-red-700 font-medium">
                        Rejected
                    </p>

                    <h2 className="text-3xl font-bold text-red-700 mt-2">
                        {dashboard.rejectedApplications}
                    </h2>

                </div>

            </div>


            {/* Recent Applications */}

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="flex justify-between items-center p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Recent Applications
                    </h2>

                    <button
                        onClick={() => navigate("/my-applications")}
                        className="text-blue-600 hover:underline"
                    >
                        View All
                    </button>

                </div>


                <div className="divide-y">

                    {
                        dashboard.recentApplications.length === 0 ? (

                            <div className="p-10 text-center">

                                <p className="text-gray-500">
                                    You haven't applied for any jobs yet.
                                </p>

                                <button
                                    onClick={() => navigate("/jobs")}
                                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Browse Jobs
                                </button>

                            </div>

                        ) : (

                            dashboard.recentApplications.map(
                                (application) => (

                                    <div
                                        key={application._id}
                                        className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                                    >

                                        {/* Job Info */}

                                        <div className="flex items-center gap-4">

                                            {
                                                application.job?.company?.logo && (

                                                    <img
                                                        src={
                                                            application.job.company.logo
                                                        }
                                                        alt={
                                                            application.job.company.name
                                                        }
                                                        className="w-14 h-14 rounded-xl border object-cover"
                                                    />

                                                )
                                            }

                                            <div>

                                                <h3 className="font-semibold text-lg">
                                                    {application.job?.title}
                                                </h3>

                                                <p className="text-gray-600">
                                                    {application.job?.company?.name}
                                                </p>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">

                                                    <span>
                                                        📍{" "}
                                                        {application.job?.location}
                                                    </span>

                                                    <span>
                                                        💰 ₹{" "}
                                                        {(
                                                            application.job?.salary /
                                                            100000
                                                        ).toFixed(1)}{" "}
                                                        LPA
                                                    </span>

                                                </div>

                                                <p className="text-xs text-gray-400 mt-2">

                                                    Applied on{" "}
                                                    {new Date(
                                                        application.createdAt
                                                    ).toLocaleDateString()}

                                                </p>

                                            </div>

                                        </div>


                                        {/* Status + Button */}

                                        <div className="flex items-center gap-4">

                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                    application.status === "Accepted"
                                                        ? "bg-green-100 text-green-700"
                                                        : application.status === "Rejected"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {application.status}
                                            </span>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/jobs/${application.job?._id}`
                                                    )
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                View Job
                                            </button>

                                        </div>

                                    </div>

                                )

                            )

                        )
                    }

                </div>

            </div>


            {/* Quick Actions */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                <button
                    onClick={() => navigate("/jobs")}
                    className="bg-blue-600 text-white rounded-2xl p-6 text-left hover:bg-blue-700 transition"
                >

                    <h2 className="text-xl font-bold">
                        Browse Jobs
                    </h2>

                    <p className="mt-2 text-blue-100">
                        Find new job opportunities.
                    </p>

                </button>


                <button
                    onClick={() => navigate("/saved-jobs")}
                    className="bg-white border rounded-2xl p-6 text-left hover:shadow-md transition"
                >

                    <h2 className="text-xl font-bold text-gray-900">
                        Saved Jobs
                    </h2>

                    <p className="mt-2 text-gray-500">
                        View the jobs you saved for later.
                    </p>

                </button>

            </div>

        </div>

    );

}

export default StudentDashboard;
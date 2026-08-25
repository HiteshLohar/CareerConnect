import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FaSearch,
    FaBookmark,
    FaBriefcase,
    FaUser,
    FaArrowRight
} from "react-icons/fa";

import api from "../../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH DASHBOARD
    // =========================

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


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <p className="text-center text-lg text-gray-500 sm:text-xl">
                    Loading Dashboard...
                </p>

            </div>
        );

    }


    // =========================
    // ERROR
    // =========================

    if (!dashboard) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <p className="text-center text-gray-500">
                    Unable to load dashboard.
                </p>

            </div>
        );

    }


    // =========================
    // APPLICATION DATA
    // =========================

    const totalApplications =
        dashboard.totalApplications || 0;

    const pendingApplications =
        dashboard.pendingApplications || 0;

    const acceptedApplications =
        dashboard.acceptedApplications || 0;

    const rejectedApplications =
        dashboard.rejectedApplications || 0;


    // =========================
    // PERCENTAGES
    // =========================

    const pendingPercentage =
        totalApplications > 0
            ? (pendingApplications / totalApplications) * 100
            : 0;

    const acceptedPercentage =
        totalApplications > 0
            ? (acceptedApplications / totalApplications) * 100
            : 0;

    const rejectedPercentage =
        totalApplications > 0
            ? (rejectedApplications / totalApplications) * 100
            : 0;


    const acceptedEnd =
        pendingPercentage + acceptedPercentage;


    // =========================
    // PIE CHART
    // =========================

    const pieStyle =
        totalApplications > 0
            ? {
                background: `conic-gradient(
                    #facc15 0% ${pendingPercentage}%,
                    #22c55e ${pendingPercentage}% ${acceptedEnd}%,
                    #ef4444 ${acceptedEnd}% 100%
                )`
            }
            : {
                background: "#e5e7eb"
            };


    return (

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">


            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Student Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Track your job applications and their status.
                </p>

            </div>


            {/* =========================
                DASHBOARD OVERVIEW
            ========================= */}

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">


                {/* =========================
                    APPLICATION SUMMARY
                ========================= */}

                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                    <h2 className="text-xl font-bold text-gray-900">
                        Total Applications
                    </h2>


                    {/* TOTAL */}

                    <div className="mt-6">

                        <p className="text-gray-500">
                            Total Applications
                        </p>

                        <h3 className="text-4xl font-bold text-gray-900 mt-2">
                            {totalApplications}
                        </h3>


                    </div>


                    {/* STATUS SUMMARY */}

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">


                        {/* Pending */}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">

                            <p className="text-sm text-yellow-700 font-medium">
                                Pending
                            </p>

                            <p className="text-2xl font-bold text-yellow-700 mt-1">
                                {pendingApplications}
                            </p>

                        </div>


                        {/* Accepted */}

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                            <p className="text-sm text-green-700 font-medium">
                                Accepted
                            </p>

                            <p className="text-2xl font-bold text-green-700 mt-1">
                                {acceptedApplications}
                            </p>

                        </div>


                        {/* Rejected */}

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">

                            <p className="text-sm text-red-700 font-medium">
                                Rejected
                            </p>

                            <p className="text-2xl font-bold text-red-700 mt-1">
                                {rejectedApplications}
                            </p>

                        </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Keep applying! Every application brings you closer to your dream job.
                    </p>

                </div>


                {/* =========================
                    PIE CHART
                ========================= */}

                <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                    <h2 className="text-xl font-bold text-gray-900">
                        Application Status Overview
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Overview of your job application status.
                    </p>


                    <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:mt-8 sm:flex-row sm:gap-10">


                        {/* PIE */}

                        <div className="relative flex-shrink-0">

                            <div
                                className="h-40 w-40 rounded-full sm:h-48 sm:w-48"
                                style={pieStyle}
                            >

                                <div className="absolute inset-0 flex items-center justify-center">

                                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-sm sm:h-24 sm:w-24">

                                        <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                                            {totalApplications}
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Applications
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* LEGEND */}

                        <div className="w-full space-y-4 sm:w-auto sm:space-y-5">


                            {/* Pending */}

                            <div className="flex items-center justify-between gap-4 sm:gap-8">

                                <div className="flex items-center gap-3">

                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>

                                    <span className="text-gray-700">
                                        Pending
                                    </span>

                                </div>

                                <div>

                                    <span className="font-semibold">
                                        {pendingApplications}
                                    </span>

                                    <span className="text-sm text-gray-400 ml-2">
                                        {pendingPercentage.toFixed(0)}%
                                    </span>

                                </div>

                            </div>


                            {/* Accepted */}

                            <div className="flex items-center justify-between gap-4 sm:gap-8">

                                <div className="flex items-center gap-3">

                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>

                                    <span className="text-gray-700">
                                        Accepted
                                    </span>

                                </div>

                                <div>

                                    <span className="font-semibold">
                                        {acceptedApplications}
                                    </span>

                                    <span className="text-sm text-gray-400 ml-2">
                                        {acceptedPercentage.toFixed(0)}%
                                    </span>

                                </div>

                            </div>


                            {/* Rejected */}

                            <div className="flex items-center justify-between gap-4 sm:gap-8">

                                <div className="flex items-center gap-3">

                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>

                                    <span className="text-gray-700">
                                        Rejected
                                    </span>

                                </div>

                                <div>

                                    <span className="font-semibold">
                                        {rejectedApplications}
                                    </span>

                                    <span className="text-sm text-gray-400 ml-2">
                                        {rejectedPercentage.toFixed(0)}%
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                RECENT APPLICATIONS
            ========================= */}

            <div className="mt-6 rounded-2xl border bg-white shadow-sm sm:mt-8">


                {/* HEADER */}

                <div className="flex items-center justify-between gap-4 border-b p-4 sm:p-6">

                    <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Recent Applications
                    </h2>

                    <button
                        onClick={() => navigate("/my-applications")}
                        className="shrink-0 text-blue-600 hover:underline"
                    >
                        View All
                    </button>

                </div>


                {/* APPLICATION LIST */}

                <div className="divide-y">

                    {
                        dashboard.recentApplications.length === 0 ? (

                            <div className="p-6 text-center sm:p-10">

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
                                        className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-5"
                                    >

                                        {/* JOB INFO */}

                                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                                            {
                                                application.job?.company?.logo && (

                                                    <img
                                                        src={
                                                            application.job.company.logo
                                                        }
                                                        alt={
                                                            application.job.company.name
                                                        }
                                                        className="h-12 w-12 shrink-0 rounded-xl border object-cover sm:h-14 sm:w-14"
                                                    />

                                                )
                                            }

                                            <div className="min-w-0">

                                                <h3 className="break-words text-base font-semibold sm:text-lg">
                                                    {application.job?.title}
                                                </h3>

                                                <p className="break-words text-gray-600">
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


                                        {/* STATUS */}

                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">

                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-semibold ${application.status === "Accepted"
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
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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


            {/* =========================
                QUICK ACTIONS
            ========================= */}
            {/* =========================
    QUICK ACTIONS
========================= */}

            <div className="mt-6 sm:mt-8">

                <h2 className="text-xl font-bold text-gray-900 mb-5">
                    Quick Actions
                </h2>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">


                    {/* =========================
            BROWSE JOBS
        ========================= */}

                    <button
                        onClick={() => navigate("/jobs")}
                        className="group bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >

                        <div className="flex items-start justify-between">

                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                                <FaSearch size={25} />

                            </div>

                        </div>


                        <h3 className="text-lg font-bold text-gray-900 mt-4">
                            Browse Jobs
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Find new job opportunities that match your skills.
                        </p>


                        <div className="mt-4 text-blue-600">

                            <FaArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />

                        </div>

                    </button>


                    {/* =========================
            SAVED JOBS
        ========================= */}

                    <button
                        onClick={() => navigate("/saved-jobs")}
                        className="group bg-green-50 border border-green-100 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >

                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">

                            <FaBookmark size={25} />

                        </div>


                        <h3 className="text-lg font-bold text-gray-900 mt-4">
                            Saved Jobs
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            View jobs you saved for later.
                        </p>


                        <div className="mt-4 text-green-600">

                            <FaArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />

                        </div>

                    </button>


                    {/* =========================
            MY APPLICATIONS
        ========================= */}

                    <button
                        onClick={() => navigate("/my-applications")}
                        className="group bg-purple-50 border border-purple-100 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >

                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">

                            <FaBriefcase size={25} />

                        </div>


                        <h3 className="text-lg font-bold text-purple-900 mt-4">
                            My Applications
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Track your applications and their status.
                        </p>


                        <div className="mt-4 text-purple-600">

                            <FaArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />

                        </div>

                    </button>


                    {/* =========================
            PROFILE
        ========================= */}

                    <button
                        onClick={() => navigate("/profile")}
                        className="group bg-orange-50 border border-orange-100 rounded-2xl p-5 text-left hover:shadow-md transition"
                    >

                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">

                            <FaUser size={25} />

                        </div>


                        <h3 className="text-lg font-bold text-orange-900 mt-4">
                            Profile
                        </h3>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            Update your profile and manage your skills.
                        </p>


                        <div className="mt-4 text-orange-600">

                            <FaArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />

                        </div>

                    </button>


                </div>

            </div>

        </div>

    );

}

export default StudentDashboard;

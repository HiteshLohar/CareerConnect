import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function RecruiterAnalytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {

        try {

            const response = await api.get(
                "/dashboard/recruiter/analytics"
            );

            setAnalytics(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load analytics"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchAnalytics();
    }, []);


    if (loading) {

        return (
            <div className="flex justify-center items-center min-h-[60vh] sm:min-h-[70vh] px-4">

                <p className="text-base sm:text-xl text-gray-500 text-center">
                    Loading Analytics...
                </p>

            </div>
        );

    }


    if (!analytics) {

        return (
            <div className="flex justify-center items-center min-h-[60vh] sm:min-h-[70vh] px-4">

                <p className="text-sm sm:text-base text-gray-500 text-center">
                    Unable to load analytics.
                </p>

            </div>
        );

    }


    const totalApplications =
        analytics.applicationStatus.pending +
        analytics.applicationStatus.accepted +
        analytics.applicationStatus.rejected;


    const formatMonth = (month) => {

        const date = new Date(2026, month - 1);

        return date.toLocaleString("en-US", {
            month: "short"
        });

    };


    return (

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">

            {/* Header */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                    Recruiter Analytics
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Track your jobs and application performance.
                </p>

            </div>


            {/* Stats */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">


                {/* Total Applications */}

                <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">

                    <p className="text-sm sm:text-base text-gray-500">
                        Total Applications
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                        {totalApplications}
                    </h2>

                </div>


                {/* Pending */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 sm:p-6">

                    <p className="text-sm sm:text-base text-yellow-700">
                        Pending
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-yellow-700 mt-2">
                        {analytics.applicationStatus.pending}
                    </h2>

                </div>


                {/* Acceptance */}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6">

                    <p className="text-sm sm:text-base text-green-700">
                        Acceptance Rate
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
                        {analytics.acceptanceRate}%
                    </h2>

                </div>


                {/* Rejection */}

                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6">

                    <p className="text-sm sm:text-base text-red-700">
                        Rejection Rate
                    </p>

                    <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">
                        {analytics.rejectionRate}%
                    </h2>

                </div>

            </div>


            {/* Application Status */}

            <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 mt-5 sm:mt-8">

                <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">
                    Application Status
                </h2>

                <div className="space-y-5">


                    {/* Pending */}

                    <div>

                        <div className="flex justify-between items-center gap-3 mb-2 text-sm sm:text-base">

                            <span className="font-medium">
                                Pending
                            </span>

                            <span className="shrink-0">
                                {analytics.applicationStatus.pending}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">

                            <div
                                className="bg-yellow-500 h-2.5 sm:h-3 rounded-full"
                                style={{
                                    width: totalApplications
                                        ? `${(
                                            analytics.applicationStatus.pending /
                                            totalApplications
                                        ) * 100}%`
                                        : "0%"
                                }}
                            />

                        </div>

                    </div>


                    {/* Accepted */}

                    <div>

                        <div className="flex justify-between items-center gap-3 mb-2 text-sm sm:text-base">

                            <span className="font-medium">
                                Accepted
                            </span>

                            <span className="shrink-0">
                                {analytics.applicationStatus.accepted}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">

                            <div
                                className="bg-green-500 h-2.5 sm:h-3 rounded-full"
                                style={{
                                    width: totalApplications
                                        ? `${(
                                            analytics.applicationStatus.accepted /
                                            totalApplications
                                        ) * 100}%`
                                        : "0%"
                                }}
                            />

                        </div>

                    </div>


                    {/* Rejected */}

                    <div>

                        <div className="flex justify-between items-center gap-3 mb-2 text-sm sm:text-base">

                            <span className="font-medium">
                                Rejected
                            </span>

                            <span className="shrink-0">
                                {analytics.applicationStatus.rejected}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3">

                            <div
                                className="bg-red-500 h-2.5 sm:h-3 rounded-full"
                                style={{
                                    width: totalApplications
                                        ? `${(
                                            analytics.applicationStatus.rejected /
                                            totalApplications
                                        ) * 100}%`
                                        : "0%"
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* Top Jobs */}

            <div className="bg-white border rounded-2xl shadow-sm mt-5 sm:mt-8 overflow-hidden">

                <div className="p-4 sm:p-6 border-b">

                    <h2 className="text-lg sm:text-xl font-bold">
                        Top Jobs
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Jobs receiving the most applications.
                    </p>

                </div>


                <div className="divide-y">

                    {analytics.topJobs.length === 0 ? (

                        <div className="p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500">
                            No applications yet.
                        </div>

                    ) : (

                        analytics.topJobs.map((job, index) => (

                            <div
                                key={job._id}
                                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"
                            >

                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                                    <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm sm:text-base">
                                        {index + 1}
                                    </div>

                                    <h3 className="font-semibold text-sm sm:text-base break-words min-w-0">
                                        {job.title}
                                    </h3>

                                </div>

                                <span className="font-semibold text-blue-600 text-sm sm:text-base whitespace-nowrap">
                                    {job.applications} Applications
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* Monthly Applications */}

            <div className="bg-white border rounded-2xl shadow-sm mt-5 sm:mt-8 p-4 sm:p-6">

                <h2 className="text-lg sm:text-xl font-bold">
                    Monthly Applications
                </h2>

                <p className="text-sm sm:text-base text-gray-500 mt-1 mb-5 sm:mb-6">
                    Application activity over time.
                </p>


                <div className="space-y-5">

                    {analytics.monthlyApplications.length === 0 ? (

                        <p className="text-center text-sm sm:text-base text-gray-500 py-6 sm:py-8">
                            No application data available.
                        </p>

                    ) : (

                        analytics.monthlyApplications.map((item) => {

                            const maxApplications = Math.max(
                                ...analytics.monthlyApplications.map(
                                    (data) => data.applications
                                )
                            );

                            const width = maxApplications
                                ? (item.applications / maxApplications) * 100
                                : 0;

                            return (

                                <div
                                    key={`${item.year}-${item.month}`}
                                >

                                    <div className="flex justify-between items-center gap-3 mb-2 text-sm sm:text-base">

                                        <span className="font-medium">
                                            {formatMonth(item.month)} {item.year}
                                        </span>

                                        <span className="shrink-0">
                                            {item.applications}
                                        </span>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">

                                        <div
                                            className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all"
                                            style={{
                                                width: `${width}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

            </div>


            {/* Monthly Jobs */}

            <div className="bg-white border rounded-2xl shadow-sm mt-5 sm:mt-8 p-4 sm:p-6">

                <h2 className="text-lg sm:text-xl font-bold">
                    Monthly Jobs Posted
                </h2>

                <p className="text-sm sm:text-base text-gray-500 mt-1 mb-5 sm:mb-6">
                    Number of jobs posted each month.
                </p>


                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">

                    {analytics.monthlyJobs.length === 0 ? (

                        <p className="text-gray-500 col-span-full text-center py-6 sm:py-8 text-sm sm:text-base">
                            No job data available.
                        </p>

                    ) : (

                        analytics.monthlyJobs.map((item) => (

                            <div
                                key={`${item.year}-${item.month}`}
                                className="border rounded-xl p-3 sm:p-4 text-center min-w-0"
                            >

                                <p className="text-xs sm:text-sm text-gray-500">
                                    {formatMonth(item.month)}
                                </p>

                                <p className="text-xl sm:text-2xl font-bold mt-1.5 sm:mt-2">
                                    {item.jobs}
                                </p>

                                <p className="text-[11px] sm:text-xs text-gray-400">
                                    {item.year}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default RecruiterAnalytics;

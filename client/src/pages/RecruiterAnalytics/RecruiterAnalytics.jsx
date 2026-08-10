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
            <div className="flex justify-center items-center min-h-[70vh]">
                <p className="text-xl text-gray-500">
                    Loading Analytics...
                </p>
            </div>
        );

    }


    if (!analytics) {

        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <p className="text-gray-500">
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

        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Recruiter Analytics
                </h1>

                <p className="text-gray-500 mt-2">
                    Track your jobs and application performance.
                </p>

            </div>


            {/* Stats */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                {/* Total Applications */}

                <div className="bg-white border rounded-2xl shadow-sm p-6">

                    <p className="text-gray-500">
                        Total Applications
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {totalApplications}
                    </h2>

                </div>


                {/* Pending */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">

                    <p className="text-yellow-700">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {analytics.applicationStatus.pending}
                    </h2>

                </div>


                {/* Acceptance */}

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                    <p className="text-green-700">
                        Acceptance Rate
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {analytics.acceptanceRate}%
                    </h2>

                </div>


                {/* Rejection */}

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                    <p className="text-red-700">
                        Rejection Rate
                    </p>

                    <h2 className="text-3xl font-bold text-red-700 mt-2">
                        {analytics.rejectionRate}%
                    </h2>

                </div>

            </div>


            {/* Application Status */}

            <div className="bg-white border rounded-2xl shadow-sm p-6 mt-8">

                <h2 className="text-xl font-bold mb-6">
                    Application Status
                </h2>

                <div className="space-y-5">


                    {/* Pending */}

                    <div>

                        <div className="flex justify-between mb-2">

                            <span className="font-medium">
                                Pending
                            </span>

                            <span>
                                {analytics.applicationStatus.pending}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">

                            <div
                                className="bg-yellow-500 h-3 rounded-full"
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

                        <div className="flex justify-between mb-2">

                            <span className="font-medium">
                                Accepted
                            </span>

                            <span>
                                {analytics.applicationStatus.accepted}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">

                            <div
                                className="bg-green-500 h-3 rounded-full"
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

                        <div className="flex justify-between mb-2">

                            <span className="font-medium">
                                Rejected
                            </span>

                            <span>
                                {analytics.applicationStatus.rejected}
                            </span>

                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">

                            <div
                                className="bg-red-500 h-3 rounded-full"
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

            <div className="bg-white border rounded-2xl shadow-sm mt-8">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Top Jobs
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Jobs receiving the most applications.
                    </p>

                </div>


                <div className="divide-y">

                    {analytics.topJobs.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                            No applications yet.
                        </div>

                    ) : (

                        analytics.topJobs.map((job, index) => (

                            <div
                                key={job._id}
                                className="p-5 flex justify-between items-center"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>

                                    <h3 className="font-semibold">
                                        {job.title}
                                    </h3>

                                </div>

                                <span className="font-semibold text-blue-600">
                                    {job.applications} Applications
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </div>


            {/* Monthly Applications */}

            <div className="bg-white border rounded-2xl shadow-sm mt-8 p-6">

                <h2 className="text-xl font-bold">
                    Monthly Applications
                </h2>

                <p className="text-gray-500 mt-1 mb-6">
                    Application activity over time.
                </p>


                <div className="space-y-5">

                    {analytics.monthlyApplications.length === 0 ? (

                        <p className="text-center text-gray-500 py-8">
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

                                    <div className="flex justify-between mb-2">

                                        <span className="font-medium">
                                            {formatMonth(item.month)} {item.year}
                                        </span>

                                        <span>
                                            {item.applications}
                                        </span>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-4">

                                        <div
                                            className="bg-blue-600 h-4 rounded-full transition-all"
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

            <div className="bg-white border rounded-2xl shadow-sm mt-8 p-6">

                <h2 className="text-xl font-bold">
                    Monthly Jobs Posted
                </h2>

                <p className="text-gray-500 mt-1 mb-6">
                    Number of jobs posted each month.
                </p>


                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">

                    {analytics.monthlyJobs.length === 0 ? (

                        <p className="text-gray-500 col-span-full text-center py-8">
                            No job data available.
                        </p>

                    ) : (

                        analytics.monthlyJobs.map((item) => (

                            <div
                                key={`${item.year}-${item.month}`}
                                className="border rounded-xl p-4 text-center"
                            >

                                <p className="text-sm text-gray-500">
                                    {formatMonth(item.month)}
                                </p>

                                <p className="text-2xl font-bold mt-2">
                                    {item.jobs}
                                </p>

                                <p className="text-xs text-gray-400">
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
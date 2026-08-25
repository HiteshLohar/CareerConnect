import { useEffect, useState } from "react";
import api from "../../services/api";

import { useNavigate } from "react-router-dom";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchApplications = async () => {

        try {

            const response = await api.get("/applications/my-applications");

            setApplications(response.data.applications);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="px-4 py-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
                My Applications
            </h1>

            {applications.length === 0 ? (

                <div className="px-4 py-16 text-center sm:py-20">

                    <h2 className="text-2xl font-semibold text-gray-700">
                        No Applications Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        You haven't applied for any jobs yet.
                    </p>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        Browse Jobs
                    </button>

                </div>

            ) : (

                <div className="space-y-4 sm:space-y-6">

                    {applications.map((application) => (

                        <div
                            key={application._id}
                            className="rounded-2xl border bg-white p-4 shadow-md transition hover:shadow-lg sm:p-6"
                        >

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                {/* Left Side */}

                                <div className="min-w-0">

                                    <h2 className="break-words text-xl font-bold sm:text-2xl">
                                        {application.job.title}
                                    </h2>

                                    <p className="mt-1 break-words text-base text-gray-600 sm:text-lg">
                                        {application.job.company.name}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 sm:gap-6 sm:text-base">

                                        <span>
                                            📍 {application.job.location}
                                        </span>

                                        <span>
                                            💰 ₹ {(application.job.salary / 100000).toFixed(1)} LPA
                                        </span>

                                    </div>

                                    <p className="mt-4 text-sm text-gray-500">
                                        Applied on{" "}
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </p>

                                </div>

                                {/* Right Side */}

                                <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-4">

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold text-white
                        ${application.status === "Accepted"
                                                ? "bg-green-500"
                                                : application.status === "Rejected"
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                            }`}
                                    >
                                        {application.status}
                                    </span>

                                    <button
                                        onClick={() =>
                                            navigate(`/jobs/${application.job._id}`)
                                        }
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                    >
                                        View Job
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );

}

export default MyApplications;

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
            <div className="text-center py-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">

            <h1 className="text-3xl font-bold mb-8">
                My Applications
            </h1>

            <div className="space-y-6">

                {applications.map((application) => (

                    <div
                        key={application._id}
                        className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition p-6"
                    >

                        <div className="flex justify-between items-start">

                            {/* Left Side */}

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {application.job.title}
                                </h2>

                                <p className="text-gray-600 mt-1 text-lg">
                                    {application.job.company.name}
                                </p>

                                <div className="flex gap-6 mt-4 text-gray-500">

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

                            <div className="flex flex-col items-end gap-4">

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
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                >
                                    View Job
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );

}

export default MyApplications;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function Applicants() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);

    const fetchApplicants = async () => {

        try {

            const response = await api.get(
                `/applications/${id}/applicants`
            );

            setApplications(response.data.applications);

        } catch (error) {

            if (error.response?.status === 403) {

                setAccessDenied(true);
                return;

            }

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                Loading...
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">

                <h1 className="text-6xl mb-4">🔒</h1>

                <h2 className="text-3xl font-bold">
                    Access Denied
                </h2>

                <p className="text-gray-500 mt-3">
                    Only recruiters can access this page.
                </p>

                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Browse Jobs
                </button>

            </div>
        );
    }

    const updateStatus = async (applicationId, status) => {

        try {

            await api.patch(
                `/applications/${applicationId}/status`,
                { status }
            );

            setApplications((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? { ...application, status }
                        : application
                )
            );

            toast.success(`Application ${status}`);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Failed to update status"
            );

        }

    };

    return (

        <div className="max-w-6xl mx-auto py-10 px-4">

            <h1 className="text-3xl font-bold mb-8">
                Applicants
            </h1>

            {
                applications.length === 0 ? (

                    <div className="text-center text-gray-500 mt-20">
                        No Applicants Yet
                    </div>

                ) : (

                    <div className="space-y-5">

                        {
                            applications.map((application) => (

                                <div
                                    key={application._id}
                                    className="border rounded-xl shadow-md p-6"
                                >

                                    <h2 className="text-2xl font-bold">
                                        {application.student.fullName}
                                    </h2>

                                    <p>{application.student.email}</p>

                                    <p className="mt-2">
                                        {application.student.headline}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-3">

                                        {
                                            application.student.skills.map((skill) => (

                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                                                >
                                                    {skill}
                                                </span>

                                            ))
                                        }

                                    </div>

                                    <p className="mt-4">
                                        Status :
                                        <span className="font-semibold ml-2">
                                            {application.status}
                                        </span>
                                    </p>

                                    {application.student.resumeUrl && (
                                        <a
                                            href={application.student.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View Resume
                                        </a>
                                    )}

                                    {application.status === "Pending" && (
                                        <div className="flex gap-3 mt-5">

                                            <button
                                                onClick={() => updateStatus(application._id, "Rejected")}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                Reject
                                            </button>

                                            <button
                                                onClick={() => updateStatus(application._id, "Accepted")}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Accept
                                            </button>

                                        </div>
                                    )}

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>

    );
}

export default Applicants;
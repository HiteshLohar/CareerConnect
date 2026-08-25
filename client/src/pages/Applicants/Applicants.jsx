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


    // =====================================
    // FETCH APPLICANTS
    // =====================================

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
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchApplicants();

    }, [id]);


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[70vh]">

                <p className="text-lg sm:text-xl text-gray-600">
                    Loading Applicants...
                </p>

            </div>

        );

    }


    // =====================================
    // ACCESS DENIED
    // =====================================

    if (accessDenied) {

        return (

            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">

                <div className="text-5xl sm:text-6xl mb-4">
                    🔒
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Access Denied
                </h2>

                <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md">
                    Only recruiters can access this page.
                </p>

                <button
                    onClick={() => navigate("/jobs")}
                    className="mt-6 sm:mt-8 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Browse Jobs
                </button>

            </div>

        );

    }


    // =====================================
    // UPDATE APPLICATION STATUS
    // =====================================

    const updateStatus = async (applicationId, status) => {

        try {

            await api.patch(
                `/applications/${applicationId}/status`,
                { status }
            );

            setApplications((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status
                          }
                        : application
                )
            );

            toast.success(`Application ${status}`);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update status"
            );

        }

    };


    return (

        <div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-8 py-6 sm:py-10">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Applicants
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Review and manage applicants for this job
                </p>

            </div>


            {/* =====================================
                NO APPLICANTS
            ===================================== */}

            {applications.length === 0 ? (

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm text-center py-16 sm:py-20 px-4">

                    <div className="text-4xl sm:text-5xl mb-4">
                        📭
                    </div>

                    <p className="text-lg sm:text-xl font-semibold text-gray-700">
                        No Applicants Yet
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Applicants will appear here when candidates apply.
                    </p>

                </div>

            ) : (

                /* =====================================
                   APPLICANTS LIST
                ===================================== */

                <div className="space-y-4 sm:space-y-5">

                    {applications.map((application) => {

                        const student = application.student;

                        return (

                            <div
                                key={application._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 sm:p-6"
                            >


                                {/* =================================
                                    TOP SECTION
                                ================================= */}

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">


                                    {/* STUDENT INFO */}

                                    <div className="min-w-0">

                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                            {student?.fullName ||
                                                "Unknown Student"}
                                        </h2>

                                        <p className="text-sm sm:text-base text-gray-600 break-all mt-1">
                                            {student?.email ||
                                                "No email available"}
                                        </p>

                                        {student?.headline && (

                                            <p className="text-sm sm:text-base text-gray-500 mt-2 break-words">
                                                {student.headline}
                                            </p>

                                        )}

                                    </div>


                                    {/* STATUS */}

                                    <span
                                        className={`self-start shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
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


                                {/* =================================
                                    SKILLS
                                ================================= */}

                                {student?.skills?.length > 0 && (

                                    <div className="mt-4">

                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Skills
                                        </p>

                                        <div className="flex flex-wrap gap-2">

                                            {student.skills.map((skill) => (

                                                <span
                                                    key={skill}
                                                    className="px-2.5 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>

                                            ))}

                                        </div>

                                    </div>

                                )}


                                {/* =================================
                                    DIVIDER
                                ================================= */}

                                <div className="border-t border-gray-100 mt-5 pt-4">


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">


                                        {/* VIEW RESUME */}

                                        {student?.resumeUrl && (

                                            <a
                                                href={student.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto text-center px-4 py-2.5 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
                                            >
                                                View Resume
                                            </a>

                                        )}


                                        {/* ACCEPT / REJECT */}

                                        {application.status === "Pending" && (

                                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            "Rejected"
                                                        )
                                                    }
                                                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            "Accepted"
                                                        )
                                                    }
                                                    className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Accept
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default Applicants;
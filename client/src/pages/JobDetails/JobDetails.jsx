import { FaHeart, FaRegHeart } from "react-icons/fa";

import { toast } from "react-hot-toast";

import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../../services/api";


function JobDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();


    // =========================
    // AUTH STATE
    // =========================

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );


    // =========================
    // STATES
    // =========================

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [applying, setApplying] = useState(false);

    const [applied, setApplied] = useState(false);

    const [saved, setSaved] = useState(false);

    const [saving, setSaving] = useState(false);


    // =========================
    // DEADLINE CHECK
    // =========================

    const isDeadlinePassed =
        job?.deadline
            ? new Date(job.deadline) < new Date()
            : false;


    // =========================
    // CHECK APPLICATION STATUS
    // =========================

    const checkApplicationStatus = async () => {

        try {

            const response = await api.get(
                `/applications/${id}/status`
            );

            setApplied(
                response.data.applied
            );

        } catch (error) {

            console.error(
                "Application status error:",
                error
            );

        }

    };


    // =========================
    // FETCH JOB
    // =========================

    const fetchJob = async () => {

        try {

            setLoading(true);


            const response = await api.get(
                `/jobs/${id}`
            );


            const fetchedJob =
                response.data.job;


            setJob(fetchedJob);


        } catch (error) {

            console.error(
                "Fetch job error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load job"
            );

            setJob(null);

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // GET POSTED TIME
    // =========================

    const getPostedTime = (date) => {

        if (!date) {
            return "Unknown";
        }


        const created = new Date(date);

        const now = new Date();

        const diff = now - created;


        const days = Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        );


        if (days <= 0) {
            return "Today";
        }


        if (days === 1) {
            return "1 day ago";
        }


        return `${days} days ago`;

    };


    // =========================
    // APPLY JOB
    // =========================

    const handleApply = async () => {

        if (!isAuthenticated) {

            toast.error(
                "Please login first"
            );


            navigate(
                `/login?redirect=${encodeURIComponent(
                    location.pathname
                )}`
            );


            return;

        }


        // Extra frontend protection
        if (isDeadlinePassed) {

            toast.error(
                "Application deadline has passed"
            );

            return;

        }


        if (applied) {

            return;

        }


        try {

            setApplying(true);


            const response = await api.post(
                `/applications/${id}/apply`
            );


            toast.success(
                response.data.message
            );


            setApplied(true);


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setApplying(false);

        }

    };


    // =========================
    // CHECK SAVED STATUS
    // =========================

    const checkSavedStatus = async () => {

        try {

            const response = await api.get(
                "/jobs/saved"
            );


            const savedJobs =
                response.data.savedJobs || [];


            const alreadySaved =
                savedJobs.some(
                    (savedJob) =>
                        savedJob._id === id
                );


            setSaved(alreadySaved);


        } catch (error) {

            console.error(
                "Saved status error:",
                error
            );

        }

    };


    // =========================
    // SAVE / UNSAVE JOB
    // =========================

    const handleSaveJob = async () => {

        if (!isAuthenticated) {

            toast.error(
                "Please login first"
            );


            navigate(
                `/login?redirect=${encodeURIComponent(
                    location.pathname
                )}`
            );


            return;

        }


        try {

            setSaving(true);


            if (saved) {

                const response =
                    await api.delete(
                        `/jobs/${id}/save`
                    );


                toast.success(
                    response.data.message
                );


                setSaved(false);


            } else {

                const response =
                    await api.post(
                        `/jobs/${id}/save`
                    );


                toast.success(
                    response.data.message
                );


                setSaved(true);

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {

        fetchJob();


        if (isAuthenticated) {

            checkApplicationStatus();

            checkSavedStatus();

        } else {

            setApplied(false);

            setSaved(false);

        }

    }, [id, isAuthenticated]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading Job...
                    </p>

                </div>

            </div>

        );

    }


    // =========================
    // JOB NOT FOUND
    // =========================

    if (!job) {

        return (

            <div className="min-h-[70vh] flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Job Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        This job may have been removed or is no longer available.
                    </p>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Browse Jobs
                    </button>

                </div>

            </div>

        );

    }


    // =========================
    // SAFE COMPANY DATA
    // =========================

    const companyName =
        job.company?.name ||
        "Company";


    const companyLogo =
        job.company?.logo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            companyName
        )}&background=2563eb&color=fff`;


    // =========================
    // VIEW JOB
    // =========================

    return (

        <div className="max-w-6xl mx-auto px-4 py-10">


            <div className="bg-white rounded-2xl shadow-lg p-8">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="flex items-center gap-6">

                    <img
                        src={companyLogo}
                        alt={companyName}
                        className="w-20 h-20 rounded-xl border object-cover"
                    />


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {job.title}
                        </h1>


                        <p className="text-lg text-gray-600 mt-1">
                            {companyName}
                        </p>

                    </div>

                </div>


                {/* =========================
                    JOB INFO
                ========================= */}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">


                    {/* LOCATION */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Location
                        </p>

                        <p className="font-semibold">
                            {job.location || "Not specified"}
                        </p>

                    </div>


                    {/* SALARY */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Salary
                        </p>

                        <p className="font-semibold text-green-600">

                            ₹{" "}

                            {typeof job.salary === "number"
                                ? (job.salary / 100000).toFixed(1)
                                : "0.0"}

                            {" "}LPA

                        </p>

                    </div>


                    {/* JOB TYPE */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Job Type
                        </p>

                        <p className="font-semibold">
                            {job.jobType || "Not specified"}
                        </p>

                    </div>


                    {/* EXPERIENCE */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Experience
                        </p>

                        <p className="font-semibold">

                            {job.experience ?? 0}

                            {" "}Years

                        </p>

                    </div>


                    {/* VACANCIES */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Vacancies
                        </p>

                        <p className="font-semibold">
                            {job.vacancies ?? 0}
                        </p>

                    </div>


                    {/* POSTED */}

                    <div>

                        <p className="text-gray-500 text-sm">
                            Posted
                        </p>

                        <p className="font-semibold">
                            {getPostedTime(job.createdAt)}
                        </p>

                    </div>

                </div>


                {/* =========================
                    APPLICATION DEADLINE
                ========================= */}

                <div className="mt-8">

                    <h3 className="text-lg font-semibold mb-2">
                        Application Deadline
                    </h3>


                    {job.deadline ? (

                        <p
                            className={
                                isDeadlinePassed
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-700"
                            }
                        >

                            {new Date(
                                job.deadline
                            ).toLocaleDateString()}


                            {isDeadlinePassed && (
                                <span className="ml-2">
                                    (Expired)
                                </span>
                            )}

                        </p>

                    ) : (

                        <p className="text-gray-500">
                            No deadline specified
                        </p>

                    )}

                </div>


                {/* =========================
                    DESCRIPTION
                ========================= */}

                <div className="mt-10">

                    <h2 className="text-2xl font-semibold mb-4">
                        Job Description
                    </h2>


                    <p className="text-gray-700 leading-7 whitespace-pre-line">
                        {job.description || "No description available."}
                    </p>

                </div>


                {/* =========================
                    SKILLS
                ========================= */}

                <div className="mt-10">

                    <h2 className="text-2xl font-semibold mb-4">
                        Required Skills
                    </h2>


                    {job.skills?.length > 0 ? (

                        <div className="flex flex-wrap gap-3">

                            {job.skills.map(
                                (skill) => (

                                    <span
                                        key={skill}
                                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                                    >
                                        {skill}
                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <p className="text-gray-500">
                            No specific skills listed.
                        </p>

                    )}

                </div>


                {/* =========================
                    ACTION BUTTONS
                ========================= */}

                <div className="mt-10 flex gap-4">


                    {/* =========================
                        APPLY BUTTON
                    ========================= */}

                    <div className="flex-1">


                        {isDeadlinePassed ? (

                            <button
                                disabled
                                className="w-full px-5 py-3 bg-gray-400 text-white rounded-xl font-semibold cursor-not-allowed"
                            >
                                Application Closed
                            </button>

                        ) : applied ? (

                            <button
                                disabled
                                className="w-full px-5 py-3 bg-green-600 text-white rounded-xl font-semibold cursor-not-allowed"
                            >
                                Already Applied
                            </button>

                        ) : (

                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className={`w-full px-5 py-3 rounded-xl text-white font-semibold transition ${
                                    applying
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >

                                {applying
                                    ? "Applying..."
                                    : "Apply Now"}

                            </button>

                        )}

                    </div>


                    {/* =========================
                        SAVE BUTTON
                    ========================= */}

                    <button
                        onClick={handleSaveJob}
                        disabled={saving}
                        className={`px-6 py-3 rounded-lg border transition flex items-center gap-2 ${
                            saved
                                ? "bg-red-50 border-red-500 text-red-600"
                                : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                    >

                        {saved ? (
                            <FaHeart />
                        ) : (
                            <FaRegHeart />
                        )}


                        {saving
                            ? "Saving..."
                            : saved
                                ? "Saved"
                                : "Save Job"}

                    </button>

                </div>


            </div>

        </div>

    );

}


export default JobDetails;
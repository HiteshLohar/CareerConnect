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

            <div className="flex min-h-[70vh] items-center justify-center px-4">

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

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <div className="max-w-md text-center">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Job Not Found
                    </h2>

                    <p className="mt-2 text-gray-500">
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

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">


            <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="flex min-w-0 items-center gap-4 sm:gap-6">

                    <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-14 w-14 shrink-0 rounded-xl border object-cover sm:h-20 sm:w-20"
                    />


                    <div className="min-w-0">

                        <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                            {job.title}
                        </h1>


                        <p className="mt-1 break-words text-base text-gray-600 sm:text-lg">
                            {companyName}
                        </p>

                    </div>

                </div>


                {/* =========================
                    JOB INFO
                ========================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">


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

                <div className="mt-8 sm:mt-10">

                    <h2 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                        Job Description
                    </h2>


                    <p className="break-words whitespace-pre-line leading-7 text-gray-700">
                        {job.description || "No description available."}
                    </p>

                </div>


                {/* =========================
                    SKILLS
                ========================= */}

                <div className="mt-8 sm:mt-10">

                    <h2 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                        Required Skills
                    </h2>


                    {job.skills?.length > 0 ? (

                        <div className="flex flex-wrap gap-2 sm:gap-3">

                            {job.skills.map(
                                (skill) => (

                                    <span
                                        key={skill}
                                        className="break-words rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-700 sm:px-4"
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

                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">


                    {/* =========================
                        APPLY BUTTON
                    ========================= */}

                    <div className="w-full flex-1">


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
                        className={`flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 transition sm:w-auto ${
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FiHeart,
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiClock
} from "react-icons/fi";

import api from "../../services/api";

function JobCard({ job }) {

    const navigate = useNavigate();

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const [applied, setApplied] = useState(false);
    const [applying, setApplying] = useState(false);


    // =========================
    // CHECK APPLICATION CLOSED
    // =========================

    const isApplicationClosed =
        job.deadline &&
        new Date(job.deadline) < new Date();


    // =========================
    // FORMAT SALARY
    // =========================

    const formatSalary = (salary) => {

        return `₹ ${(salary / 100000).toFixed(1)} LPA`;

    };


    // =========================
    // GET POSTED TIME
    // =========================

    const getPostedTime = (date) => {

        const created = new Date(date);
        const now = new Date();

        const diff = now - created;

        const days = Math.floor(
            diff / (1000 * 60 * 60 * 24)
        );

        if (days === 0) {
            return "Today";
        }

        if (days === 1) {
            return "1 day ago";
        }

        return `${days} days ago`;

    };


    // =========================
    // CHECK APPLICATION STATUS
    // =========================

    useEffect(() => {

        const checkApplicationStatus = async () => {

            try {

                const response = await api.get(
                    `/applications/${job._id}/status`
                );

                setApplied(response.data.applied);

            } catch (error) {

                setApplied(false);

            }

        };

        checkApplicationStatus();

    }, [job._id]);


    // =========================
    // CHECK SAVED JOB
    // =========================

    useEffect(() => {

        const checkSavedJob = async () => {

            try {

                const response = await api.get(
                    "/jobs/saved"
                );

                const savedJobs =
                    response.data.savedJobs || [];

                const isJobSaved = savedJobs.some(
                    (savedJob) =>
                        savedJob._id === job._id
                );

                setSaved(isJobSaved);

            } catch (error) {

                console.log(
                    "Failed to check saved job:",
                    error
                );

            }

        };

        checkSavedJob();

    }, [job._id]);


    // =========================
    // APPLY JOB
    // =========================

    const handleApply = async () => {

        if (isApplicationClosed) {

            toast.error(
                "Application deadline has passed"
            );

            return;

        }

        try {

            setApplying(true);

            const response = await api.post(
                `/applications/${job._id}/apply`
            );

            setApplied(true);

            toast.success(
                response.data.message
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to apply for this job"
            );

        } finally {

            setApplying(false);

        }

    };


    // =========================
    // SAVE / REMOVE JOB
    // =========================

    const handleSaveJob = async () => {

        try {

            setSaving(true);

            if (saved) {

                await api.delete(
                    `/jobs/${job._id}/save`
                );

                setSaved(false);

                toast.success(
                    "Job removed from saved jobs"
                );

            } else {

                await api.post(
                    `/jobs/${job._id}/save`
                );

                setSaved(true);

                toast.success(
                    "Job saved successfully"
                );

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update saved job"
            );

        } finally {

            setSaving(false);

        }

    };


    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-md
                p-4
                sm:p-5
                lg:p-6
                transition-all
                duration-300
                hover:shadow-xl
                lg:hover:shadow-2xl
                lg:hover:-translate-y-2
                flex
                flex-col
                h-full
            "
        >


            {/* =========================
                COMPANY INFO
            ========================= */}

            <div className="flex justify-between items-start gap-3">

                <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                    {job.company?.logo ? (

                        <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="
                                w-11 h-11
                                sm:w-12 sm:h-12
                                lg:w-14 lg:h-14
                                rounded-xl
                                border
                                object-cover
                                shrink-0
                            "
                        />

                    ) : (

                        <div
                            className="
                                w-11 h-11
                                sm:w-12 sm:h-12
                                lg:w-14 lg:h-14
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-lg
                                shrink-0
                            "
                        >
                            {job.company?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                    )}


                    <div className="min-w-0">

                        <h2
                            className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-gray-900
                                line-clamp-2
                                break-words
                            "
                        >
                            {job.title}
                        </h2>

                        <p
                            className="
                                text-sm
                                sm:text-base
                                text-gray-500
                                truncate
                                mt-0.5
                            "
                        >
                            {job.company?.name || "Unknown Company"}
                        </p>

                    </div>

                </div>


                {/* =========================
                    SAVE JOB
                ========================= */}

                <button
                    onClick={handleSaveJob}
                    disabled={saving}
                    aria-label={
                        saved
                            ? "Remove saved job"
                            : "Save job"
                    }
                    className="
                        p-2
                        rounded-full
                        hover:bg-red-50
                        transition
                        group
                        disabled:opacity-50
                        shrink-0
                    "
                >

                    <FiHeart
                        size={20}
                        className={
                            saved
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400 group-hover:text-red-500"
                        }
                    />

                </button>

            </div>


            {/* =========================
                JOB DETAILS
            ========================= */}

            <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">


                {/* Location */}

                <div className="flex items-start gap-2 text-gray-600 min-w-0">

                    <FiMapPin
                        className="text-blue-600 mt-0.5 shrink-0"
                    />

                    <span className="text-sm sm:text-base break-words">
                        {job.location || "Location not specified"}
                    </span>

                </div>


                {/* Job Type */}

                <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2 text-gray-600 min-w-0">

                        <FiBriefcase className="text-blue-600 shrink-0" />

                        <span className="text-sm sm:text-base truncate">
                            {job.jobType}
                        </span>

                    </div>

                    <span
                        className="
                            bg-blue-100
                            text-blue-700
                            text-xs
                            sm:text-sm
                            font-medium
                            px-2.5
                            sm:px-3
                            py-1
                            rounded-full
                            whitespace-nowrap
                            shrink-0
                        "
                    >
                        {job.jobType}
                    </span>

                </div>


                {/* Salary */}

                <div className="flex items-center gap-2">

                    <FiDollarSign className="text-blue-600 shrink-0" />

                    <span className="font-semibold text-green-600 text-sm sm:text-base">
                        {formatSalary(job.salary)}
                    </span>

                </div>


                {/* Posted Time */}

                <div className="flex items-center gap-2 text-gray-600">

                    <FiClock className="text-blue-600 shrink-0" />

                    <span className="text-sm sm:text-base">
                        {getPostedTime(job.createdAt)}
                    </span>

                </div>


                {/* Application Closed */}

                {isApplicationClosed && (

                    <div className="flex items-start gap-2 text-red-600 text-sm font-semibold">

                        <FiClock className="mt-0.5 shrink-0" />

                        <span>
                            Application Closed
                        </span>

                    </div>

                )}

            </div>


            {/* =========================
                BUTTONS
            ========================= */}

            <div className="mt-5 sm:mt-6 pt-1 flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-auto">


                {/* View Details */}

                <button
                    onClick={() =>
                        navigate(`/jobs/${job._id}`)
                    }
                    className="
                        w-full
                        sm:flex-1
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        py-2.5
                        sm:py-2
                        rounded-lg
                        text-sm
                        sm:text-base
                        transition
                        duration-300
                    "
                >
                    View Details
                </button>


                {/* Apply */}

                <button
                    onClick={handleApply}
                    disabled={
                        applying ||
                        applied ||
                        isApplicationClosed
                    }
                    className={`
                        w-full
                        sm:flex-1
                        py-2.5
                        sm:py-2
                        rounded-lg
                        text-sm
                        sm:text-base
                        transition
                        duration-300
                        ${
                            isApplicationClosed
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : applied
                                ? "bg-green-500 text-white cursor-not-allowed"
                                : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        }
                    `}
                >

                    {applying
                        ? "Applying..."
                        : isApplicationClosed
                        ? "Application Closed"
                        : applied
                        ? "Applied"
                        : "Apply Now"
                    }

                </button>

            </div>

        </div>

    );

}

export default JobCard;
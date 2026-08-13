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

        // Application deadline check

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

        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">


            {/* =========================
                COMPANY INFO
            ========================= */}

            <div className="flex justify-between items-start">

                <div className="flex items-center gap-4">

                    <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-14 h-14 rounded-xl border object-cover"
                    />

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            {job.title}
                        </h2>

                        <p className="text-gray-500">
                            {job.company.name}
                        </p>

                    </div>

                </div>


                {/* =========================
                    SAVE JOB
                ========================= */}

                <button
                    onClick={handleSaveJob}
                    disabled={saving}
                    className="p-2 rounded-full hover:bg-red-50 transition group disabled:opacity-50"
                >

                    <FiHeart
                        size={22}
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

            <div className="mt-6 space-y-4">


                {/* Location */}

                <div className="flex items-center gap-2 text-gray-600">

                    <FiMapPin className="text-blue-600" />

                    <span>
                        {job.location}
                    </span>

                </div>


                {/* Job Type */}

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-gray-600">

                        <FiBriefcase className="text-blue-600" />

                        <span>
                            {job.jobType}
                        </span>

                    </div>

                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">

                        {job.jobType}

                    </span>

                </div>


                {/* Salary */}

                <div className="flex items-center gap-2">

                    <FiDollarSign className="text-blue-600" />

                    <span className="font-semibold text-green-600">

                        {formatSalary(job.salary)}

                    </span>

                </div>


                {/* Posted Time */}

                <div className="flex items-center gap-2 text-gray-600">

                    <FiClock className="text-blue-600" />

                    <span>
                        {getPostedTime(job.createdAt)}
                    </span>

                </div>


                {/* Application Status */}

                {isApplicationClosed && (

                    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">

                        <FiClock />

                        <span>
                            Application Closed
                        </span>

                    </div>

                )}

            </div>


            {/* =========================
                BUTTONS
            ========================= */}

            <div className="mt-6 flex gap-3">


                {/* View Details */}

                <button
                    onClick={() =>
                        navigate(`/jobs/${job._id}`)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
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
                    className={`flex-1 py-2 rounded-lg transition duration-300 ${
                        isApplicationClosed
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : applied
                                ? "bg-green-500 text-white cursor-not-allowed"
                                : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
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
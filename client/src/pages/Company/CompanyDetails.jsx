import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FiArrowLeft,
    FiMapPin,
    FiGlobe,
    FiBriefcase,
    FiDollarSign,
    FiClock,
    FiCode,
    FiExternalLink,
    FiUsers
} from "react-icons/fi";

import api from "../../services/api";

function CompanyDetails() {

    const { id } = useParams();

    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // FORMAT SALARY
    // =========================

    const formatSalary = (salary) => {

        if (!salary) {
            return "Salary not specified";
        }

        return `₹ ${(salary / 100000).toFixed(1)} LPA`;

    };


    // =========================
    // GET POSTED TIME
    // =========================

    const getPostedTime = (date) => {

        if (!date) {
            return "Recently posted";
        }

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
    // FETCH COMPANY + JOBS
    // =========================

    const fetchCompany = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/companies/browse/${id}`
            );

            setCompany(
                response.data.company
            );

            setJobs(
                response.data.jobs || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch company:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch company"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchCompany();

    }, [id]);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center">

                <div className="flex items-center gap-3 text-gray-500">

                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                    <span className="text-lg">
                        Loading company...
                    </span>

                </div>

            </div>

        );

    }


    // =========================
    // COMPANY NOT FOUND
    // =========================

    if (!company) {

        return (

            <div className="min-h-[60vh] flex flex-col items-center justify-center">

                <h2 className="text-2xl font-bold text-gray-800">
                    Company Not Found
                </h2>

                <Link
                    to="/companies/browse"
                    className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <FiArrowLeft size={18} />
                    Back to Companies
                </Link>

            </div>

        );

    }


    return (

        <div className="max-w-6xl mx-auto px-4 py-10">


            {/* =========================
                BACK BUTTON
            ========================= */}

            <Link
                to="/companies/browse"
                className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 transition"
            >

                <FiArrowLeft size={18} />

                Back to Companies

            </Link>


            {/* =========================
                COMPANY HEADER
            ========================= */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                <div className="flex flex-col md:flex-row md:items-center gap-6">


                    {/* COMPANY LOGO */}

                    <img
                        src={
                            company.logo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                company.name
                            )}&background=2563eb&color=fff`
                        }
                        alt={company.name}
                        className="w-28 h-28 rounded-2xl object-cover border"
                    />


                    {/* COMPANY INFO */}

                    <div className="flex-1">

                        <h1 className="text-3xl font-bold text-gray-900">
                            {company.name}
                        </h1>


                        {/* LOCATION */}

                        <div className="flex items-center gap-2 text-gray-500 mt-3">

                            <FiMapPin
                                className="text-blue-600"
                                size={18}
                            />

                            <span>
                                {company.location ||
                                    "Location not added"}
                            </span>

                        </div>


                        {/* WEBSITE */}

                        {company.website && (

                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 hover:underline"
                            >

                                <FiGlobe size={18} />

                                <span>
                                    Visit Company Website
                                </span>

                                <FiExternalLink size={15} />

                            </a>

                        )}

                    </div>

                </div>


                {/* =========================
                    COMPANY DESCRIPTION
                ========================= */}

                <div className="mt-8 pt-8 border-t border-gray-100">

                    <h2 className="text-xl font-bold text-gray-900">
                        About Company
                    </h2>

                    <p className="text-gray-600 mt-3 leading-7">
                        {company.description ||
                            "No company description available."}
                    </p>

                </div>

            </div>


            {/* =========================
                OPEN POSITIONS
            ========================= */}

            <div className="mt-8">


                {/* SECTION HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Open Positions
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Explore active job opportunities at{" "}
                            {company.name}.
                        </p>

                    </div>


                    {/* JOB COUNT */}

                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">

                        <FiBriefcase size={18} />

                        <span>
                            {jobs.length}{" "}
                            {jobs.length === 1
                                ? "Position"
                                : "Positions"}
                        </span>

                    </div>

                </div>


                {/* =========================
                    NO JOBS
                ========================= */}

                {jobs.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

                        <div className="flex justify-center mb-4">

                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">

                                <FiBriefcase
                                    size={26}
                                    className="text-gray-400"
                                />

                            </div>

                        </div>

                        <h3 className="text-xl font-semibold text-gray-800">
                            No Open Positions
                        </h3>

                        <p className="text-gray-500 mt-2">
                            This company currently has no active job openings.
                        </p>

                    </div>

                ) : (


                    /* =========================
                        JOB GRID
                    ========================= */

                    < div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {jobs.map((job) => (

                            <div
                                key={job._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300"
                            >

                                {/* JOB HEADER */}

                                <div className="flex justify-between items-start gap-3">

                                    <div>

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {job.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {company.name}
                                        </p>

                                    </div>

                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">

                                        <FiBriefcase
                                            size={18}
                                            className="text-blue-600"
                                        />

                                    </div>

                                </div>


                                {/* JOB DETAILS */}

                                <div className="mt-4 space-y-2.5">

                                    <div className="flex items-center gap-2 text-gray-600 text-sm">

                                        <FiMapPin
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        <span>
                                            {job.location}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 text-gray-600 text-sm">

                                        <FiBriefcase
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        <span>
                                            {job.jobType}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 text-green-600 text-sm">

                                        <FiDollarSign size={16} />

                                        <span className="font-semibold">
                                            {formatSalary(job.salary)}
                                        </span>

                                    </div>


                                    <div className="flex items-center gap-2 text-gray-600 text-sm">

                                        <FiUsers
                                            size={16}
                                            className="text-blue-600"
                                        />

                                        <span>
                                            {job.experience}{" "}
                                            {job.experience === 1
                                                ? "year"
                                                : "years"}{" "}
                                            experience
                                        </span>

                                    </div>

                                </div>


                                {/* SKILLS */}

                                {job.skills?.length > 0 && (

                                    <div className="mt-4">

                                        <div className="flex flex-wrap gap-1.5">

                                            {job.skills.map(
                                                (skill, index) => (

                                                    <span
                                                        key={index}
                                                        className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* VIEW JOB BUTTON */}

                                <div className="mt-5">

                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    >

                                        <span>
                                            View Job
                                        </span>

                                        <FiExternalLink size={15} />

                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div >

    );

}

export default CompanyDetails;
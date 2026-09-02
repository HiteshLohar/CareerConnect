import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import api from "../services/api";
import JobCard from "../components/jobs/JobCard";
import Loader from "../components/common/Loader";

function Home() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ========================================
    // AUTH STATE
    // ========================================

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );


    // ========================================
    // FETCH LATEST JOBS
    // ========================================

    const fetchLatestJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get("/jobs", {
                params: {
                    page: 1,
                    limit: 6,
                    sort: "latest"
                }
            });

            setJobs(response.data.jobs || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to fetch latest jobs"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchLatestJobs();
    }, []);


    return (

        <div className="min-h-screen bg-gray-50">

            {/* ========================================
                HERO SECTION
            ======================================== */}

            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

                    <div className="mx-auto max-w-3xl text-center">

                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                            Welcome to CareerConnect
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                            Find Your

                            <span className="text-blue-600">
                                {" "}Dream Job
                            </span>

                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">

                            Discover opportunities, connect with great
                            companies, and take the next step in your career.

                        </p>


                        {/* ========================================
                            HERO BUTTONS
                        ======================================== */}

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link
                                to="/jobs"
                                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Browse Jobs
                            </Link>


                            {/* CREATE ACCOUNT
                                ONLY FOR LOGGED-OUT USERS
                            */}

                            {!isAuthenticated && (

                                <Link
                                    to="/register"
                                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                >
                                    Create Account
                                </Link>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================
                JOB SEARCH
            ======================================== */}

            <section className="relative -mt-5 px-4 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-5xl rounded-xl border bg-white p-4 shadow-md sm:p-5">

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">

                        <input
                            type="text"
                            placeholder="Job title, skills or keywords"
                            className="rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            className="rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <Link
                            to="/jobs"
                            className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Search Jobs
                        </Link>

                    </div>

                </div>

            </section>


            {/* ========================================
                LATEST JOBS
            ======================================== */}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-sm font-semibold text-blue-600">
                            OPPORTUNITIES
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Latest Jobs
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Explore the latest opportunities posted by recruiters.
                        </p>

                    </div>


                    <Link
                        to="/jobs"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        View All Jobs →
                    </Link>

                </div>


                {/* ========================================
                    JOBS
                ======================================== */}

                {loading ? (

                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>

                ) : jobs.length === 0 ? (

                    <div className="rounded-xl border bg-white px-5 py-12 text-center">

                        <h3 className="text-lg font-semibold text-gray-900">
                            No jobs available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Check back later for new opportunities.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {jobs.map((job) => (

                            <JobCard
                                key={job._id}
                                job={job}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* ========================================
                WHY CAREERCONNECT
            ======================================== */}

            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="text-sm font-semibold text-blue-600">
                            WHY CAREERCONNECT
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Everything You Need to Build Your Career
                        </h2>

                    </div>


                    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">

                        {/* CARD 1 */}

                        <div className="rounded-xl border p-6 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                                🎯
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-900">
                                Find Right Jobs
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Discover job opportunities that match your
                                skills and career goals.
                            </p>

                        </div>


                        {/* CARD 2 */}

                        <div className="rounded-xl border p-6 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                                🏢
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-900">
                                Connect with Companies
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Explore companies and discover exciting
                                opportunities from recruiters.
                            </p>

                        </div>


                        {/* CARD 3 */}

                        <div className="rounded-xl border p-6 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                                🚀
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-900">
                                Grow Your Career
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Apply for jobs and move one step closer
                                to your career goals.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================
                CTA
            ======================================== */}

            <section className="bg-blue-600">

                <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">

                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Ready to Find Your Next Opportunity?
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                        Start exploring jobs and take the next step in
                        your career today.
                    </p>

                    <Link
                        to="/jobs"
                        className="mt-7 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100"
                    >
                        Explore Jobs
                    </Link>

                </div>

            </section>

        </div>

    );

}

export default Home;
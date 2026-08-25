import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import api from "../../services/api";

function SavedJobs() {

    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchSavedJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get("/jobs/saved");

            setSavedJobs(response.data.savedJobs);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRemove = async (jobId) => {

        try {

            const response = await api.delete(`/jobs/${jobId}/save`);

            toast.success(response.data.message);

            setSavedJobs((prev) =>
                prev.filter((job) => job._id !== jobId)
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        }

    };

    useEffect(() => {

        fetchSavedJobs();

    }, []);

    if (loading) {

        return (
            <div className="px-4 py-20 text-center text-lg sm:text-xl">
                Loading Saved Jobs...
            </div>
        );

    }

    return (

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            <h1 className="mb-5 text-2xl font-bold sm:mb-6 sm:text-3xl">
                Saved Jobs
            </h1>

            <div className="grid gap-4 sm:gap-6">

                {
                    savedJobs.map((job) => (

                        <div
                            key={job._id}
                            className="flex flex-col gap-5 rounded-xl bg-white p-4 shadow-md sm:p-6 md:flex-row md:items-center md:justify-between"
                        >

                            <div className="min-w-0">

                                <h2 className="break-words text-lg font-bold sm:text-xl">
                                    {job.title}
                                </h2>

                                <p className="mt-1 break-words text-gray-600">
                                    {job.company.name}
                                </p>

                                <p className="text-gray-500 mt-2">
                                    📍 {job.location}
                                </p>

                                <p className="text-green-600 font-semibold mt-1">
                                    ₹ {(job.salary / 100000).toFixed(1)} LPA
                                </p>

                            </div>

                            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">

                                <button
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                    className="w-full rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 sm:w-auto"
                                >
                                    View Details
                                </button>

                                <button
                                    onClick={() => handleRemove(job._id)}
                                    className="w-full rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 sm:w-auto"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default SavedJobs;

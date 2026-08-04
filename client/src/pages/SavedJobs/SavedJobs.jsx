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
            <div className="text-center py-20 text-xl">
                Loading Saved Jobs...
            </div>
        );

    }

    return (

        <div className="max-w-6xl mx-auto py-10">

            <h1 className="text-3xl font-bold mb-6">
                Saved Jobs
            </h1>

            <div className="grid gap-6">

                {
                    savedJobs.map((job) => (

                        <div
                            key={job._id}
                            className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center"
                        >

                            <div>

                                <h2 className="text-xl font-bold">
                                    {job.title}
                                </h2>

                                <p className="text-gray-600 mt-1">
                                    {job.company.name}
                                </p>

                                <p className="text-gray-500 mt-2">
                                    📍 {job.location}
                                </p>

                                <p className="text-green-600 font-semibold mt-1">
                                    ₹ {(job.salary / 100000).toFixed(1)} LPA
                                </p>

                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    View Details
                                </button>

                                <button
                                    onClick={() => handleRemove(job._id)}
                                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
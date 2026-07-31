import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

function JobDetails() {

    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJob = async () => {

        try {

            setLoading(true);

            const response = await api.get(`/jobs/${id}`);

            setJob(response.data.job);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20 text-xl">
                Loading Job...
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-20 text-red-500 text-xl">
                Job Not Found
            </div>
        );
    }

    const getPostedTime = (date) => {

        const created = new Date(date);
        const now = new Date();

        const diff = now - created;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";

        if (days === 1) return "1 day ago";

        return `${days} days ago`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}

                <div className="flex items-center gap-6">

                    <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-20 h-20 rounded-xl border object-cover"
                    />

                    <div>

                        <h1 className="text-3xl font-bold">
                            {job.title}
                        </h1>

                        <p className="text-lg text-gray-600 mt-1">
                            {job.company.name}
                        </p>

                    </div>

                </div>

                {/* Job Info */}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">

                    <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="font-semibold">{job.location}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Salary</p>
                        <p className="font-semibold text-green-600">
                            ₹ {(job.salary / 100000).toFixed(1)} LPA
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Job Type</p>
                        <p className="font-semibold">{job.jobType}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Experience</p>
                        <p className="font-semibold">
                            {job.experience} Years
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Vacancies</p>
                        <p className="font-semibold">
                            {job.vacancies}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Posted</p>
                        <p className="font-semibold">
                            {getPostedTime(job.createdAt)}
                        </p>
                    </div>

                </div>

                <div className="mt-8">

                    <h3 className="text-lg font-semibold mb-2">
                        Application Deadline
                    </h3>

                    <p className="text-gray-700">
                        {new Date(job.deadline).toLocaleDateString()}
                    </p>

                </div>

                {/* Description */}

                <div className="mt-10">

                    <h2 className="text-2xl font-semibold mb-4">
                        Job Description
                    </h2>

                    <p className="text-gray-700 leading-7">
                        {job.description}
                    </p>

                </div>

                {/* Skills */}

                <div className="mt-10">

                    <h2 className="text-2xl font-semibold mb-4">
                        Required Skills
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {job.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}

                    </div>

                </div>



                {/* Apply Button */}

                <div className="mt-10">

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition">
                        Apply Now
                    </button>

                </div>

            </div>

        </div>
    );

}

export default JobDetails;
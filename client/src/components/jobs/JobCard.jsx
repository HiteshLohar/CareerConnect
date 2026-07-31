import { useNavigate } from "react-router-dom";

import {
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiClock,
    FiHeart,
} from "react-icons/fi";

function JobCard({ job }) {

    const navigate = useNavigate();

    const formatSalary = (salary) => {
        return `₹ ${(salary / 100000).toFixed(1)} LPA`;
    };

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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">

            {/* Company Info */}

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

                <button className="p-2 rounded-full hover:bg-red-50 transition group">

                    <FiHeart
                        size={22}
                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                    />

                </button>

            </div>

            {/* Job Details */}

            <div className="mt-6 space-y-4">

                <div className="flex items-center gap-2 text-gray-600">

                    <FiMapPin className="text-blue-600" />

                    <span>{job.location}</span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-gray-600">

                        <FiBriefcase className="text-blue-600" />

                        <span>{job.jobType}</span>

                    </div>

                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">

                        {job.jobType}

                    </span>

                </div>

                <div className="flex items-center gap-2">

                    <FiDollarSign className="text-blue-600" />

                    <span className="font-semibold text-green-600">

                        {formatSalary(job.salary)}

                    </span>

                </div>

                <div className="flex items-center gap-2 text-gray-600">

                    <FiClock className="text-blue-600" />

                    <span>

                        {getPostedTime(job.createdAt)}

                    </span>

                </div>

            </div>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">

                <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
                >
                    View Details
                </button>

                <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition duration-300">

                    Apply Now

                </button>

            </div>

        </div>
    );
}

export default JobCard;
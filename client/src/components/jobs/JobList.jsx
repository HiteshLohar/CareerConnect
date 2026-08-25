import JobCard from "./JobCard";

function JobList({ jobs, loading }) {

    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="flex justify-center items-center py-16 sm:py-20 px-4">

                <p className="text-lg sm:text-xl text-gray-600 text-center">
                    Loading Jobs...
                </p>

            </div>

        );

    }


    // =====================================
    // NO JOBS
    // =====================================

    if (jobs.length === 0) {

        return (

            <div className="flex justify-center items-center py-16 sm:py-20 px-4">

                <div className="text-center">

                    <div className="text-4xl sm:text-5xl mb-3">
                        🔍
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                        No Jobs Found
                    </h2>

                    <p className="text-sm sm:text-base text-gray-500 mt-2">
                        Try changing your search or filters.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================
    // JOB LIST
    // =====================================

    return (

        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-3
                gap-4
                sm:gap-5
                lg:gap-6
                w-full
            "
        >

            {jobs.map((job) => (

                <JobCard
                    key={job._id}
                    job={job}
                />

            ))}

        </div>

    );

}

export default JobList;
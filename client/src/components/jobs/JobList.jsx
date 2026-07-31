import JobCard from "./JobCard";

function JobList({ jobs, loading }) {

    if (loading) {
        return <h2>Loading Jobs...</h2>;
    }

    if (jobs.length === 0) {
        return <h2>No Jobs Found</h2>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
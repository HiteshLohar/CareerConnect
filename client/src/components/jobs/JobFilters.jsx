function JobFilters({
    location,
    setLocation,
    jobType,
    setJobType,
    experience,
    setExperience,
    minSalary,
    setMinSalary,
}) {

    return (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">

            <h2 className="text-lg font-semibold mb-4">
                Filters
            </h2>

            {/* Location */}

            <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
            >
                <option value="">All Locations</option>
                <option>Bangalore</option>
                <option>Pune</option>
                <option>Hyderabad</option>
                <option>Mumbai</option>
            </select>

            {/* Job Type */}

            <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
            >
                <option value="">All Job Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Remote</option>
            </select>

            {/* Experience */}

            <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
            >
                <option value="">Any Experience</option>
                <option>Fresher</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>5</option>
            </select>

            {/* Salary */}

            <select
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full border rounded-lg p-3"
            >
                <option value="">Any Salary</option>
                <option value="300000">3 LPA+</option>
                <option value="500000">5 LPA+</option>
                <option value="1000000">10 LPA+</option>
                <option value="1500000">15 LPA+</option>
            </select>

        </div>
    );
}

export default JobFilters;
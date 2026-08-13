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
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">

            <div className="flex items-center justify-between mb-3">

                <h2 className="text-base font-semibold text-gray-900">
                    Filters
                </h2>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                {/* Location */}

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="">
                        All Locations
                    </option>

                    <option>
                        Bangalore
                    </option>

                    <option>
                        Pune
                    </option>

                    <option>
                        Hyderabad
                    </option>

                    <option>
                        Mumbai
                    </option>

                </select>


                {/* Job Type */}

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="">
                        All Job Types
                    </option>

                    <option>
                        Full-time
                    </option>

                    <option>
                        Part-time
                    </option>

                    <option>
                        Internship
                    </option>

                    <option>
                        Remote
                    </option>

                </select>


                {/* Experience */}

                <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="">
                        Any Experience
                    </option>

                    <option value="0">
                        Fresher
                    </option>

                    <option value="1">
                        1 Year+
                    </option>

                    <option value="2">
                        2 Years+
                    </option>

                    <option value="3">
                        3 Years+
                    </option>

                    <option value="5">
                        5 Years+
                    </option>

                </select>


                {/* Salary */}

                <select
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >

                    <option value="">
                        Any Salary
                    </option>

                    <option value="300000">
                        3 LPA+
                    </option>

                    <option value="500000">
                        5 LPA+
                    </option>

                    <option value="1000000">
                        10 LPA+
                    </option>

                    <option value="1500000">
                        15 LPA+
                    </option>

                </select>

            </div>

        </div>
    );
}

export default JobFilters;
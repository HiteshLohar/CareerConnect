import { useState } from "react";
import { FiChevronDown, FiFilter } from "react-icons/fi";

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

    const [showFilters, setShowFilters] = useState(false);


    // =====================================
    // ACTIVE FILTER COUNT
    // =====================================

    const activeFilters = [
        location,
        jobType,
        experience,
        minSalary,
    ].filter(Boolean).length;


    const selectClass = `
        w-full
        border
        border-gray-300
        rounded-lg
        px-3
        py-2.5
        text-sm
        text-gray-700
        bg-white
        outline-none
        cursor-pointer
        transition
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
    `;


    return (

        <div className="
            bg-white
            border
            border-gray-200
            rounded-xl
            mb-5
            sm:mb-6
            shadow-sm
        ">


            {/* =================================
                MOBILE FILTER HEADER
            ================================= */}

            <button
                onClick={() => setShowFilters(!showFilters)}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    sm:hidden
                "
            >

                <div className="flex items-center gap-2">

                    <FiFilter className="text-blue-600" />

                    <span className="font-semibold text-gray-900">
                        Filters
                    </span>

                    {activeFilters > 0 && (

                        <span className="
                            bg-blue-100
                            text-blue-700
                            text-xs
                            font-semibold
                            px-2
                            py-0.5
                            rounded-full
                        ">
                            {activeFilters}
                        </span>

                    )}

                </div>


                <FiChevronDown
                    className={`
                        text-gray-500
                        transition-transform
                        duration-200
                        ${showFilters ? "rotate-180" : ""}
                    `}
                />

            </button>


            {/* =================================
                DESKTOP HEADER
            ================================= */}

            <div className="
                hidden
                sm:flex
                items-center
                justify-between
                px-5
                pt-4
                pb-3
            ">

                <div>

                    <h2 className="
                        text-base
                        sm:text-lg
                        font-semibold
                        text-gray-900
                    ">
                        Filters
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Find jobs based on your preferences
                    </p>

                </div>


                {activeFilters > 0 && (

                    <span className="
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-semibold
                        px-3
                        py-1
                        rounded-full
                    ">
                        {activeFilters}{" "}
                        {activeFilters === 1
                            ? "filter"
                            : "filters"}
                    </span>

                )}

            </div>


            {/* =================================
                FILTER CONTENT
            ================================= */}

            <div
                className={`
                    px-4
                    sm:px-5
                    pb-4
                    sm:pb-5
                    ${
                        showFilters
                            ? "block"
                            : "hidden sm:block"
                    }
                `}
            >

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-3
                    sm:gap-4
                ">


                    {/* LOCATION */}

                    <div>

                        <label className="
                            block
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-600
                            mb-1.5
                        ">
                            Location
                        </label>

                        <select
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            className={selectClass}
                        >

                            <option value="">
                                All Locations
                            </option>

                            <option value="Bangalore">
                                Bangalore
                            </option>

                            <option value="Pune">
                                Pune
                            </option>

                            <option value="Hyderabad">
                                Hyderabad
                            </option>

                            <option value="Mumbai">
                                Mumbai
                            </option>

                        </select>

                    </div>


                    {/* JOB TYPE */}

                    <div>

                        <label className="
                            block
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-600
                            mb-1.5
                        ">
                            Job Type
                        </label>

                        <select
                            value={jobType}
                            onChange={(e) =>
                                setJobType(e.target.value)
                            }
                            className={selectClass}
                        >

                            <option value="">
                                All Job Types
                            </option>

                            <option value="Full-time">
                                Full-time
                            </option>

                            <option value="Part-time">
                                Part-time
                            </option>

                            <option value="Internship">
                                Internship
                            </option>

                            <option value="Remote">
                                Remote
                            </option>

                        </select>

                    </div>


                    {/* EXPERIENCE */}

                    <div>

                        <label className="
                            block
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-600
                            mb-1.5
                        ">
                            Experience
                        </label>

                        <select
                            value={experience}
                            onChange={(e) =>
                                setExperience(e.target.value)
                            }
                            className={selectClass}
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

                    </div>


                    {/* SALARY */}

                    <div>

                        <label className="
                            block
                            text-xs
                            sm:text-sm
                            font-medium
                            text-gray-600
                            mb-1.5
                        ">
                            Minimum Salary
                        </label>

                        <select
                            value={minSalary}
                            onChange={(e) =>
                                setMinSalary(e.target.value)
                            }
                            className={selectClass}
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

            </div>

        </div>

    );

}

export default JobFilters;
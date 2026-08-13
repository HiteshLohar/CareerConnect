import { useEffect, useState } from "react";

import api from "../../services/api";

// import SearchBar from "../../components/jobs/SearchBar";
import JobFilters from "../../components/jobs/JobFilters";
import JobList from "../../components/jobs/JobList";
import Pagination from "../../components/jobs/Pagination";

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==============================
    // SEARCH
    // ==============================

    // User jo type kar raha hai
    const [searchInput, setSearchInput] = useState("");

    // Backend ko jo keyword jayega
    const [keyword, setKeyword] = useState("");


    // ==============================
    // FILTERS
    // ==============================

    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [experience, setExperience] = useState("");
    const [minSalary, setMinSalary] = useState("");


    // ==============================
    // PAGINATION
    // ==============================

    const [page, setPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);


    // ==============================
    // SEARCH DEBOUNCE
    // ==============================

    useEffect(() => {

        const timer = setTimeout(() => {

            const trimmedSearch = searchInput.trim();

            if (trimmedSearch === keyword.trim()) {
                return;
            }

            setPage(1);
            setKeyword(trimmedSearch);

        }, 500);

        return () => {
            clearTimeout(timer);
        };

    }, [searchInput]);


    // ==============================
    // FETCH JOBS
    // ==============================

    const fetchJobs = async () => {

        try {

            setLoading(true);

            const response = await api.get("/jobs", {

                params: {
                    keyword,
                    location,
                    jobType,
                    experience,
                    minSalary,
                    page,
                    limit: 5,
                },

            });

            setJobs(response.data.jobs || []);

            setCurrentPage(
                response.data.currentPage || 1
            );

            setTotalPages(
                response.data.totalPages || 1
            );

            setTotalJobs(
                response.data.totalJobs || 0
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // FETCH WHEN SEARCH / FILTER / PAGE CHANGES
    // ==============================

    useEffect(() => {

        fetchJobs();

    }, [
        keyword,
        location,
        jobType,
        experience,
        minSalary,
        page,
    ]);


    // ==============================
    // RESET PAGE WHEN FILTER CHANGES
    // ==============================

    useEffect(() => {

        setPage(1);

    }, [
        location,
        jobType,
        experience,
        minSalary,
    ]);


    return (

        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* SEARCH */}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            {/* FILTERS */}

            <JobFilters
                location={location}
                setLocation={setLocation}

                jobType={jobType}
                setJobType={setJobType}

                experience={experience}
                setExperience={setExperience}

                minSalary={minSalary}
                setMinSalary={setMinSalary}
            />


            {/* JOB LIST */}

            <JobList
                jobs={jobs}
                loading={loading}
            />


            {/* PAGINATION */}

            <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

        </div>

    );

}

export default Jobs;
import { useEffect, useState } from "react";

import api from "../../services/api";

import SearchBar from "../../components/jobs/SearchBar";
import JobFilters from "../../components/jobs/JobFilters";
import JobList from "../../components/jobs/JobList";
import Pagination from "../../components/jobs/Pagination";

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Input me jo user type kar raha hai
    const [searchInput, setSearchInput] = useState("");

    // Backend ko ye keyword jayega
    const [keyword, setKeyword] = useState("");

    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");

    const [page, setPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    const fetchJobs = async () => {
        try {
            setLoading(true);

            const response = await api.get("/jobs", {
                params: {
                    keyword,
                    location,
                    jobType,
                    page,
                    limit: 5,
                },
            });

            setJobs(response.data.jobs);

            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalJobs(response.data.totalJobs);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [keyword, page]);

    const handleSearch = () => {
        if (searchInput.trim() === keyword.trim()) return;

        setPage(1);
        setKeyword(searchInput.trim());
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <SearchBar
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearch}
            />

            <JobFilters />

            <JobList
                jobs={jobs}
                loading={loading}
            />

            <Pagination
                page={page}
                setPage={setPage}
                currentPage={currentPage}
                totalPages={totalPages}
                totalJobs={totalJobs}
            />

        </div>
    );
}

export default Jobs;
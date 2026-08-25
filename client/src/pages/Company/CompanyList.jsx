import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function CompanyList() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDeleteCompany = async (companyId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this company?"
        );

        if (!confirmDelete) return;

        try {

            const response = await api.delete(
                `/companies/${companyId}`
            );

            toast.success(response.data.message);

            setCompanies((prevCompanies) =>
                prevCompanies.filter(
                    (company) => company._id !== companyId
                )
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete company"
            );

        }

    };

    const fetchCompanies = async () => {

        try {

            const response = await api.get("/companies");

            setCompanies(response.data.companies);

        } catch (error) {

            console.log(error);

            toast.error("Failed to fetch companies");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="px-4 py-20 text-center text-lg sm:text-xl">
                Loading...
            </div>
        );
    }

    return (

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

                <h1 className="text-2xl font-bold sm:text-3xl">
                    My Companies
                </h1>

                <Link
                    to="/companies/create"
                    className="w-full rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    + Add Company
                </Link>

            </div>

            <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">

                {
                    companies.length === 0 ? (

                        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-8">

                            <p className="text-center text-gray-500">
                                No Companies Found
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-4 sm:gap-6">

                            {
                                companies.map((company) => (

                                    <div
                                        key={company._id}
                                        className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                                    >

                                        <div className="flex min-w-0 items-center gap-3 sm:gap-5">

                                            <Link
                                                to={`/companies/browse/${company._id}`}
                                                className="group flex min-w-0 items-center gap-3 sm:gap-5"
                                            >

                                                <img
                                                    src={
                                                        company.logo ||
                                                        "https://ui-avatars.com/api/?name=" +
                                                        encodeURIComponent(company.name)
                                                    }
                                                    alt={company.name}
                                                    className="h-14 w-14 shrink-0 rounded-xl border object-cover sm:h-20 sm:w-20"
                                                />

                                                <div className="min-w-0">

                                                    <h2 className="break-words text-xl font-bold transition group-hover:text-blue-600 sm:text-2xl">
                                                        {company.name}
                                                    </h2>

                                                    <p className="text-gray-600 mt-2">
                                                        {company.description}
                                                    </p>

                                                    <p className="text-gray-500 mt-2">
                                                        🌍 {company.website}
                                                    </p>

                                                    <p className="text-gray-500 mt-1">
                                                        📍 {company.location}
                                                    </p>

                                                </div>

                                            </Link>

                                        </div>

                                        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                                            <Link
                                                to={`/companies/${company._id}/edit`}
                                                className="w-full rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 sm:w-auto"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="w-full rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 sm:w-auto"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>

        </div>

    );

}

export default CompanyList; 

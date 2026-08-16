import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    FiMapPin,
    FiGlobe,
    FiArrowRight
} from "react-icons/fi";

import api from "../../services/api";

function CompanyBrowse() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH COMPANIES
    // =========================

    const fetchCompanies = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/companies/browse"
            );

            setCompanies(
                response.data.companies || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch companies:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch companies"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchCompanies();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center">

                <div className="flex items-center gap-3 text-gray-500">

                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                    <span className="text-lg">
                        Loading companies...
                    </span>

                </div>

            </div>

        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div className="max-w-7xl mx-auto px-4 py-10">


            {/* =========================
                HEADER
            ========================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    Explore Companies
                </h1>

                <p className="text-gray-500 mt-2">
                    Discover companies and explore their open job opportunities.
                </p>

            </div>


            {/* =========================
                NO COMPANIES
            ========================= */}

            {companies.length === 0 ? (

                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

                    <h2 className="text-xl font-semibold text-gray-800">
                        No Companies Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        There are no active companies available right now.
                    </p>

                </div>

            ) : (


                /* =========================
                    COMPANY GRID
                ========================= */

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {companies.map((company) => (

                        <div
                            key={company._id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >


                            {/* =========================
                                COMPANY HEADER
                            ========================= */}

                            <div className="flex items-center gap-4">

                                <img
                                    src={
                                        company.logo ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            company.name
                                        )}&background=2563eb&color=fff`
                                    }
                                    alt={company.name}
                                    className="w-16 h-16 rounded-xl object-cover border"
                                />


                                <div className="min-w-0">

                                    <h2 className="text-xl font-bold text-gray-900 truncate">
                                        {company.name}
                                    </h2>


                                    {/* LOCATION */}

                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">

                                        <FiMapPin
                                            size={16}
                                            className="text-blue-600 shrink-0"
                                        />

                                        <span className="truncate">
                                            {company.location ||
                                                "Location not added"}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =========================
                                DESCRIPTION
                            ========================= */}

                            <p className="text-gray-600 text-sm mt-5 line-clamp-3">

                                {company.description ||
                                    "No company description available."}

                            </p>


                            {/* =========================
                                WEBSITE
                            ========================= */}

                            {company.website && (

                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 text-sm mt-4 hover:underline"
                                >

                                    <FiGlobe
                                        size={16}
                                        className="shrink-0"
                                    />

                                    <span className="truncate">
                                        {company.website}
                                    </span>

                                </a>

                            )}


                            {/* =========================
                                DETAILS BUTTON
                            ========================= */}

                            <div className="mt-6">

                                <Link
                                    to={`/companies/browse/${company._id}`}
                                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                                >

                                    <span>
                                        View Company
                                    </span>

                                    <FiArrowRight size={18} />

                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CompanyBrowse;
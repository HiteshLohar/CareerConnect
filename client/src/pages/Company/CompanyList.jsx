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
            <div className="text-center py-20 text-xl">
                Loading...
            </div>
        );
    }

    return (

        <div className="max-w-6xl mx-auto py-10 px-4">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    My Companies
                </h1>

                <Link
                    to="/companies/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                    + Add Company
                </Link>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">

                {
                    companies.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow-lg p-8">

                            <p className="text-center text-gray-500">
                                No Companies Found
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-6">

                            {
                                companies.map((company) => (

                                    <div
                                        key={company._id}
                                        className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center"
                                    >

                                        <div className="flex items-center gap-5">

                                            <img
                                                src={
                                                    company.logo ||
                                                    "https://ui-avatars.com/api/?name=" +
                                                    encodeURIComponent(company.name)
                                                }
                                                alt={company.name}
                                                className="w-20 h-20 rounded-xl object-cover border"
                                            />

                                            <div>

                                                <h2 className="text-2xl font-bold">
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

                                        </div>

                                        <div className="flex gap-3">

                                            <Link
                                                to={`/companies/${company._id}/edit`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
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
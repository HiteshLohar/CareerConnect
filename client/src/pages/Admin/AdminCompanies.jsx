import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminCompanies() {

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    // =====================================
    // FETCH ALL COMPANIES
    // =====================================

    const fetchCompanies = async () => {

        try {

            setLoading(true);

            const response = await api.get("/companies/admin");

            setCompanies(response.data.companies || []);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch companies"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchCompanies();

    }, []);


    // =====================================
    // SEARCH
    // =====================================

    const filteredCompanies = companies.filter((company) => {

        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            company.name
                ?.toLowerCase()
                .includes(searchText) ||

            company.location
                ?.toLowerCase()
                .includes(searchText) ||

            company.owner?.fullName
                ?.toLowerCase()
                .includes(searchText) ||

            company.owner?.email
                ?.toLowerCase()
                .includes(searchText)
        );

    });


    // =====================================
    // UPDATE COMPANY STATUS
    // =====================================

    const handleStatusChange = async (
        companyId,
        currentStatus
    ) => {

        const newStatus =
            currentStatus === "active"
                ? "suspended"
                : "active";


        try {

            const response = await api.patch(
                `/companies/admin/${companyId}/status`,
                {
                    accountStatus: newStatus
                }
            );

            toast.success(response.data.message);


            setCompanies((prevCompanies) =>
                prevCompanies.map((company) =>
                    company._id === companyId
                        ? {
                            ...company,
                            accountStatus: newStatus
                        }
                        : company
                )
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update company status"
            );

        }

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[60vh] px-4">

                <p className="text-lg sm:text-xl text-gray-600 text-center">
                    Loading Companies...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">


            {/* =================================
                HEADER
            ================================= */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Company Management
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Manage all companies registered on CareerConnect
                </p>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

            <div className="mb-5 sm:mb-8">

                <input
                    type="text"
                    placeholder="Search company, owner, email or location..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =================================
                RESULT COUNT
            ================================= */}

            <div className="mb-4 text-sm sm:text-base text-gray-600">

                Showing{" "}

                <span className="font-semibold">
                    {filteredCompanies.length}
                </span>{" "}

                companies

            </div>


            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        {/* TABLE HEADER */}

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Company
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Owner
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Location
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Status
                                </th>

                                <th className="text-left p-4 whitespace-nowrap">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {filteredCompanies.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No companies found
                                    </td>

                                </tr>

                            ) : (

                                filteredCompanies.map((company) => (

                                    <tr
                                        key={company._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >

                                        {/* COMPANY */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3 min-w-[220px]">

                                                {company.logo ? (

                                                    <img
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                                    />

                                                ) : (

                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">

                                                        {company.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                )}

                                                <div className="min-w-0">

                                                    <p className="font-semibold text-gray-900 truncate">

                                                        {company.name}

                                                    </p>

                                                    <p className="text-sm text-gray-500 truncate max-w-[200px]">

                                                        {company.website ||
                                                            "No website"}

                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* OWNER */}

                                        <td className="p-4">

                                            <p className="font-medium text-gray-900 whitespace-nowrap">

                                                {company.owner?.fullName ||
                                                    "Unknown"}

                                            </p>

                                            <p className="text-sm text-gray-500">

                                                {company.owner?.email ||
                                                    "No email"}

                                            </p>

                                        </td>


                                        {/* LOCATION */}

                                        <td className="p-4 text-gray-600">

                                            {company.location || "N/A"}

                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    company.accountStatus ===
                                                    "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >

                                                {company.accountStatus}

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="p-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        company._id,
                                                        company.accountStatus
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg text-white transition whitespace-nowrap ${
                                                    company.accountStatus ===
                                                    "active"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >

                                                {company.accountStatus ===
                                                "active"
                                                    ? "Suspend"
                                                    : "Activate"}

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="md:hidden space-y-4">

                {filteredCompanies.length === 0 ? (

                    <div className="bg-white border rounded-xl p-8 text-center text-gray-500">

                        No companies found

                    </div>

                ) : (

                    filteredCompanies.map((company) => (

                        <div
                            key={company._id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                        >

                            {/* COMPANY */}

                            <div className="flex items-start gap-3">

                                {company.logo ? (

                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />

                                ) : (

                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">

                                        {company.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>

                                )}

                                <div className="min-w-0 flex-1">

                                    <h2 className="font-semibold text-gray-900 text-base sm:text-lg break-words">

                                        {company.name}

                                    </h2>

                                    <p className="text-sm text-gray-500 break-all">

                                        {company.website ||
                                            "No website"}

                                    </p>

                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className="mt-4 space-y-3">


                                {/* OWNER */}

                                <div>

                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Owner
                                    </p>

                                    <p className="font-medium text-gray-900 break-words">

                                        {company.owner?.fullName ||
                                            "Unknown"}

                                    </p>

                                    <p className="text-sm text-gray-500 break-all">

                                        {company.owner?.email ||
                                            "No email"}

                                    </p>

                                </div>


                                {/* LOCATION */}

                                <div>

                                    <p className="text-xs font-medium text-gray-400 uppercase">
                                        Location
                                    </p>

                                    <p className="text-gray-700 break-words">

                                        {company.location || "N/A"}

                                    </p>

                                </div>


                                {/* STATUS */}

                                <div className="flex items-center justify-between gap-3">

                                    <div>

                                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                            Status
                                        </p>

                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                company.accountStatus ===
                                                "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >

                                            {company.accountStatus}

                                        </span>

                                    </div>

                                </div>


                                {/* ACTION */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStatusChange(
                                            company._id,
                                            company.accountStatus
                                        )
                                    }
                                    className={`w-full px-4 py-2.5 rounded-lg text-white font-medium transition ${
                                        company.accountStatus ===
                                        "active"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >

                                    {company.accountStatus ===
                                    "active"
                                        ? "Suspend Company"
                                        : "Activate Company"}

                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default AdminCompanies;
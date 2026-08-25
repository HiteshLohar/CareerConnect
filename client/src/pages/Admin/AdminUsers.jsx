import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");


    // ==============================
    // FETCH USERS
    // ==============================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/users/admin/users",
                {
                    params: {
                        search: search.trim(),
                        role
                    }
                }
            );

            setUsers(
                response.data.users || []
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch users"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==============================
    // SEARCH + ROLE FILTER
    // ==============================

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => {
            clearTimeout(timer);
        };

    }, [search, role]);


    // ==============================
    // ACTIVATE / SUSPEND USER
    // ==============================

    const handleStatusChange = async (
        userId,
        currentStatus
    ) => {

        const newStatus =
            currentStatus === "active"
                ? "suspended"
                : "active";


        try {

            const response = await api.patch(
                `/users/admin/users/${userId}/status`,
                {
                    accountStatus: newStatus
                }
            );

            toast.success(
                response.data.message
            );


            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId
                        ? {
                            ...user,
                            accountStatus: newStatus
                        }
                        : user
                )
            );

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update user status"
            );

        }

    };


    // ==============================
    // INITIAL LOADING
    // ==============================

    if (loading && users.length === 0) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center px-4">

                <p className="text-base sm:text-xl text-gray-500">
                    Loading Users...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">


            {/* ==============================
                HEADER
            ============================== */}

            <div className="mb-6 sm:mb-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    User Management
                </h1>

                <p className="text-sm sm:text-base text-gray-500 mt-2">
                    Manage students and recruiters
                </p>

            </div>


            {/* ==============================
                SEARCH + FILTER
            ============================== */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 mb-6">

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                    {/* SEARCH */}

                    <div className="flex-1 relative">

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />


                        {loading && (

                            <div className="absolute right-4 top-1/2 -translate-y-1/2">

                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />

                            </div>

                        )}

                    </div>


                    {/* ROLE FILTER */}

                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                        }}
                        className="w-full sm:w-48 border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >

                        <option value="">
                            All Users
                        </option>

                        <option value="student">
                            Students
                        </option>

                        <option value="recruiter">
                            Recruiters
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[750px]">

                        {/* TABLE HEADER */}

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                                    Name
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                                    Email
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                                    Role
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="text-left p-4 text-sm font-semibold text-gray-700">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {users.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-14 text-gray-500"
                                    >
                                        No users found
                                    </td>

                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >

                                        {/* NAME */}

                                        <td className="p-4">

                                            <div className="font-semibold text-gray-900">
                                                {user.fullName}
                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td className="p-4 text-gray-600">

                                            <div className="max-w-[280px] truncate">
                                                {user.email}
                                            </div>

                                        </td>


                                        {/* ROLE */}

                                        <td className="p-4">

                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                    user.role === "student"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}
                                            >
                                                {user.role}
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                    user.accountStatus === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {user.accountStatus}
                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="p-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStatusChange(
                                                        user._id,
                                                        user.accountStatus
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                                                    user.accountStatus === "active"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >

                                                {user.accountStatus === "active"
                                                    ? "Suspend"
                                                    : "Activate"
                                                }

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
                MOBILE USER CARDS
            ================================================= */}

            <div className="md:hidden space-y-4">

                {users.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                        No users found
                    </div>

                ) : (

                    users.map((user) => (

                        <div
                            key={user._id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4"
                        >

                            {/* USER INFO */}

                            <div className="mb-4">

                                <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                                    {user.fullName}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1 break-all">
                                    {user.email}
                                </p>

                            </div>


                            {/* USER DETAILS */}

                            <div className="flex flex-wrap items-center gap-2 mb-4">

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                        user.role === "student"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-purple-100 text-purple-700"
                                    }`}
                                >
                                    {user.role}
                                </span>


                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                        user.accountStatus === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {user.accountStatus}
                                </span>

                            </div>


                            {/* ACTION */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleStatusChange(
                                        user._id,
                                        user.accountStatus
                                    )
                                }
                                className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition ${
                                    user.accountStatus === "active"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >

                                {user.accountStatus === "active"
                                    ? "Suspend User"
                                    : "Activate User"
                                }

                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default AdminUsers;
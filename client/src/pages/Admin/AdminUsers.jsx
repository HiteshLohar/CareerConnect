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

            const response = await api.get("/users/admin/users", {
                params: {
                    search: search.trim(),
                    role
                }
            });

            setUsers(response.data.users);

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
    // INITIAL LOAD
    // + REAL TIME SEARCH
    // + ROLE FILTER
    // ==============================

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchUsers();

        }, 500);


        // Agar user 500ms ke andar dobara type kare
        // previous API call cancel ho jayegi

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


            toast.success(response.data.message);


            // Full page reload nahi hoga.
            // Sirf affected user ka status update hoga.

            setUsers((prevUsers) => {

                return prevUsers.map((user) => {

                    if (user._id === userId) {

                        return {
                            ...user,
                            accountStatus: newStatus
                        };

                    }

                    return user;

                });

            });


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

            <div className="flex items-center justify-center min-h-[400px]">

                <p className="text-xl text-gray-600">
                    Loading Users...
                </p>

            </div>

        );

    }


    return (

        <div className="max-w-7xl mx-auto px-4 py-10">


            {/* ==============================
                HEADER
            ============================== */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900">
                    User Management
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage students and recruiters
                </p>

            </div>


            {/* ==============================
                SEARCH + FILTER
            ============================== */}

            <div className="flex flex-col md:flex-row gap-4 mb-8">


                {/* SEARCH */}

                <div className="flex-1 relative">

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Small loading indicator */}

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
                    className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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


            {/* ==============================
                USERS TABLE
            ============================== */}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">


                        {/* TABLE HEADER */}

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4">
                                    Name
                                </th>

                                <th className="text-left p-4">
                                    Email
                                </th>

                                <th className="text-left p-4">
                                    Role
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
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
                                        className="text-center py-12 text-gray-500"
                                    >

                                        No users found

                                    </td>

                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >


                                        {/* NAME */}

                                        <td className="p-4">

                                            <div className="font-semibold text-gray-900">

                                                {user.fullName}

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td className="p-4 text-gray-600">

                                            {user.email}

                                        </td>


                                        {/* ROLE */}

                                        <td className="p-4">

                                            <span className="capitalize">

                                                {user.role}

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                                                className={`px-4 py-2 rounded-lg text-white transition ${
                                                    user.accountStatus === "active"
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                }`}
                                            >

                                                {
                                                    user.accountStatus === "active"
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

        </div>

    );

}

export default AdminUsers;
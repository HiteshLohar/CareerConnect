import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function RegisterForm() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "student",
        phone: "",
        location: "",
    });


    // ========================================
    // HANDLE CHANGE
    // ========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ========================================
    // HANDLE SUBMIT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/register",
                formData
            );

            toast.success(
                response.data.message ||
                "Registration successful"
            );

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    return (
        <div className="w-full max-w-lg">

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 md:p-8">

                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="mb-6 text-center">

                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                        Join CareerConnect and start your journey
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* ========================================
                        FULL NAME
                    ======================================== */}

                    <div>

                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                        />

                    </div>


                    {/* ========================================
                        EMAIL
                    ======================================== */}

                    <div>

                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                        />

                    </div>


                    {/* ========================================
                        PASSWORD
                    ======================================== */}

                    <div>

                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            autoComplete="new-password"
                            minLength={6}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                        />

                    </div>


                    {/* ========================================
                        ROLE + PHONE
                    ======================================== */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* ROLE */}

                        <div>

                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Register As
                            </label>

                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                            >

                                <option value="student">
                                    Student
                                </option>

                                <option value="recruiter">
                                    Recruiter
                                </option>

                            </select>

                        </div>


                        {/* PHONE */}

                        <div>

                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                autoComplete="tel"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                            />

                        </div>

                    </div>


                    {/* ========================================
                        LOCATION
                    ======================================== */}

                    <div>

                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Location
                        </label>

                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State"
                            autoComplete="address-level2"
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
                        />

                    </div>


                    {/* ========================================
                        REGISTER BUTTON
                    ======================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-base"
                    >

                        {loading
                            ? "Creating account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* ========================================
                    LOGIN LINK
                ======================================== */}

                <div className="mt-5 text-center text-sm text-gray-600 sm:text-base">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default RegisterForm;

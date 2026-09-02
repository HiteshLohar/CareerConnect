import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { loginSuccess } from "../../redux/slices/authSlice";
import api from "../../services/api";
import { toast } from "react-hot-toast";

function LoginForm() {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                formData
            );

            dispatch(loginSuccess(response.data.user));

            toast.success(response.data.message);

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

        <div className="
            w-full
            max-w-md
            mx-auto
            bg-white
            border
            border-gray-200
            rounded-xl
            shadow-md
            p-5
            sm:p-6
            md:p-8
        ">

            {/* Heading */}

            <h2 className="
                text-2xl
                sm:text-3xl
                font-bold
                text-center
                text-gray-800
                mb-6
            ">
                Login
            </h2>


            <form onSubmit={handleSubmit}>

                {/* Email */}

                <div className="mb-4">

                    <label
                        htmlFor="email"
                        className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-1
                        "
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
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            sm:text-base
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                        "
                    />

                </div>


                {/* Password */}

                <div className="mb-5">

                    <label
                        htmlFor="password"
                        className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-1
                        "
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            sm:text-base
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                        "
                    />

                </div>


                {/* Login Button */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-medium
                        py-2.5
                        rounded-lg
                        transition
                        duration-200
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                    "
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>

            </form>


            {/* Register Link */}

            <p className="
                text-center
                text-sm
                text-gray-600
                mt-5
            ">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    className="
                        text-blue-600
                        font-medium
                        hover:text-blue-700
                        hover:underline
                    "
                >
                    Register
                </Link>

            </p>

        </div>

    );
}

export default LoginForm;

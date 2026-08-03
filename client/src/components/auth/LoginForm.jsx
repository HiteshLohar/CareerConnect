import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { loginSuccess } from "../../redux/slices/authSlice";
import api from "../../services/api";
import { toast } from "react-hot-toast";

function LoginForm() {

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const redirectPath = searchParams.get("redirect") || "/";

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

            const response = await api.post("/auth/login", formData);

            dispatch(loginSuccess(response.data.user));

            toast.success(response.data.message);

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="w-full max-w-md border rounded-lg p-6 shadow">

            <h2 className="text-3xl font-bold text-center mb-6">
                Login
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <div className="mb-4">
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}

export default LoginForm;
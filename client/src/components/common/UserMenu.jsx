import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    FiUser,
    FiLogOut,
    FiChevronDown
} from "react-icons/fi";

import { logout } from "../../redux/slices/authSlice";
import api from "../../services/api";

function UserMenu() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const handleLogout = async () => {

        try {

            await api.post("/auth/logout");

            dispatch(logout());

            toast.success("Logged out successfully");

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );

        }

    };

    return (

        <div className="flex items-center gap-3">

            {
                isAuthenticated ? (

                    <div className="relative">

                        {/* USER BUTTON */}

                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 font-semibold text-gray-800 hover:text-blue-600 transition"
                        >
                            <span>{user.fullName}</span>

                            <FiChevronDown
                                size={16}
                                className={`transition-transform ${open ? "rotate-180" : ""
                                    }`}
                            />
                        </button>


                        {/* DROPDOWN */}

                        {open && (

                            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">

                                {/* PROFILE */}

                                <button
                                    onClick={() => {
                                        navigate("/profile");
                                        setOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                                >
                                    <FiUser size={18} />
                                    <span>Profile</span>
                                </button>


                                {/* LOGOUT */}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                                >
                                    <FiLogOut size={18} />
                                    <span>Logout</span>
                                </button>

                            </div>

                        )}

                    </div>

                ) : (

                    <>

                        {/* LOGIN */}

                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </button>


                        {/* REGISTER */}

                        <button
                            onClick={() => navigate("/register")}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                        >
                            Register
                        </button>

                    </>

                )
            }

        </div>

    );
}

export default UserMenu;
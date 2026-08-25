import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { logout } from "../../redux/slices/authSlice";
import api from "../../services/api";

function UserMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex min-w-0 items-center gap-2 rounded-md px-2 py-2 font-semibold text-gray-800 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                        <span className="max-w-32 truncate sm:max-w-48">{user.fullName}</span>
                        <FiChevronDown size={16} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>

                    {open && (
                        <div className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                            <button
                                onClick={() => { navigate("/profile"); setOpen(false); }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 transition hover:bg-gray-50"
                            >
                                <FiUser size={18} />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 transition hover:bg-red-50"
                            >
                                <FiLogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <button onClick={() => navigate("/login")} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 sm:px-4">Login</button>
                    <button onClick={() => navigate("/register")} className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-50 sm:px-4">Register</button>
                </>
            )}
        </div>
    );
}

export default UserMenu;

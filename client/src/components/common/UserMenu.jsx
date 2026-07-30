
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import api from "../../services/api";

function UserMenu() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');

            dispatch(logout());

            toast.success("Logged out successfully");

            navigate("/login");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className="flex items-center gap-3">

            {
                isAuthenticated ? (
                    <>

                        <span className="font-semibold">
                            {user.fullName}
                        </span>

                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">

                            Logout
                        </button>

                    </>
                ) : (
                    <>

                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg"
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
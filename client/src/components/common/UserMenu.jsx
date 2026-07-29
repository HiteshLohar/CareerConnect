
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

function UserMenu() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");

        toast.success("Logged out successfully");
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

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                            Login
                        </button>

                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg">
                            Register
                        </button>

                    </>
                )
            }

        </div>
    );
}

export default UserMenu;
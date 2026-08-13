import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const location = useLocation();

    // User logged in nahi hai
    if (!isAuthenticated) {

        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );

    }

    // Role allowed nahi hai
    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

    return children;
}

export default ProtectedRoute;
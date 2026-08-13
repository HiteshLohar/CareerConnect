import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {

    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const location = useLocation();

    const redirectPath =
        new URLSearchParams(location.search).get("redirect");

    if (isAuthenticated) {

        // If redirect URL exists, use it
        if (redirectPath) {
            return <Navigate to={redirectPath} replace />;
        }

        // Role based dashboard
        if (user?.role === "student") {
            return <Navigate to="/student/dashboard" replace />;
        }

        if (user?.role === "recruiter") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;
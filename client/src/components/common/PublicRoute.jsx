import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const location = useLocation();

    const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/";

    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}

export default PublicRoute;
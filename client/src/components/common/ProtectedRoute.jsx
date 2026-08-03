import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const location = useLocation();

    if (!isAuthenticated) {

        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );

    }

    return children;
}

export default ProtectedRoute;
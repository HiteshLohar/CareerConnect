import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

import api from "./services/api";
import { loginSuccess, logout, setLoading } from "./redux/slices/authSlice";

function App() {

    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const response =
                    await api.get("/auth/me");

                dispatch(
                    loginSuccess(response.data.user)
                );

            } catch (error) {

                // 401 means user is simply not logged in.
                // Don't show it as an error in console.

                if (error.response?.status !== 401) {
                    console.error(
                        "Auth check failed:",
                        error
                    );
                }

                dispatch(logout());

            } finally {

                dispatch(setLoading(false));

            }
        };

        checkAuth();

    }, [dispatch]);


    if (loading) {
        return <Loader />;
    }


    return <AppRoutes />;
}

export default App;
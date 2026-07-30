import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

import api from "./services/api";
import { loginSuccess, setLoading } from "./redux/slices/authSlice";

function App() {

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");

        dispatch(loginSuccess(response.data.user));
      }
      catch (error) {
        console.error(error);
      }
      finally {
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
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import api from "./services/api";
import { loginSuccess } from "./redux/slices/authSlice";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await api.get("/auth/me");

        dispatch(loginSuccess(response.data.user));
      }
      catch (error) {
        console.log("User not logged in");
      }
    };

    checkAuth();
  }, []);



  return <AppRoutes />;
}

export default App;
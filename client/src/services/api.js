import axios from "axios";

import store from "../redux/store.js";
import { logout } from "../redux/slices/authSlice.js";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (
            error.response?.status === 401 &&
            error.config?.url === "/auth/me"
        ) {
            store.dispatch(logout());

            console.log("Session expired");
        }

        return Promise.reject(error);
    }
);

export default api;
import axios from "axios";

import store from "../redux/store.js";
import { logout } from "../redux/slices/authSlice.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response?.status === 401 &&
            error.config?.url === "/auth/me"
        ) {
            store.dispatch(logout());
        }

        return Promise.reject(error);
    }
);

export default api;
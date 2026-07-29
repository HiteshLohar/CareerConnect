import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';
import Jobs from '../pages/Jobs';

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Pages Without Navbar */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


                {/* Pages with Navbar + Footer */}

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="flex min-h-dvh flex-col bg-gray-50">
            <Navbar />

            <main className="min-w-0 flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import NotificationBell from "../notification/NotificationBell";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="relative z-40 border-b border-gray-100 bg-white shadow-sm">
            <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <NavLogo />
                <NavLinks className="hidden md:flex" />

                <div className="hidden items-center gap-3 md:flex">
                    <NotificationBell />
                    <UserMenu />
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                    {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div id="mobile-navigation" className="border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden">
                    <NavLinks
                        className="flex-col items-stretch gap-1"
                        onNavigate={() => setMobileMenuOpen(false)}
                    />

                    <div className="mt-3 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                        <UserMenu />
                        <NotificationBell />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

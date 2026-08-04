
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import NotificationBell from "../notification/NotificationBell";


function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 shadow-md">

            <NavLogo />

            <NavLinks />

            <div className="flex items-center gap-5">

                <NotificationBell />

                <UserMenu />

            </div>

        </nav>
    );
}

export default Navbar;
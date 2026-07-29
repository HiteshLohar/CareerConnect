
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
    

function Navbar() {
    return (
        <nav className="flex items-center justify-between px-8 py-4 shadow-md">

            <NavLogo />

            <NavLinks />

            <UserMenu />

        </nav>
    );
}

export default Navbar;
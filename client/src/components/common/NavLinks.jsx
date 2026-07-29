import { NavLink } from "react-router-dom";

function NavLinks() {
    return (
        <div className="flex items-center gap-6">

            <NavLink to="/">
                Home
            </NavLink>

            <NavLink to="/jobs">
                Jobs
            </NavLink>

        </div>
    );
}

export default NavLinks;
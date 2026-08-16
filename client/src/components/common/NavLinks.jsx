import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function NavLinks() {

    const { user } = useSelector(
        (state) => state.auth
    );

    const role = user?.role;

    const navClass = ({ isActive }) =>
        `transition ${isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-700 hover:text-blue-600"
        }`;

    return (

        <div className="flex items-center gap-6">

            {/* =========================
                STUDENT
            ========================= */}

            {role === "student" && (
                <>
                    <NavLink
                        to="/student/dashboard"
                        className={navClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/jobs"
                        className={navClass}
                    >
                        Jobs
                    </NavLink>

                    <NavLink
                        to="/saved-jobs"
                        className={navClass}
                    >
                        Saved Jobs
                    </NavLink>

                    <NavLink
                        to="/my-applications"
                        className={navClass}
                    >
                        My Applications
                    </NavLink>

                    <NavLink
                        to="/companies/browse"
                        className={navClass}
                    >
                        Browse Companies
                    </NavLink>
                </>
            )}


            {/* =========================
                RECRUITER
            ========================= */}

            {role === "recruiter" && (
                <>
                    <NavLink
                        to="/recruiter/dashboard"
                        className={navClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/companies"
                        className={navClass}
                    >
                        Companies
                    </NavLink>

                    <NavLink
                        to="/recruiter/jobs"
                        className={navClass}
                    >
                        My Jobs
                    </NavLink>

                    <NavLink
                        to="/recruiter/analytics"
                        className={navClass}
                    >
                        Analytics
                    </NavLink>
                </>
            )}


            {/* =========================
                ADMIN
            ========================= */}

            {role === "admin" && (
                <>
                    <NavLink
                        to="/admin/dashboard"
                        className={navClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={navClass}
                    >
                        Users
                    </NavLink>

                    <NavLink
                        to="/admin/companies"
                        className={navClass}
                    >
                        Companies
                    </NavLink>

                    <NavLink
                        to="/admin/jobs"
                        className={navClass}
                    >
                        Jobs
                    </NavLink>

                    <NavLink
                        to="/admin/applications"
                        className={navClass}
                    >
                        Applications
                    </NavLink>
                </>
            )}

        </div>

    );

}

export default NavLinks;
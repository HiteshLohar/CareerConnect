import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function NavLinks({ onNavigate, className = "" }) {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;

    const navClass = ({ isActive }) =>
        `rounded-md px-2 py-2 text-sm font-medium transition ${isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
        }`;

    const links = {
        student: [
            ["/student/dashboard", "Dashboard"],
            ["/jobs", "Jobs"],
            ["/saved-jobs", "Saved Jobs"],
            ["/my-applications", "My Applications"],
            ["/companies/browse", "Browse Companies"]
        ],
        recruiter: [
            ["/recruiter/dashboard", "Dashboard"],
            ["/companies", "Companies"],
            ["/recruiter/jobs", "My Jobs"],
            ["/recruiter/analytics", "Analytics"]
        ],
        admin: [
            ["/admin/dashboard", "Dashboard"],
            ["/admin/users", "Users"],
            ["/admin/companies", "Companies"],
            ["/admin/jobs", "Jobs"],
            ["/admin/applications", "Applications"]
        ]
    };

    return (
        <div className={`flex items-center gap-1 md:gap-4 ${className}`}>
            {(links[role] || []).map(([to, label]) => (
                <NavLink
                    key={to}
                    to={to}
                    className={navClass}
                    onClick={onNavigate}
                >
                    {label}
                </NavLink>
            ))}
        </div>
    );
}

export default NavLinks;

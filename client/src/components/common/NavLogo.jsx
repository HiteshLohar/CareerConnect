import { Link } from "react-router-dom";

function NavLogo() {
    return (
        <Link
            to="/"
            className="shrink-0 text-xl font-bold tracking-tight text-blue-600 transition hover:text-blue-700 sm:text-2xl"
        >
            CareerConnect
        </Link>
    );
}

export default NavLogo;

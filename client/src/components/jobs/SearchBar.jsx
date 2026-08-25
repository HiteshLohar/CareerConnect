import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";

function SearchBar({
    searchInput,
    setSearchInput,
    onSearch,
}) {

    useEffect(() => {

        const timer = setTimeout(() => {

            onSearch();

        }, 500);

        return () => clearTimeout(timer);

    }, [searchInput]);


    return (

        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-5 sm:mb-6">

            <div
                className="
                    flex
                    items-center
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    sm:px-4
                    focus-within:ring-2
                    focus-within:ring-blue-500
                    focus-within:border-blue-500
                    transition
                "
            >

                <FiSearch
                    className="
                        text-gray-500
                        text-lg
                        sm:text-xl
                        shrink-0
                    "
                />

                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) =>
                        setSearchInput(e.target.value)
                    }
                    placeholder="Search jobs, companies..."
                    className="
                        flex-1
                        min-w-0
                        px-2
                        sm:px-3
                        py-2.5
                        sm:py-3
                        text-sm
                        sm:text-base
                        outline-none
                        bg-transparent
                    "
                />

            </div>

        </div>

    );
}

export default SearchBar;
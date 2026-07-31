import { FiSearch } from "react-icons/fi";

function SearchBar({
    searchInput,
    setSearchInput,
    onSearch,
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">

            <div className="flex gap-3">

                <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-4">

                    <FiSearch className="text-gray-500 text-xl" />

                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSearch();
                            }
                        }}
                        placeholder="Search jobs, companies..."
                        className="flex-1 px-3 py-3 outline-none"
                    />

                </div>

                <button
                    onClick={onSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg transition"
                >
                    Search
                </button>

            </div>

        </div>
    );
}

export default SearchBar;
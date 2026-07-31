function Pagination({
    page,
    setPage,
    totalPages,
}) {

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-10">

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                Previous
            </button>

            {
                [...Array(totalPages)].map((_, index) => {

                    const pageNumber = index + 1;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`w-10 h-10 rounded-lg transition
                                ${
                                    page === pageNumber
                                        ? "bg-blue-600 text-white"
                                        : "border hover:bg-gray-100"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    );
                })
            }

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;
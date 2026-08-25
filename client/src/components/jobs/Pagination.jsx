function Pagination({
    page,
    setPage,
    totalPages,
}) {

    if (totalPages <= 1) return null;


    // =====================================
    // GENERATE PAGE NUMBERS
    // =====================================

    const getPages = () => {

        // Small number of pages
        if (totalPages <= 5) {

            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );

        }


        // Near beginning
        if (page <= 3) {

            return [1, 2, 3, 4, "...", totalPages];

        }


        // Near end
        if (page >= totalPages - 2) {

            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];

        }


        // Middle
        return [
            1,
            "...",
            page - 1,
            page,
            page + 1,
            "...",
            totalPages,
        ];

    };


    const pages = getPages();


    return (

        <div className="
            flex
            justify-center
            items-center
            gap-1.5
            sm:gap-2
            mt-8
            sm:mt-10
            px-2
            w-full
        ">


            {/* =================================
                PREVIOUS
            ================================= */}

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="
                    px-3
                    sm:px-4
                    py-2
                    rounded-lg
                    border
                    text-sm
                    sm:text-base
                    whitespace-nowrap
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    hover:bg-gray-100
                    transition
                "
            >
                <span className="hidden sm:inline">
                    Previous
                </span>

                <span className="sm:hidden">
                    ←
                </span>
            </button>


            {/* =================================
                PAGE NUMBERS
            ================================= */}

            <div className="
                flex
                items-center
                gap-1
                sm:gap-2
                overflow-hidden
            ">

                {pages.map((pageNumber, index) => {

                    if (pageNumber === "...") {

                        return (

                            <span
                                key={`dots-${index}`}
                                className="
                                    w-8
                                    sm:w-10
                                    h-10
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-500
                                "
                            >
                                ...
                            </span>

                        );

                    }


                    return (

                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`
                                w-9
                                h-9
                                sm:w-10
                                sm:h-10
                                shrink-0
                                rounded-lg
                                text-sm
                                sm:text-base
                                transition
                                ${
                                    page === pageNumber
                                        ? "bg-blue-600 text-white"
                                        : "border hover:bg-gray-100"
                                }
                            `}
                        >
                            {pageNumber}
                        </button>

                    );

                })}

            </div>


            {/* =================================
                NEXT
            ================================= */}

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="
                    px-3
                    sm:px-4
                    py-2
                    rounded-lg
                    border
                    text-sm
                    sm:text-base
                    whitespace-nowrap
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    hover:bg-gray-100
                    transition
                "
            >
                <span className="hidden sm:inline">
                    Next
                </span>

                <span className="sm:hidden">
                    →
                </span>
            </button>

        </div>

    );

}

export default Pagination;
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Loader() {

    const [dots, setDots] = useState("");


    // =====================================
    // LOADING DOTS ANIMATION
    // =====================================

    useEffect(() => {

        const interval = setInterval(() => {

            setDots((prev) =>
                prev.length === 3 ? "" : prev + "."
            );

        }, 400);

        return () => clearInterval(interval);

    }, []);


    return (

        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">


            {/* =================================
                SPINNER
            ================================= */}

            <motion.div
                className="
                    w-10 h-10
                    sm:w-12 sm:h-12
                    md:w-14 md:h-14
                    border-4
                    border-blue-600
                    border-t-transparent
                    rounded-full
                "
                animate={{
                    rotate: 360
                }}
                transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear"
                }}
            />


            {/* =================================
                BRAND NAME
            ================================= */}

            <motion.h1
                className="
                    mt-5
                    sm:mt-6
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    font-bold
                    text-blue-600
                    text-center
                "
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                CareerConnect
            </motion.h1>


            {/* =================================
                LOADING TEXT
            ================================= */}

            <p
                className="
                    mt-2
                    text-sm
                    sm:text-base
                    text-gray-500
                    text-center
                    min-w-[80px]
                "
            >
                Loading{dots}
            </p>

        </div>

    );

}

export default Loader;
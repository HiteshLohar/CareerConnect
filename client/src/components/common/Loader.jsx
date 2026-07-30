import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Loader() {

    const [dots, setDots] = useState("");

    useEffect(() => {

        const interval = setInterval(() => {

            setDots((prev) => (prev.length === 3 ? "" : prev + "."));

        }, 400);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">

            <motion.div
                className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "linear"
                }}
            />

            <motion.h1
                className="mt-6 text-2xl font-bold text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                CareerConnect
            </motion.h1>

            <p className="text-gray-500 mt-2">
                Loading{dots}
            </p>

        </div>
    );
}

export default Loader;
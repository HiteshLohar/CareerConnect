import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import {
  FiArrowLeft,
  FiHome,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function NotFound() {

  const navigate = useNavigate();


  // =====================================
  // MOUSE POSITION
  // =====================================

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);


  // =====================================
  // SMOOTH MOUSE MOVEMENT
  // =====================================

  const springX = useSpring(mouseX, {
    stiffness: 100,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 100,
    damping: 20,
  });


  // =====================================
  // MOUSE MOVE EVENT
  // =====================================

  useEffect(() => {

    const handleMouseMove = (event) => {

      const x =
        (event.clientX / window.innerWidth - 0.5) * 20;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 20;

      mouseX.set(x);
      mouseY.set(y);

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };

  }, [mouseX, mouseY]);


  // =====================================
  // KEYBOARD EVENTS
  // =====================================

  useEffect(() => {

    const handleKeyDown = (event) => {

      // ESC → Go Back

      if (event.key === "Escape") {

        navigate(-1);

      }


      // ENTER → Home

      if (event.key === "Enter") {

        navigate("/");

      }

    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [navigate]);


  // =====================================
  // RETRY
  // =====================================

  const handleReload = () => {

    window.location.reload();

  };


  return (

    /*
    =====================================
    OUTER CONTAINER

    flex-1:
    Takes all remaining space inside <main>

    items-center:
    Vertical center

    justify-center:
    Horizontal center

    min-h-0:
    Prevents flex overflow problems
    =====================================
    */

    <div className="
        h-dvh
        w-full
        flex
        items-center
        justify-center
        px-4
        py-4
        bg-gray-50
        overflow-hidden
        relative
    ">


      {/* =====================================
                BACKGROUND GLOW
            ===================================== */}

      <motion.div

        style={{
          x: springX,
          y: springY,
        }}

        className="
                    absolute
                    w-52
                    h-52
                    sm:w-72
                    sm:h-72
                    rounded-full
                    bg-blue-200
                    blur-3xl
                    opacity-30
                    pointer-events-none
                "

      />


      {/* =====================================
                MAIN CARD
            ===================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}

        className="
                    relative
                    z-10
                    w-full
                    max-w-2xl
                    bg-white
                    border
                    border-gray-200
                    rounded-2xl
                    shadow-lg
                    px-5
                    py-5
                    sm:px-8
                    sm:py-7
                    text-center
                "

      >


        {/* =====================================
                    SEARCH ICON
                ===================================== */}

        <motion.div

          initial={{
            opacity: 0,
            scale: 0,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            delay: 0.15,
            type: "spring",
          }}

          whileHover={{
            rotate: 15,
            scale: 1.1,
          }}

          className="
                        mx-auto
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                        flex
                        items-center
                        justify-center
                    "

        >

          <FiSearch size={23} />

        </motion.div>


        {/* =====================================
                    404 NUMBER
                ===================================== */}

        <div className="
                    mt-1
                    flex
                    justify-center
                    items-center
                ">


          {/* FIRST 4 */}

          <motion.span

            initial={{
              opacity: 0,
              y: -35,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 150,
            }}

            whileHover={{
              y: -8,
              rotate: -5,
            }}

            className="
                            text-6xl
                            sm:text-8xl
                            font-black
                            text-blue-600
                            cursor-default
                        "

          >
            4

          </motion.span>


          {/* ZERO */}

          <motion.span

            initial={{
              opacity: 0,
              scale: 0,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            transition={{
              delay: 0.35,
              type: "spring",
              stiffness: 150,
            }}

            whileHover={{
              scale: 1.12,
              rotate: 5,
            }}

            className="
                            text-6xl
                            sm:text-8xl
                            font-black
                            text-indigo-500
                            cursor-default
                        "

          >
            0

          </motion.span>


          {/* SECOND 4 */}

          <motion.span

            initial={{
              opacity: 0,
              y: 35,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 150,
            }}

            whileHover={{
              y: -8,
              rotate: 5,
            }}

            className="
                            text-6xl
                            sm:text-8xl
                            font-black
                            text-blue-600
                            cursor-default
                        "

          >
            4

          </motion.span>

        </div>


        {/* =====================================
                    TITLE
                ===================================== */}

        <motion.h1

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.6,
          }}

          className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-900
                    "

        >

          Page Not Found

        </motion.h1>


        {/* =====================================
                    DESCRIPTION
                ===================================== */}

        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.75,
          }}

          className="
                        mt-2
                        text-xs
                        sm:text-sm
                        text-gray-500
                        leading-relaxed
                        max-w-md
                        mx-auto
                    "

        >

          Looks like you've taken a wrong turn.
          The page you're looking for doesn't
          exist or has been moved.

        </motion.p>


        {/* =====================================
                    BUTTONS
                ===================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.9,
          }}

          className="
                        flex
                        flex-col
                        sm:flex-row
                        justify-center
                        gap-2
                        mt-5
                    "

        >


          {/* =================================
                        HOME BUTTON
                    ================================= */}

          <motion.button

            onClick={() => navigate("/")}

            whileHover={{
              scale: 1.04,
              y: -2,
            }}

            whileTap={{
              scale: 0.95,
            }}

            className="
                            w-full
                            sm:w-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-lg
                            bg-blue-600
                            text-white
                            text-sm
                            font-semibold
                            hover:bg-blue-700
                            hover:shadow-md
                            transition
                        "

          >

            <FiHome size={17} />

            Go Home

          </motion.button>


          {/* =================================
                        BACK BUTTON
                    ================================= */}

          <motion.button

            onClick={() => navigate(-1)}

            whileHover={{
              scale: 1.04,
              y: -2,
            }}

            whileTap={{
              scale: 0.95,
            }}

            className="
                            w-full
                            sm:w-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-gray-700
                            text-sm
                            font-semibold
                            hover:bg-gray-50
                            transition
                        "

          >

            <FiArrowLeft size={17} />

            Go Back

          </motion.button>


          {/* =================================
                        RETRY BUTTON
                    ================================= */}

          <motion.button

            onClick={handleReload}

            whileHover={{
              scale: 1.04,
              y: -2,
            }}

            whileTap={{
              scale: 0.95,
            }}

            className="
                            w-full
                            sm:w-auto
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            text-gray-700
                            text-sm
                            font-semibold
                            hover:bg-gray-50
                            transition
                        "

          >

            <FiRefreshCw size={17} />

            Retry

          </motion.button>

        </motion.div>


        {/* =====================================
                    KEYBOARD HINT
                ===================================== */}

        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 1.05,
          }}

          className="
                        mt-4
                        text-[11px]
                        sm:text-xs
                        text-gray-400
                    "

        >

          Press{" "}

          <kbd className="
                        px-1.5
                        py-0.5
                        rounded
                        border
                        border-gray-300
                        bg-gray-50
                    ">
            Enter
          </kbd>

          {" "}for Home

          <span className="mx-1.5">
            •
          </span>

          <kbd className="
                        px-1.5
                        py-0.5
                        rounded
                        border
                        border-gray-300
                        bg-gray-50
                    ">
            Esc
          </kbd>

          {" "}for Back

        </motion.p>


        {/* =====================================
                    BRAND
                ===================================== */}

        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 1.15,
          }}

          className="
                        mt-3
                        text-xs
                        font-medium
                        text-gray-400
                    "

        >

          CareerConnect

        </motion.p>

      </motion.div>

    </div>

  );
}

export default NotFound;
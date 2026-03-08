// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../logo/Logo";
import { useState, useEffect } from "react";

function Navbar() {
  const links = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Schedule", to: "/dashboard/schedule" },
    { name: "Friends", to: "/dashboard/friends" },
  ];
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        width: scrolled ? "85%" : "100%",
        top: scrolled ? 12 : "auto",
        left: scrolled ? "7.5%" : "auto",
        borderRadius: scrolled ? 18 : 0,
        paddingLeft: scrolled ? 16 : 0,
        paddingRight: scrolled ? 16 : 0,
        paddingTop: scrolled ? 8 : 10,
        paddingBottom: scrolled ? 8 : 10,
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.7 },
      }}
      style={{
        position: scrolled ? "fixed" : "relative",
        zIndex: 50,
      }}
      className={`hidden lg:flex flex-row w-full justify-between items-center
        transition-colors duration-500
        ${scrolled
          ? "bg-primary-dark/60 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl"
          : "bg-transparent"
        }`}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="shrink-0"
      >
        <Logo />
      </motion.div>

      {/* Nav links */}
      <nav className="relative flex gap-0 text-white font-blinker md:text-sm lg:text-base xl:text-lg">
        {links.map((link, i) => {
          const isActive = location.pathname === link.to;
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={link.name}
              className="relative cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.div
                    layoutId="nav-bg-pill"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  />
                )}
              </AnimatePresence>

              <Link
                to={link.to}
                className={`relative z-10 block md:px-2 lg:px-3 xl:px-4 py-1.5 transition-colors duration-200
                  ${isActive || isHovered ? "text-white" : "text-white/55"}`}
              >
                {link.name}
              </Link>

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0, y: 2 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-light shadow-[0_0_6px_2px_rgba(141,134,201,0.8)]"
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    className="absolute bottom-0.5 left-[20%] right-[20%] h-px rounded-full bg-gradient-to-r from-transparent via-primary-light to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* CTA Buttons */}
      <div className="flex items-center gap-1.5 xl:gap-2 text-white font-semibold font-blinker md:text-sm lg:text-base xl:text-lg shrink-0">
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="md:px-3 lg:px-4 xl:px-6 py-1.5 border border-white/25 rounded-full cursor-pointer
              bg-white/6 backdrop-blur-md text-white
              hover:border-white/40 transition-colors duration-300"
          >
            Sign In
          </motion.button>
        </Link>

        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 4px 22px rgba(144,103,198,0.6)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative py-1.5 md:px-3 lg:px-4 xl:px-5 cursor-pointer bg-primary rounded-full
              overflow-hidden border border-primary-light/30
              shadow-[0_2px_14px_rgba(144,103,198,0.4)]"
          >
            <span className="absolute top-0 left-[10%] right-[10%] h-[45%] rounded-b-full
              bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <span className="relative z-10">Get Started</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default Navbar;
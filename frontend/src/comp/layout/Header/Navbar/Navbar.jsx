// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../logo/Logo";
import i18n from "i18next"
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

function Navbar() {
  const {t}=useTranslation(['common'])
  
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const links = [
    { name: t("navbar.dashboard"), to: "/dashboard" },
    { name: t("navbar.progress"), to: "/dashboard/progress" },
    { name: t("navbar.schedule"), to: "/dashboard/schedule" },
    { name: t("navbar.friends"), to: "/dashboard/friends" },
  ];
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

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
        width: scrolled ? "88%" : "100%",
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
        ${
          scrolled
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
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/15 backdrop-blur-md"
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

      {/* Right side buttons - Language, Login, Signup */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
          <motion.button
            onClick={() => changeLanguage("en")}
            className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${currentLang === 'en' 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence>
              {currentLang === 'en' && (
                <motion.div
                  layoutId="lang-active"
                  className="absolute inset-0 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">EN</span>
          </motion.button>
          
          <motion.button
            onClick={() => changeLanguage("ar")}
            className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${currentLang === 'ar' 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence>
              {currentLang === 'ar' && (
                <motion.div
                  layoutId="lang-active"
                  className="absolute inset-0 rounded-full bg-white/20 border border-white/20 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">AR</span>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Login & Signup Buttons */}
        {!location.pathname.startsWith('/dashboard') && (
          <>
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="md:px-3 lg:px-4 xl:px-6 py-1.5 border border-white/25 rounded-full cursor-pointer
                bg-white/6 backdrop-blur-md text-white
                hover:border-white/40 transition-colors duration-300"
              >
                {t("navbar.login")}
              </motion.button>
            </Link>

            <Link to="/signup">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 22px rgba(144,103,198,0.6)",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative py-1.5 text-white md:px-3 lg:px-4 xl:px-5 cursor-pointer bg-primary rounded-full
                overflow-hidden border border-primary-light/30
                shadow-[0_2px_14px_rgba(144,103,198,0.4)]"
              >
                <span
                  className="absolute top-0 left-[10%] right-[10%] h-[45%] rounded-b-full
                  bg-gradient-to-b from-white/20 to-transparent pointer-events-none"
                />
                <span className="relative z-10">{t("navbar.signup")}</span>
              </motion.button>
            </Link>
          </>
        )}

        {location.pathname.startsWith('/dashboard') && (
          <>
            {/* Notification */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-full
              bg-white/10 border border-white/20 backdrop-blur-md"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0201 2.91C8.71009 2.91 6.02009 5.6 6.02009 8.91V11.8C6.02009 12.41 5.76009 13.34 5.45009 13.86L4.30009 15.77C3.59009 16.95 4.08009 18.26 5.38009 18.7C9.69009 20.14 14.3401 20.14 18.6501 18.7C19.8601 18.3 20.3901 16.87 19.7301 15.77L18.5801 13.86C18.2801 13.34 18.0201 12.41 18.0201 11.8V8.91C18.0201 5.61 15.3201 2.91 12.0201 2.91Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M13.8699 3.2C13.5599 3.11 13.2399 3.04 12.9099 3C11.9499 2.88 11.0299 2.95 10.1699 3.2C10.4599 2.46 11.1799 1.94 12.0199 1.94C12.8599 1.94 13.5799 2.46 13.8699 3.2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.90002 21.18C9.36002 20.64 9.02002 19.88 9.02002 19.06"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
            </motion.button>

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer"
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Navbar;
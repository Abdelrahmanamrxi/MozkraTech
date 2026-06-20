// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../logo/Logo";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";

import { buildAssetUrl } from "../../../../utils/assetUrl";
import Notifications from "../Notifications/Notifications";
import { useNotificationUnreadCount } from "../../../../hooks/useNotifications";

function Navbar({ profileImage }) {
  const { t } = useTranslation(["common"]);
  const profileImageUrl = profileImage ? buildAssetUrl(profileImage) : "";

  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef(null);

  // Landing page section scroll links
  const sectionLinks = [
    { name:t('navbar.about'), sectionId: "hero" },
    { name: t("navbar.features"), sectionId: "features" },
    { name: t("navbar.testimonials"), sectionId: "testimonials" },
  ];

  // Dashboard navigation links
  const dashboardLinks = [
    { name: t("navbar.dashboard"), to: "/dashboard" },
    { name: t("navbar.progress"), to: "/dashboard/progress" },
    { name: t("navbar.schedule"), to: "/dashboard/schedule" },
    { name: t("navbar.quizzes"), to: "/dashboard/quizzes" },
    { name: t("navbar.friends"), to: "/dashboard/friends" },
    { name: t("navbar.Messages"), to: "/dashboard/messages" },
  ];

  const links = isLandingPage ? sectionLinks : dashboardLinks;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const isDashboard = location.pathname.startsWith("/dashboard");
  const unreadCount = isDashboard ? useNotificationUnreadCount(isDashboard) : 0;

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
        width: scrolled  ? "88%" : "100%",
        top: scrolled  ? 12 : "auto",
        left: scrolled  ? "7.5%" : "auto",
        borderRadius: scrolled  ? 18 : 0,
        paddingLeft: scrolled  ? 16 : 0,
        paddingRight: scrolled  ? 16 : 0,
        paddingTop: scrolled  ? 8 : 10,
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
          const isActive = isLandingPage
            ? false
            : location.pathname === link.to;
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

              {isLandingPage ? (
                <button
                  onClick={() => scrollToSection(link.sectionId)}
                  className={`relative z-10 block md:px-2 lg:px-3 xl:px-4 py-1.5 transition-colors duration-200 bg-transparent border-none cursor-pointer
                    ${isHovered ? "text-white" : "text-white/55"}`}
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  to={link.to}
                  className={`relative z-10 block md:px-2 lg:px-3 xl:px-4 py-1.5 transition-colors duration-200
                    ${isActive || isHovered ? "text-white" : "text-white/55"}`}
                >
                  {link.name}
                </Link>
              )}

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
              ${
                currentLang === "en"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence>
              {currentLang === "en" && (
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
              ${
                currentLang === "ar"
                  ? "text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence>
              {currentLang === "ar" && (
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
        {!location.pathname.startsWith("/dashboard") && (
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

        {isDashboard && (
          <>
            {/* Notifications */}
            <motion.button
              ref={bellRef}
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 cursor-pointer"
              aria-label="Toggle notifications"
            >
              <Bell size={18} className="text-white/80" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-4 px-1 rounded-full flex items-center justify-center text-[0.65rem] font-semibold text-white bg-red-500 border border-white/20 shadow-[0_0_6px_rgba(0,0,0,0.3)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Profile */}
            <Link to="/dashboard/myprofile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={18} className="text-white/70" />
                )}
              </motion.div>
            </Link>
          </>
        )}
      </div>

      {notifOpen && typeof document !== "undefined"
        ? createPortal(
            <Notifications
              setNotifications={setNotifOpen}
              bellRef={bellRef}
              isOpen={notifOpen}
            />,
            document.body,
          )
        : null}
    </motion.div>
  );
}

export default Navbar;

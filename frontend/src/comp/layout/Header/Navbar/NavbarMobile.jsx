/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";
import Logo from "../../../logo/Logo";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", Icon: Home, href: "/home" },
  { label: "Dashboard", Icon: LayoutDashboard, href: "/dashboard" },
  { label: "Schedule", Icon: Calendar, href: "/dashboard/schedule" },
  { label: "Friends", Icon: Users, href: "/dashboard/friends" },
];

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── Top bar with line baked in as borderBottom ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "rgba(34,29,54,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "2px solid rgba(200, 200, 220, 0.75)",
          boxShadow: "0 2px 12px rgba(200, 200, 220, 0.3)",
        }}
        className="lg:hidden w-full px-5 py-3 flex flex-row justify-between items-center"
      >
        <Logo />
        <motion.button
          onClick={() => setOpen(true)}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Open menu"
          style={{
            background: "rgba(144,103,198,0.15)",
            border: "1px solid rgba(144,103,198,0.3)",
          }}
          className="rounded-2xl p-2 flex items-center cursor-pointer"
        >
          <Menu className="text-secondary-light" size={22} />
        </motion.button>
      </div>

      {/* Spacer */}
      <div className="lg:hidden" style={{ height: "62px" }} />

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(10,7,25,0.82)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 42,
              mass: 0.8,
            }}
            className="fixed top-0 right-0 bottom-0 z-50 w-3/4 flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(34,29,54,0.99) 0%, rgba(20,16,40,1) 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.55)",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            {/* Glow accents */}
            <div
              className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at top right, rgba(144,103,198,0.18) 0%, transparent 60%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at bottom left, rgba(144,103,198,0.09) 0%, transparent 60%)",
              }}
            />

            {/* Drawer Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Logo />
              <motion.button
                onClick={() => setOpen(false)}
                whileTap={{ scale: 0.88 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-label="Close menu"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                className="rounded-xl p-1.5 flex items-center cursor-pointer"
              >
                <X className="text-white/60" size={20} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 pt-6 pb-4 flex flex-col gap-1.5 overflow-y-auto">
              <p
                className="text-[0.63rem] font-semibold tracking-[0.15em] uppercase mb-3 pl-2"
                style={{ color: "rgba(141,134,201,0.5)" }}
              >
                Navigation
              </p>

              {navLinks.map(({ label, Icon, href }, i) => {
                const isActive = location.pathname === href;
                const isHovered = hoveredIndex === i;

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.04 + 0.03,
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                    }}
                  >
                    <Link
                      to={href}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl no-underline"
                      style={{
                        background: isActive
                          ? "rgba(144,103,198,0.2)"
                          : isHovered
                            ? "rgba(144,103,198,0.09)"
                            : "rgba(255,255,255,0.03)",
                        border: isActive
                          ? "1px solid rgba(144,103,198,0.42)"
                          : isHovered
                            ? "1px solid rgba(144,103,198,0.22)"
                            : "1px solid rgba(255,255,255,0.05)",
                        transition:
                          "background 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      <span className="flex items-center gap-3.5">
                        <span
                          className="flex items-center justify-center w-9 h-9 rounded-[11px] relative overflow-hidden"
                          style={{
                            background: isActive
                              ? "rgba(144,103,198,0.38)"
                              : isHovered
                                ? "rgba(144,103,198,0.22)"
                                : "rgba(144,103,198,0.12)",
                            border: "1px solid rgba(144,103,198,0.18)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <span
                            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[10px]"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                            }}
                          />
                          <Icon
                            size={17}
                            style={{
                              color: isActive
                                ? "#d4b8f8"
                                : isHovered
                                  ? "#b590e8"
                                  : "#9067c6",
                              position: "relative",
                              zIndex: 1,
                              transition: "color 0.15s ease",
                            }}
                          />
                        </span>

                        <span
                          className="font-blinker text-[1rem] font-medium"
                          style={{
                            color: isActive
                              ? "white"
                              : isHovered
                                ? "rgba(255,255,255,0.88)"
                                : "rgba(255,255,255,0.58)",
                            transition: "color 0.15s ease",
                          }}
                        >
                          {label}
                        </span>
                      </span>

                      <span className="flex items-center gap-2">
                        {isActive && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: "#9067c6",
                              boxShadow: "0 0 6px 2px rgba(144,103,198,0.6)",
                            }}
                          />
                        )}
                        <ChevronRight
                          size={15}
                          style={{
                            color: isActive
                              ? "rgba(196,168,240,0.9)"
                              : isHovered
                                ? "rgba(255,255,255,0.45)"
                                : "rgba(255,255,255,0.18)",
                            transition:
                              "color 0.15s ease, transform 0.15s ease",
                            transform: isHovered
                              ? "translateX(2px)"
                              : "translateX(0)",
                          }}
                        />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.22,
                type: "spring",
                stiffness: 340,
                damping: 30,
              }}
              className="px-4 pt-4 pb-8 flex flex-col gap-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <Link
                  to="/login"
                  className="block text-center py-3.5 rounded-2xl text-[0.95rem] font-medium no-underline font-blinker"
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.68)";
                  }}
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                style={{ borderRadius: 16 }}
              >
                <Link
                  to="/signup"
                  className="relative block text-center py-3.5 rounded-2xl text-[0.95rem] font-semibold no-underline font-blinker overflow-hidden"
                  style={{
                    color: "white",
                    background:
                      "linear-gradient(135deg, #9067c6 0%, #7a4fb0 100%)",
                    border: "1px solid rgba(144,103,198,0.38)",
                    boxShadow:
                      "0 4px 18px rgba(144,103,198,0.38), 0 1px 0 rgba(255,255,255,0.1) inset",
                  }}
                >
                  <span
                    className="absolute top-0 left-[10%] right-[10%] h-[45%] rounded-b-full pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 100%)",
                    }}
                  />
                  <span className="relative z-10">Get Started →</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

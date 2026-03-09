import React from "react";
import { Bell, UserCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationsUtilityRow({
  notifOpen,
  setNotifOpen,
  unreadCount,
  notifications,
}) {
  return (
    <>
      {/* Utility row: Notifications + Profile */}
      <div
        className="flex items-center justify-between gap-3 px-3 py-3 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <motion.button
          type="button"
          onClick={() => setNotifOpen((v) => !v)}
          whileTap={{ scale: 0.97 }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer"
          aria-expanded={notifOpen}
          aria-label="Toggle notifications"
          style={{
            background: "rgba(144,103,198,0.10)",
            border: "1px solid rgba(144,103,198,0.22)",
          }}
        >
          <span className="flex items-center gap-2">
            <span className="relative">
              <Bell size={18} style={{ color: "rgba(255,255,255,0.82)" }} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[0.6rem] font-semibold"
                  style={{
                    background: "#9067c6",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxShadow: "0 0 10px rgba(144,103,198,0.55)",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <span
              className="font-blinker text-[0.95rem] font-medium"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Notifications
            </span>
          </span>

          <ChevronDown
            size={16}
            style={{
              color: "rgba(255,255,255,0.55)",
              transform: notifOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
            }}
          />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer"
          aria-label="Profile"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <UserCircle2 size={22} style={{ color: "rgba(255,255,255,0.72)" }} />
        </motion.button>
      </div>

      {/* Notifications panel (inside menu) */}
      <AnimatePresence initial={false}>
        {notifOpen && (
          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden rounded-2xl"
            style={{
              background: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span
                className="text-[0.75rem] font-semibold tracking-[0.12em] uppercase"
                style={{ color: "rgba(141,134,201,0.65)" }}
              >
                Recent
              </span>
              <button
                type="button"
                className="text-[0.78rem] font-medium"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onClick={() => setNotifOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="px-2 py-2 flex flex-col gap-1.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-3 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="font-blinker text-[0.92rem] font-medium"
                    style={{ color: "rgba(255,255,255,0.82)" }}
                  >
                    {n.title}
                  </div>
                  <div
                    className="text-[0.82rem] leading-snug"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                  >
                    {n.body}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


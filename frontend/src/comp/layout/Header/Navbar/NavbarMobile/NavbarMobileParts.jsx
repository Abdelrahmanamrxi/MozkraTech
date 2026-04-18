import React from "react";
import { Bell, UserCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Notifications from "../../Notifications/Notifications";

export function NotificationsUtilityRow({
  notifOpen,
  setNotifOpen,
  unreadCount,
  notifications,
}) {

  const {t}=useTranslation(['common'])
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
              {t('navbar.notifications.title')}
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

      {/* Notifications overlay using shared Notifications component */}
      <AnimatePresence initial={false}>
        {notifOpen && (
          <motion.div
            key="mobile-notification-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center px-3"
          >
            <Notifications setNotifications={setNotifOpen} bellRef={null} mobile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


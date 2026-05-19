import React from "react";
import { Bell, UserCircle2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import Notifications from "../../Notifications/Notifications";
import { Link } from "react-router-dom";
import { buildAssetUrl } from "../../../../../utils/assetUrl";

export function NotificationsUtilityRow({
  notifOpen,
  setNotifOpen,
  unreadCount,
  profileImage,
}) {
  const { t } = useTranslation(["common"]);
  const profileImageUrl = profileImage ? buildAssetUrl(profileImage) : "";
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
                <span className="absolute -top-1.5 -inset-e-1.5 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[0.6rem] font-semibold bg-red-500 text-white border border-white/25 shadow-[0_0_10px_rgba(239,68,68,0.55)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            <span
              className="font-blinker text-[0.95rem] font-medium"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {t("navbar.notifications.title")}
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
        <Link to="/dashboard/myprofile">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden"
            aria-label="Profile"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2
                size={22}
                style={{ color: "rgba(255,255,255,0.72)" }}
              />
            )}
          </motion.button>
        </Link>
      </div>

      {/* Notifications overlay using shared Notifications component */}
      {notifOpen && typeof document !== "undefined"
        ? createPortal(
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-9999 flex items-center justify-center bg-black/55 px-4 py-[max(16px,env(safe-area-inset-top))]"
            >
              <Notifications
                setNotifications={setNotifOpen}
                bellRef={null}
                mobile
                isOpen={notifOpen}
              />
            </motion.div>,
            document.body,
          )
        : null}
    </>
  );
}

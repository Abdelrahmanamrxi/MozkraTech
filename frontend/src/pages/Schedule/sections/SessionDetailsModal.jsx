/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  formatDuration,
  formatIsoDateLabel,
  formatIsoTimeLabel,
} from "../utils/timeUtility";
import { useTranslation } from "react-i18next";

const SessionDetailsModal = ({ session, isOpen, onClose }) => {
  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  if (!session || !isOpen) return null;

  // Status configuration
  const statusConfig = {
    scheduled: {
      color: "bg-yellow-500/20 border-yellow-500/30",
      textColor: "text-yellow-400",
      icon: Clock,
    },
    completed: {
      color: "bg-green-500/20 border-green-500/30",
      textColor: "text-green-400",
      icon: CheckCircle,
    },
    missed: {
      color: "bg-red-500/20 border-red-500/30",
      textColor: "text-red-400",
      icon: XCircle,
    },
    cancelled: {
      color: "bg-gray-500/20 border-gray-500/30",
      textColor: "text-gray-400",
      icon: AlertCircle,
    },
  };

  const status = session.status || "scheduled";
  const config = statusConfig[status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  const formatTime = (dateString) => formatIsoTimeLabel(dateString, locale);
  const formatFullDate = (dateString) => formatIsoDateLabel(dateString, locale);
  const durationLabel = formatDuration(session.startTime, session.endTime, {
    hourLabel: t("time.hourShort"),
    minuteLabel: t("time.minuteShort"),
    formatNumber: (value) => new Intl.NumberFormat(locale).format(value),
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="mx-4 rounded-[24px] border border-white/10 bg-gradient-to-br from-[#2a2242] to-[#1B142D] p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {session.name}
                  </h3>
                  <p className="text-xs text-white/50">
                    {formatFullDate(session.startTime)}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${config.color}`}
              >
                <StatusIcon size={16} className={config.textColor} />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  {t(`status.${status}`)}
                </span>
              </motion.div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Start Time */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10"
                >
                  <Clock size={18} className="text-[#9B7EDE] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 mb-0.5">
                      {t("labels.startTime")}
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {formatTime(session.startTime)}
                    </p>
                  </div>
                </motion.div>

                {/* End Time */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10"
                >
                  <Clock size={18} className="text-[#9B7EDE] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 mb-0.5">
                      {t("labels.endTime")}
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {formatTime(session.endTime)}
                    </p>
                  </div>
                </motion.div>

                {/* Duration */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10"
                >
                  <div className="w-5 h-5 rounded-full bg-[#9B7EDE]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#C084FC]">⏱</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 mb-0.5">
                      {t("labels.duration")}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {durationLabel}
                    </p>
                  </div>
                </motion.div>

                {/* Subject (if available) */}
                {session.subjectId && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#9B7EDE]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#C084FC]">
                        📚
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/60 mb-0.5">
                        {t("labels.subject")}
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
                        {session.subjectId}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer Action */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ backgroundColor: "rgba(155, 126, 222, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full mt-6 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-white/70 hover:text-white font-medium text-sm transition-colors"
              >
                {t("details.close")}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionDetailsModal;

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../middleware/api";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDuration } from "../utils/timeUtility";

const DropConfirmationModal = ({ pendingDrop, onConfirm, onCancel }) => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale);

  // Format time display
  const formatTime = (isoString) => {
    if (!isoString) return t("dropConfirmation.notAvailable");
    const date = new Date(isoString);
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return t("dropConfirmation.notAvailable");
    const date = new Date(isoString);
    return date.toLocaleDateString(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // API mutation for moving session
  const moveSessionMutation = useMutation({
    mutationFn: async () => {
      if (!pendingDrop) return;

      const response = await api.post("/sessions/move", {
        sessionId: pendingDrop.sessionId,
        startTime: pendingDrop.newStartTime,
        endTime: pendingDrop.newEndTime,
      });

      return response.data;
    },
    onSuccess: () => {
      // Invalidate schedule query to refresh
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
      onConfirm?.();
    },
    onError: (error) => {
      console.error("Failed to move session:", error);
    },
  });

  const handleConfirm = () => {
    moveSessionMutation.mutate();
  };

  if (!pendingDrop) return null;

  const isLoading = moveSessionMutation.isPending;
  const error = moveSessionMutation.error;
  const durationLabel = pendingDrop
    ? formatDuration(pendingDrop.newStartTime, pendingDrop.newEndTime, {
        hourLabel: t("time.hourShort"),
        minuteLabel: t("time.minuteShort"),
        formatNumber: (value) => numberFormatter.format(value),
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2F2844] border border-white/10 rounded-[20px] p-6 w-full max-w-sm shadow-2xl"
      >
        <h2 className="text-white font-semibold text-lg mb-4">
          {t("dropConfirmation.title")}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">
              {error?.response?.data?.message || t("dropConfirmation.error")}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Session name */}
          <div>
            <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
              {t("labels.session")}
            </p>
            <p className="text-white text-sm">
              {pendingDrop.sessionName || t("dropConfirmation.untitledSession")}
            </p>
          </div>

          {/* From time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
                {t("labels.from")}
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white">
                <p className="font-medium">
                  {formatDate(pendingDrop.oldStartTime)}
                </p>
                <p className="text-xs text-white/70">
                  {formatTime(pendingDrop.oldStartTime)}
                </p>
              </div>
            </div>

            {/* To time */}
            <div>
              <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
                {t("labels.to")}
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white">
                <p className="font-medium">
                  {formatDate(pendingDrop.newStartTime)}
                </p>
                <p className="text-xs text-white/70">
                  {formatTime(pendingDrop.newStartTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
              {t("labels.duration")}
            </p>
            <p className="text-white text-sm">
              {durationLabel || t("dropConfirmation.oneHour")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-[10px] border border-white/20 text-white text-sm hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("buttons.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-[10px] bg-[#9B7EDE] text-white text-sm hover:bg-[#7C5FBD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader size={16} className="animate-spin" />}
            {t("buttons.confirm")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DropConfirmationModal;

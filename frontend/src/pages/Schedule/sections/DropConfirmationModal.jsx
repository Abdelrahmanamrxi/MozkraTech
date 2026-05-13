// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../middleware/api";
import { Loader } from "lucide-react";

const DropConfirmationModal = ({
  pendingDrop,
  onConfirm,
  onCancel,
  t,
}) => {
  const queryClient = useQueryClient();

  // Format time display
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
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
          {t?.moveSession || "Move Session"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">
              {error?.response?.data?.message ||
                "Failed to move session. Please try again."}
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {/* Session name */}
          <div>
            <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
              {t?.session || "Session"}
            </p>
            <p className="text-white text-sm">
              {pendingDrop.sessionName || "Untitled Session"}
            </p>
          </div>

          {/* From time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
                {t?.from || "From"}
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white">
                <p className="font-medium">{formatDate(pendingDrop.oldStartTime)}</p>
                <p className="text-xs text-white/70">{formatTime(pendingDrop.oldStartTime)}</p>
              </div>
            </div>

            {/* To time */}
            <div>
              <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
                {t?.to || "To"}
              </p>
              <div className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white">
                <p className="font-medium">{formatDate(pendingDrop.newStartTime)}</p>
                <p className="text-xs text-white/70">{formatTime(pendingDrop.newStartTime)}</p>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-[11px] text-[#B8A7E5] uppercase tracking-wide mb-1">
              {t?.duration || "Duration"}
            </p>
            <p className="text-white text-sm">
              {pendingDrop.duration || "1 hour"}
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
            {t?.cancel || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-[10px] bg-[#9B7EDE] text-white text-sm hover:bg-[#7C5FBD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader size={16} className="animate-spin" />}
            {t?.confirm || "Confirm"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DropConfirmationModal;

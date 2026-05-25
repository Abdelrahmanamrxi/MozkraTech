/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../../middleware/api";
import { useTranslation } from "react-i18next";

async function deleteAIConversation(conversationId) {
  const response = await api.delete(`/chat/ai/${conversationId}`);
  return response.data;
}

function DeleteAIConversationModal({ conversation, onCancel, onSuccess }) {
  const { t, i18n } = useTranslation("chatbot");
  const isRTL = i18n.language === "ar";
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (conversationId) => deleteAIConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onSuccess?.();
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t("deleteModal.error");
      setError(errorMsg);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#231D36] border border-white/10 rounded-[18px] p-6 w-full max-w-sm shadow-2xl ${isRTL ? "text-right" : "text-left"}`}
      >
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-red-500 font-semibold text-lg">{t("deleteModal.title")}</h2>
          <p className="text-white/60 text-xs mt-1">
            {t("deleteModal.description")}
          </p>
        </div>

        {error && (
          <p className="text-sm text-center text-red-600 mb-3">{error}</p>
        )}

        {/* Conversation Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
          <div>
            <p className="text-[10px] text-[#B8A7E5] uppercase">{t("deleteModal.conversationLabel")}</p>
            <p className="text-white font-semibold text-sm mt-1 truncate">
              {conversation?.subject || "Untitled Conversation"}
            </p>
          </div>
          <div className="text-[10px] text-[#B8A7E5] uppercase">{t("deleteModal.createdLabel")}</div>
          <p className="text-white text-sm">
            {conversation?.createdAt
              ? new Date(conversation.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleteMutation.isPending}
            className="flex-1 py-2.5 rounded-[10px] text-sm text-[#B8A7E5] bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t("deleteModal.cancel")}
          </button>
          <button
            onClick={() => deleteMutation.mutate(conversation._id)}
            disabled={deleteMutation.isPending}
            className="flex-1 py-2.5 rounded-[10px] text-sm text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("deleteModal.deleting")}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{t("deleteModal.delete")}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DeleteAIConversationModal;

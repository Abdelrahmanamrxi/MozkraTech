import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { SquarePlus, MessageSquare, ChevronLeft, Trash2, Search, Clock,LoaderCircle  } from "lucide-react";
import logo from "../../../assets/logo.png";
import api from "../../../middleware/api";
import { useQuery } from "@tanstack/react-query";
import DeleteAIConversationModal from "./DeleteAIConversationModal";
import { useTranslation } from "react-i18next";

const mockConversations = [
  { id: 1, title: "Math Calculus Help", preview: "Can you explain derivatives?", time: "2m ago", active: true },
  { id: 2, title: "Essay Outline - History", preview: "Help me structure my WW2 essay", time: "1h ago", active: false },
  { id: 3, title: "Physics Study Plan", preview: "I need a weekly schedule for...", time: "3h ago", active: false },
  { id: 4, title: "Python Debugging", preview: "My loop isn't working right", time: "Yesterday", active: false },
  { id: 5, title: "Biology Flashcards", preview: "Create flashcards for cells", time: "2d ago", active: false },
  { id: 6, title: "SAT Prep Strategy", preview: "How should I prepare for...", time: "3d ago", active: false },
];
const FetchAllAIConversations=async ()=>{
  const response=await api.get('/chat/ai')
  return response.data

}

export default function ChatSidebar({ isOpen, onClose,activeChat,setActiveChat }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("chatbot");
  const isRTL = i18n.language === "ar";
  const {data,isLoading,error}=useQuery({
    queryKey:['conversations'],
    queryFn:()=>FetchAllAIConversations(),
    retry:false,
  })

  const [hoveredChat, setHoveredChat] = useState(null);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed lg:sticky top-0 left-0 z-40 lg:z-auto h-screen flex flex-col self-stretch"
              style={{
                width: 280,
                background: "linear-gradient(160deg, #2A2040 0%, #1E1830 100%)",
                borderRight: "1px solid rgba(155, 126, 222, 0.15)",
                flexShrink: 0,
              }}
            >
            {/* Top: Logo + close */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="logo" className="w-8 h-8 rounded-lg object-contain" />
                <span
                  className="text-sm font-bold font-Inter text-[#C4B0F0] tracking-wide"
                  
                >
                  MozkraTech AI
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "rgba(82, 70, 107, 0.6)", color: "#9B7EDE" }}
                title={isRTL ? "إغلاق الشريط" : "Close sidebar"}
              >
                <ChevronLeft size={15} />
              </motion.button>
            </div>

            {/* New Chat button */}
            <div className="px-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveChat(null)}
                className="w-full cursor-pointer flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "linear-gradient(135deg, #9B7EDE 0%, #7C5FBD 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(124, 95, 189, 0.35)",
                }}
              >
                <SquarePlus size={16} />
                {t("sidebar.newChat")}
              </motion.button>
            </div>


            {/* Section label */}
            <div className="px-5 mb-2 flex items-center gap-2">
              <Clock size={11} style={{ color: "#5A4E78" }} />
              <span className={`text-[10px] uppercase tracking-widest ${isRTL ? "text-right" : "text-left"}`} style={{ color: "#5A4E78" }}>
                {t("sidebar.recent")}
              </span>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-thumb]:bg-[#3D3060]
              [&::-webkit-scrollbar-track]:bg-transparent">
              <AnimatePresence initial={false}>

                {isLoading && <p className="flex flex-row gap-3 text-white font-Inter text-base items-center justify-center">{t("sidebar.loading")} <LoaderCircle/></p>}
                {error && (
                  <div className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-[11px] text-red-200">
                    <p className="font-semibold">{t("sidebar.loadErrorTitle")}</p>
                    <p className="text-red-200/80">{error?.message || t("sidebar.loadErrorHint")}</p>
                  </div>
                )}
                {data?.conversations.length>0 && data?.conversations.map((chat, i) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: i * 0.04 }}
                    onMouseEnter={() => setHoveredChat(chat._id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    onClick={() => setActiveChat(chat._id)}
                    className="group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                    style={{
                      background:
                        activeChat === chat._id
                          ? "rgba(155, 126, 222, 0.18)"
                          : hoveredChat === chat._id
                          ? "rgba(82, 70, 107, 0.4)"
                          : "transparent",
                      border:
                        activeChat === chat._id
                          ? "1px solid rgba(155, 126, 222, 0.3)"
                          : "1px solid transparent",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          activeChat === chat._id
                            ? "rgba(155, 126, 222, 0.3)"
                            : "rgba(82, 70, 107, 0.5)",
                      }}
                    >
                      <MessageSquare
                        size={11}
                        style={{ color: activeChat === chat._id ? "#C4B0F0" : "#7C6BA0" }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold truncate leading-tight"
                        style={{ color: activeChat === chat.id ? "#E2D9F3" : "#A899CC" }}
                      >
                        {chat.subject}
                      </p>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "#5A4E78" }}>
                     
                      </p>
                    </div>

                    {/* Time / Delete */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {hoveredChat === chat._id ? (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConversationToDelete(chat);
                            setShowDeleteModal(true);
                          }}
                          className="w-5 h-5 rounded-md flex items-center justify-center transition-colors"
                          style={{ color: "#9B7EDE", background: "rgba(155,126,222,0.15)" }}
                        >
                          <Trash2 size={10} />
                        </motion.button>
                      ) : (
                        <span className="text-[9px]" style={{ color: "#4A3F66" }}>
                          {new Date(chat.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Active indicator */}
                    {activeChat === chat._id && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                        style={{ background: "#9B7EDE" }}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {data?.conversations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs" style={{ color: "#4A3F66" }}>
                    {t("sidebar.noChats")}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom: Back button */}
            <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(155, 126, 222, 0.1)" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                style={{
                  background: "rgba(82, 70, 107, 0.4)",
                  color: "#9B7EDE",
                  border: "1px solid rgba(155, 126, 222, 0.15)",
                }}
              >
                <ChevronLeft size={13} />
                {t("sidebar.back")}
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>

    {/* Delete Modal */}
    <AnimatePresence>
      {showDeleteModal && conversationToDelete && (
        <DeleteAIConversationModal
          conversation={conversationToDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setConversationToDelete(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setConversationToDelete(null);
            // Reset to default greeting if the deleted conversation was active
            if (activeChat === conversationToDelete._id) {
              setActiveChat(null);
            }
          }}
        />
      )}
    </AnimatePresence>
    </>
  );
}
/* eslint-disable no-unused-vars */
import { useRef,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft } from "lucide-react";
import { SendIcon, AttachIcon, RobotIcon } from "../../comp/ui/Icons";
import Message from "./sections/Message";
import TypingIndicator from "./sections/TypingIndicator";
import Suggestions from "./sections/Suggestions";
import ChatSidebar from "./sections/ChatSidebar";
import { useTranslation } from "react-i18next";
import useChatbot from "../../hooks/useChatbot";

export default function Chatbot() {
  const { t, i18n } = useTranslation("chatbot");
  const timeLocale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const isRTL = i18n.language === "ar";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    // Conversation
    activeChat,
    setActiveChat,
    handleNewConversation,
    // Messages
    messages,
    // Input
    input,
    setInput,
    sendMessage,
    handleKey,
    // Status
    isTyping,
    isSending,
    isExpanded,
    setIsExpanded,
    // Files
    uploadedFile,
    setUploadedFile,
    filePreview,
    setFilePreview,
    previewMeta,
    setPreviewMeta,
    showDocPreview,
    setShowDocPreview,
    handleFileUpload,
    // Errors
    errorMessages,
    // Scroll
    messagesContainerRef,
    messagesEndRef,
    handleMessagesScroll,
  } = useChatbot({ t, timeLocale });

  return (
    <div className="flex w-full flex-row h-screen overflow-hidden main-background">
      <ChatSidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 relative p-3 min-w-0">
        <div className={`${!isExpanded ? "pb-10 px-3" : ""}`}>

          {/* Background blur overlay */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
                style={{ backdropFilter: "blur(8px)" }}
              />
            )}
          </AnimatePresence>

          {/* Main container */}
          <motion.div
            className="flex flex-col h-screen w-full px-4 sm:px-5 pb-20 pt-3 sm:pt-5 font-Inter max-w-4xl mx-auto"
            animate={isExpanded ? { scale: 0.9, opacity: 0.6 } : { scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSidebarOpen((v) => !v)}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={{
                  background: sidebarOpen
                    ? "rgba(155, 126, 222, 0.2)"
                    : "rgba(82, 70, 107, 0.5)",
                  border: "1px solid rgba(155, 126, 222, 0.2)",
                  color: "#9B7EDE",
                }}
              >
                <PanelLeft size={16} />
              </motion.button>

              <div
                style={{ background: "linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)" }}
                className="w-9 sm:w-11 h-9 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-900/40 flex-shrink-0"
              >
                <RobotIcon />
              </div>

              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                  MozkraTech AI
                </h1>
                <div className="flex flex-row items-center gap-2 mt-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span
                    style={{ color: "#B8A7E5" }}
                    className="text-xs font-Inter text-violet-400 truncate"
                  >
                    {t("header.status")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Chat box */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col bg-[#3D3555] border border-[#9B7EDE33] rounded-2xl sm:rounded-3xl rounded-b-none overflow-hidden min-h-0"
            >
              {/* Messages */}
              <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-3 sm:gap-5 min-h-0 w-full
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#52466B] [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {errorMessages.length > 0 && (
                  <div className={`mb-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 ${isRTL ? "text-right" : "text-left"}`}>
                    <p className="font-semibold">{t("errors.title")}</p>
                    {errorMessages.map((msg, index) => (
                      <p key={`${index}-${msg}`} className="text-red-200/80">{msg}</p>
                    ))}
                  </div>
                )}
                {messages.map((msg) => (
                  <Message key={msg.id} msg={msg} />
                ))}
                <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                <div ref={messagesEndRef} className="w-full" />
              </div>

              {/* Suggestions */}
              <AnimatePresence>
                {!isExpanded && !activeChat && (
                  <motion.div
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 sm:px-5 pt-2 sm:pt-3 pb-2 border-t border-violet-900/20"
                  >
                    <p className={`text-[9px] sm:text-[10px] uppercase text-gray-500/80 tracking-widest mb-1.5 sm:mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                      {t("suggestions.label")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Suggestions sendMessage={sendMessage} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 border-t border-[#52466B] bg-[#3D3555]">
                {/* Mobile attachment row */}
                <div className="flex sm:hidden gap-2 items-center mb-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: "#52466B" }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <AttachIcon />
                  </motion.button>
                  <span className="text-xs text-gray-400">{t("input.attach")}</span>
                </div>

                <div className="flex items-end gap-1.5 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: "#52466B" }}
                    onClick={() => fileInputRef.current?.click()}
                    className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <AttachIcon />
                  </motion.button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    className="hidden"
                  />

                  <div className="flex-1 relative flex items-end min-w-0">
                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder={t("input.placeholder")}
                      className={`w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#52466B] text-sm text-white placeholder-[#858585] resize-none outline-none transition-all leading-5 font-[Inter] ${isRTL ? "text-right" : "text-left"}`}
                      style={{ minHeight: 36, maxHeight: 100 }}
                      spellCheck="false"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isSending}
                    style={{ background: "#9B7EDE" }}
                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer transition-opacity"
                  >
                    <SendIcon />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Expanded chat modal */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
              >
                <motion.div className="w-full h-full sm:max-w-7xl flex flex-col bg-[#3D3555] border border-[#9B7EDE33] rounded-none sm:rounded-3xl overflow-hidden shadow-2xl">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 bg-[#3D3555]">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        style={{ background: "linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)" }}
                        className="w-7 sm:w-9 h-7 sm:h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      >
                        <RobotIcon />
                      </div>
                      <h2 className="text-sm sm:text-lg font-semibold text-white truncate">
                        {t("chat.assistantTitle")}
                      </h2>
                      {previewMeta && (
                        <span className="text-xs text-violet-400 ml-2 px-2 sm:px-3 py-1 bg-violet-900/20 rounded-full truncate max-w-[120px] sm:max-w-none">
                          📎{" "}
                          {previewMeta.name.length > 15
                            ? previewMeta.name.substring(0, 12) + "..."
                            : previewMeta.name}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsExpanded(false);
                        setUploadedFile(null);
                        setFilePreview(null);
                        setPreviewMeta(null);
                      }}
                      className="text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 ml-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 flex flex-col sm:flex-row overflow-hidden w-full">
                    {/* Chat section */}
                    <motion.div
                      layout
                      className={`flex flex-col overflow-hidden ${
                        previewMeta && filePreview && showDocPreview
                          ? "w-full sm:w-1/2 border-b sm:border-b-0 border-violet-900/20"
                          : "w-full"
                      }`}
                    >
                      <div
                        ref={messagesContainerRef}
                        onScroll={handleMessagesScroll}
                        className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4 w-full min-h-0
                        [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#52466B] [&::-webkit-scrollbar-track]:bg-transparent"
                      >
                        {errorMessages.length > 0 && (
                          <div className={`mb-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 ${isRTL ? "text-right" : "text-left"}`}>
                            <p className="font-semibold">{t("errors.title")}</p>
                            {errorMessages.map((msg, index) => (
                              <p key={`${index}-${msg}`} className="text-red-200/80">{msg}</p>
                            ))}
                          </div>
                        )}
                        {messages.map((msg) => (
                          <Message key={msg.id} msg={msg} />
                        ))}
                        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                        <div ref={messagesEndRef} className="w-full" />
                      </div>

                      {/* Modal Input */}
                      <div className="flex flex-col gap-2 px-4 sm:px-8 py-3 sm:py-5 border-t border-violet-900/20 bg-[#3D3555]">
                        <div className="flex sm:hidden gap-2 items-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ background: "#52466B" }}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                          >
                            <AttachIcon />
                          </motion.button>
                          <span className="text-xs text-gray-400">{t("input.attach")}</span>
                        </div>

                        <div className="flex items-end gap-2 sm:gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ background: "#52466B" }}
                            onClick={() => fileInputRef.current?.click()}
                            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-violet-400 hover:text-violet-300 transition-colors flex-shrink-0 cursor-pointer"
                          >
                            <AttachIcon />
                          </motion.button>

                          <div className="flex-1 relative flex items-end min-w-0">
                            <textarea
                              ref={inputRef}
                              rows={1}
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={handleKey}
                              placeholder={t("input.placeholder")}
                              className={`w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#52466B] text-sm text-white placeholder-[#858585] resize-none outline-none transition-all leading-5 font-[Inter] ${isRTL ? "text-right" : "text-left"}`}
                              style={{ minHeight: 40, maxHeight: 120 }}
                              autoFocus
                              spellCheck="false"
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isSending}
                            style={{ background: "#9B7EDE" }}
                            className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-900/40 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer transition-opacity"
                          >
                            <SendIcon />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* File preview section */}
                    <AnimatePresence>
                      {previewMeta && showDocPreview && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "50%" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="hidden sm:flex sm:w-1/2 flex-col overflow-hidden"
                        >
                          <div className="flex font-Inter items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                            <h3 className="text-sm font-semibold text-white truncate">
                              {t("preview.title")}
                            </h3>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowDocPreview(false)}
                              className="text-violet-400 hover:text-violet-300 transition-colors ml-2"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </motion.button>
                          </div>

                          <div className="flex-1 overflow-auto p-3 sm:p-4 w-full">
                            {filePreview && typeof filePreview === "string" && previewMeta?.type === "application/pdf" ? (
                              <iframe src={filePreview} className="w-full h-full rounded-lg" title="PDF Preview" />
                            ) : filePreview && typeof filePreview === "string" && previewMeta?.type?.startsWith("image/") ? (
                              <img src={filePreview} alt="Preview" className="w-full h-auto rounded-lg object-contain max-h-[600px] sm:max-h-full" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-violet-400">
                                <div className="text-center">
                                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                  <p className="text-sm">{t("preview.loading")}</p>
                                  <p className="text-xs opacity-75 mt-2">{previewMeta?.name || "File"}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
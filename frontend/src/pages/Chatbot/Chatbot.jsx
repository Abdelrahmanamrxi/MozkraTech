/* eslint-disable no-unused-vars */
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft } from "lucide-react";
import { SendIcon, AttachIcon, RobotIcon } from "../../comp/ui/Icons";
import Body from "../../comp/layout/Body";
import Message from "./sections/Message";
import Features from "./sections/Features";
import TypingIndicator from "./sections/TypingIndicator";
import Suggestions from "./sections/Suggestions";
import ChatSidebar from "./sections/ChatSidebar";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../middleware/api";
import { useTranslation } from "react-i18next";

function getTime(locale) {
  return new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

async function getChat(activeChat, cursor) {
  const params = {};
  if (cursor) params.cursor = cursor;
  const response = await api.get(`/chat/ai/${activeChat}`, { params });
  return response.data;
}

async function sendMessagesToAi({ message, conversationId, file }) {
  const formData = new FormData();
  formData.append("message", message);
  if (conversationId) formData.append("conversationId", conversationId);
  if (file) formData.append("file", file);
  
  const response = await api.post("/chat/ai", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
}

export default function Chatbot() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("chatbot");
  const timeLocale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const isRTL = i18n.language === "ar";

  const [activeChat, setActiveChat] = useState(null);
  const [sendError, setSendError] = useState("");
  const DEFAULT_GREETING = {
    id: 1,
    role: "ai",
    content: t("greeting"),
    time: getTime(timeLocale),
  };

  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

  // Infinite query for conversation messages with cursor pagination
  const {
    data: chatData,
    isLoading: chatIsLoading,
    error: chatError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["conversation", activeChat],
    queryFn: ({ pageParam = null }) => getChat(activeChat, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: !!activeChat,
  });

  // Mutation for sending messages to AI
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: sendMessagesToAi,
    onMutate: async ({ message, conversationId }) => {
      setSendError("");
      // Optimistically add user message
      const userMsgId = Date.now();
      const now = Date.now();

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: "user",
          content: message,
          time: getTime(timeLocale),
          timestamp: now,
          isOptimistic: true,
        },
      ]);
      setIsTyping(true);
      setInput("");
      setIsExpanded(true);
      setUserNearBottom(true);
    },
    onSuccess: (data) => {
      setSendError("");
      // If new conversation, update activeChat
      if (data.isNew) {
        setActiveChat(data.conversationId);
      }

      // Optimistically add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "ai",
          content: data.response,
          time: getTime(timeLocale),
          timestamp: Date.now(),
          isOptimistic: true,
        },
      ]);
      setIsTyping(false);

      // Refetch to get server-confirmed messages with proper ordering and IDs
      if (data.conversationId || activeChat) {
        const targetConvId = data.conversationId || activeChat;
        queryClient.refetchQueries({
          queryKey: ["conversation", targetConvId],
        });
      }

      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      setIsTyping(false);
      setSendError(
        getErrorMessage(
          error,
          t("errors.sendMessage")
        )
      );
    },
  });

  // Memoize normalized messages from chatData to avoid unnecessary rebuilds
  const normalizedMessages = useMemo(() => {
    if (!chatData || !activeChat) {
      return [DEFAULT_GREETING];
    }

    const allMessages = chatData.pages
      .flatMap((page) => page.messages)
      .map((msg) => ({
        id: msg._id,
        role: msg.senderType === "ai-assistant" ? "ai" : "user",
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString(timeLocale, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(msg.createdAt).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return allMessages.length > 0 ? allMessages : [DEFAULT_GREETING];
  }, [chatData, activeChat]);

  // Scroll tracking state
  const [userNearBottom, setUserNearBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Detect when user is near the bottom of messages
  const handleMessagesScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // User is near bottom if within 100px
    setUserNearBottom(distanceFromBottom < 100);

    // Load older messages when user scrolls to top
    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Auto-scroll to bottom on initial load (immediate) or when new messages arrive (smooth)
  useEffect(() => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        if (isInitialLoad && normalizedMessages.length > 1) {
          // Initial load: scroll immediately without animation
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
          setIsInitialLoad(false);
        } else if (userNearBottom && normalizedMessages.length > 1 && !isInitialLoad) {
          // New message arrived and user was near bottom: smooth scroll
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }, [normalizedMessages, userNearBottom, isInitialLoad]);

  // Reset function for new conversation
  const handleNewConversation = () => {
    setActiveChat(null);
    setIsInitialLoad(true);
    setUserNearBottom(true);
    setMessages([DEFAULT_GREETING]);
    setSendError("");
    setUploadedFile(null);
    setFilePreview(null);
    setPreviewMeta(null);
    setShowDocPreview(true);
    setIsExpanded(false);
    setInput("");
  };

  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [showDocPreview, setShowDocPreview] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const loadErrorMessage = chatError
    ? getErrorMessage(chatError, t("errors.loadMessages"))
    : "";
  const errorMessages = [loadErrorMessage, sendError].filter(Boolean);

  // Sync local state with normalized messages, but preserve optimistic messages
  useEffect(() => {
    if (!activeChat) {
      setMessages(normalizedMessages);
      return;
    }

    const hasServerMatch = (optimistic) =>
      normalizedMessages.some((serverMsg) => {
        if (serverMsg.role !== optimistic.role) return false;
        if (serverMsg.content !== optimistic.content) return false;
        if (!serverMsg.timestamp || !optimistic.timestamp) return false;
        return Math.abs(serverMsg.timestamp - optimistic.timestamp) < 15000;
      });

    setMessages((prev) => {
      const unconfirmedMessages = prev.filter(
        (m) => m.isOptimistic && !hasServerMatch(m)
      );

      const combined = [...normalizedMessages, ...unconfirmedMessages];

      const seen = new Set();
      const deduped = combined.filter((m) => {
        const key = m.id?.toString?.() ?? `temp-${m.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return deduped.sort((a, b) => {
        if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
        return 0;
      });
    });
  }, [normalizedMessages, activeChat]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setPreviewMeta({ name: file.name, type: file.type });
    setShowDocPreview(true);
    setIsExpanded(true);
    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(true);
    }
  }, []);

  const sendMessage = useCallback(
    (text) => {
      const content = (text || input).trim();
      if (!content) return;

      // Call mutation with current message data
      sendMessageMutation(
        {
          message: content,
          conversationId: activeChat,
          file: uploadedFile,
        },
        {
          onSuccess: () => {
            // Clear file input after successful send but keep preview visible
            if (uploadedFile) {
              setUploadedFile(null);
            }
            setShowDocPreview(true);
          },
        }
      );
    },
    [input, activeChat, uploadedFile, sendMessageMutation]
  );

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="flex w-full flex-row h-screen  overflow-hidden main-background">
      <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} isOpen={sidebarOpen && !isSending && !isTyping} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 relative p-3 min-w-0 ">
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
              {/* Sidebar toggle button */}
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
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <PanelLeft size={16} />
              </motion.button>

              <div
                style={{
                  background: "linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)",
                }}
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
                      <p key={`${index}-${msg}`} className="text-red-200/80">
                        {msg}
                      </p>
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

                {/* Main input row */}
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

            {/* Feature cards */}
           
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
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 bg-[#3D3555]">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        style={{
                          background: "linear-gradient(180deg, #9B7EDE 0%, #7C5FBD 100%)",
                        }}
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Content */}
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
                              <p key={`${index}-${msg}`} className="text-red-200/80">
                                {msg}
                              </p>
                            ))}
                          </div>
                        )}
                        {messages.map((msg) => (
                          <Message key={msg.id} msg={msg} />
                        ))}
                        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
                        <div ref={messagesEndRef} className="w-full" />
                      </div>

                      {/* Input */}
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
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </motion.button>
                          </div>

                          <div className="flex-1 overflow-auto p-3 sm:p-4 w-full">
                            {filePreview &&
                            typeof filePreview === "string" &&
                            previewMeta?.type === "application/pdf" ? (
                              <iframe
                                src={filePreview}
                                className="w-full h-full rounded-lg"
                                title="PDF Preview"
                              />
                            ) : filePreview &&
                              typeof filePreview === "string" &&
                              previewMeta?.type?.startsWith("image/") ? (
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="w-full h-auto rounded-lg object-contain max-h-[600px] sm:max-h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-violet-400">
                                <div className="text-center">
                                  <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="mx-auto mb-3 opacity-50"
                                  >
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
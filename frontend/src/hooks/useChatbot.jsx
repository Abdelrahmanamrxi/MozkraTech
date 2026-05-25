import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";

function getTime(locale) {
  return new Date().toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
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
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

function useChatbot({ t, timeLocale }) {
  const queryClient = useQueryClient();

  // ─── Active conversation ───────────────────────────────────────────────────
  const [activeChat, setActiveChat] = useState(null);

  // ─── All UI state lives here ───────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userNearBottom, setUserNearBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sendError, setSendError] = useState("");

  // ─── File state ────────────────────────────────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [showDocPreview, setShowDocPreview] = useState(true);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

  const DEFAULT_GREETING = useMemo(
    () => ({
      id: "greeting",
      role: "ai",
      content: t("greeting"),
      time: getTime(timeLocale),
    }),
    [t, timeLocale]
  );

  // ─── Infinite query ────────────────────────────────────────────────────────
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

  // ─── Normalized server messages ────────────────────────────────────────────
  const normalizedMessages = useMemo(() => {
    if (!chatData || !activeChat) return [DEFAULT_GREETING];

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
  }, [chatData, activeChat, DEFAULT_GREETING, timeLocale]);

  // ─── Sync server → local, preserving unconfirmed optimistic messages ───────
// useChatbot.js
const activeChatRef = useRef(activeChat);

useEffect(() => {
  const didSwitch = activeChatRef.current !== activeChat;
  activeChatRef.current = activeChat;

  if (!activeChat) {
    setMessages([DEFAULT_GREETING]);
    setIsExpanded(false);
    setIsTyping(false);
    setSendError("");
    setIsInitialLoad(true);
    return;
  }

  if (didSwitch) {
    setIsInitialLoad(true);
    setIsExpanded(false);
    setIsTyping(false);
    setSendError("");

    // ✅ If query is cached, data is already here — don't show greeting, fall through
    if (chatIsLoading || normalizedMessages.length <= 1) {
      setMessages([DEFAULT_GREETING]);
      return;
    }
  }

  if (chatIsLoading) return;
  // Data is ready — merge server + unconfirmed optimistic messages
  const hasServerMatch = (optimistic) =>
    normalizedMessages.some((s) => {
      if (s.role !== optimistic.role) return false;
      if (s.content !== optimistic.content) return false;
      if (!s.timestamp || !optimistic.timestamp) return false;
      return Math.abs(s.timestamp - optimistic.timestamp) < 15_000;
    });

  setMessages((prev) => {
    const unconfirmed = prev.filter((m) => m.isOptimistic && !hasServerMatch(m));
    const combined = [...normalizedMessages, ...unconfirmed];
    const seen = new Set();
    const deduped = combined.filter((m) => {
      const key = String(m.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return deduped.sort((a, b) =>
      a.timestamp && b.timestamp ? a.timestamp - b.timestamp : 0
    );
  });
}, [normalizedMessages, activeChat, chatIsLoading]);
    // A server message "matches" an optimistic one if same role + content
    // arrived within 15 s of when we sent it.
  

  // ─── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: sendMessagesToAi,

    onMutate: async ({ message }) => {
      setSendError("");
      const now = Date.now();

      // Optimistic user bubble
      setMessages((prev) => [
        ...prev,
        {
          id: now,                // unique, never undefined
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

      // FIX: capture the target conversation ID before any state update
      const targetConvId = data.conversationId || activeChat;

      // If this was a brand-new conversation, update the active chat
      if (data.isNew) {
        setActiveChat(data.conversationId);
      }

      // Optimistic AI bubble
      const now = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: now + 1,
          role: "ai",
          content: data.response,
          time: getTime(timeLocale),
          timestamp: now,
          isOptimistic: true,
        },
      ]);

      setIsTyping(false);

      // FIX: clear the file here (single source of truth, no stale closure)
      setUploadedFile(null);
      setShowDocPreview(true);

      // FIX: seed the cache for new conversations so the key exists, then refetch
      if (targetConvId) {
        if (data.isNew) {
          queryClient.setQueryData(["conversation", targetConvId], {
            pages: [],
            pageParams: [],
          });
        }
        queryClient.invalidateQueries({
          queryKey: ["conversation", targetConvId],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (error) => {
      setIsTyping(false);
      setSendError(getErrorMessage(error, t("errors.sendMessage")));
      // Roll back the optimistic user message so the user can retry
      setMessages((prev) => prev.filter((m) => !m.isOptimistic));
    },
  });

  // ─── Send helper ───────────────────────────────────────────────────────────
  // NOTE: uploadedFile is read at call time from the ref below, not from
  // a stale closure, so FormData always has the right file.
  const uploadedFileRef = useRef(uploadedFile);
  useEffect(() => {
    uploadedFileRef.current = uploadedFile;
  }, [uploadedFile]);

  const sendMessage = useCallback(
    (text) => {
      const content = (text || input).trim();
      if (!content) return;

      sendMessageMutation({
        message: content,
        conversationId: activeChat,
        file: uploadedFileRef.current, // always fresh
      });
    },
    [input, activeChat, sendMessageMutation]
  );

  // ─── File upload ───────────────────────────────────────────────────────────
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

  // ─── Keyboard handler ──────────────────────────────────────────────────────
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // ─── New conversation reset ────────────────────────────────────────────────
  const handleNewConversation = useCallback(() => {
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
  }, [DEFAULT_GREETING]);

  // ─── Scroll tracking ───────────────────────────────────────────────────────
  const handleMessagesScroll = useCallback(() => {
  const container = e.currentTarget; // 👈 always the element that fired the event
  const { scrollTop, scrollHeight, clientHeight } = container;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  setUserNearBottom(distanceFromBottom < 100);
  if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─── Auto-scroll ───────────────────────────────────────────────────────────

const regularEndRef = useRef(null);
const expandedEndRef = useRef(null);
useEffect(() => {
  if (chatIsLoading) return;
  requestAnimationFrame(() => {
    const target = isExpanded
      ? expandedEndRef.current
      : regularEndRef.current;
    if (!target) return;
    if (isInitialLoad) {
      target.scrollIntoView({ behavior: "auto" });
      setIsInitialLoad(false);
    } else if (userNearBottom) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}, [messages, userNearBottom, isInitialLoad, isTyping, chatIsLoading, isExpanded])
  // ─── Derived ───────────────────────────────────────────────────────────────
  const loadErrorMessage = chatError
    ? getErrorMessage(chatError, t("errors.loadMessages"))
    : "";
  const errorMessages = [loadErrorMessage, sendError].filter(Boolean);

  return {
    // Conversation
    activeChat,
    setActiveChat,
    handleNewConversation,
    // Messages
    messages,
    normalizedMessages,
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
    sendError,
    setSendError,
    errorMessages,
    // Query
    chatData,
    chatIsLoading,
    chatError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // Scroll
    messagesContainerRef,
    regularEndRef,
    expandedEndRef,
    messagesEndRef,
    handleMessagesScroll,
    isInitialLoad,
    setIsInitialLoad,
    userNearBottom,
    setUserNearBottom,
  };
}

export default useChatbot;
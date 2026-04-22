import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import api from "../middleware/api";

/**
 * Helper utilities for the real-time friend chat hook.
 *
 * This file manages a socket connection for one active conversation and
 * keeps a normalized, deduplicated message list in local component state.
 * It also exposes helper methods for sending messages, marking messages as
 * read, and loading older history on demand.
 */

/**
 * Normalize socket or API presence status into a consistent shape.
 * This supports both raw string status values and richer status objects.
 */
function normalizeStatus(status) {
  if (!status) return null;
  if (typeof status === 'string') {
    return {
      status,
      lastActivityDate: null,
    };
  }

  return {
    status: status.status ?? null,
    lastActivityDate: status.lastActivityDate ?? null,
  };
}

/**
 * Build a stable unique key for a message, using _id when available.
 * This guard helps eliminate duplicates when older message history is merged.
 */
function getMessageKey(message) {
  const fallbackTime = message.sentAt || message.createdAt;
  return message._id?.toString() ?? `${message.conversationId}-${message.senderId}-${fallbackTime}`;
}

/**
 * Fetch chat history for the selected conversation.
 * When a cursor is provided, it loads the next page of older messages.
 */
async function getChat(selected, cursor) {
  try {
    const response = await api.get("/chat", {
      params: {
        conversationId: selected.conversationId,
        ...(cursor ? { cursor } : {}),
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Failed to Retrieve Chat");
  }
}


/**
 * Normalize raw chat messages from the API into a fixed structure used by the UI.
 * The hook expects the oldest message first from the API, so reverse()
 * ensures the UI renders oldest -> newest.
 */
function normalizeChat(messages, selected) {

  return messages
    .map((message) => {
      const senderId = message.senderId?._id?.toString() ?? message.senderId?.toString();
      const isFromThem = selected._id?.toString() === senderId;

      return {
        ...message,
        conversationId: selected.conversationId,
        friendId: selected._id,
        senderId,
        sentAt: message.createdAt,
        from: isFromThem ? "them" : "me",
        
      };
    })
    .reverse();
}

/**
 * Hook that manages friend chat messaging state and socket communication.
 *
 * The hook is intended to be called from a chat page component when the
 * user selects a friend conversation. It simultaneously:
 * - loads the active conversation history from the API,
 * - connects to the real-time socket endpoint,
 * - normalizes incoming and outgoing messages,
 * - tracks friend presence and conversation status,
 * - supports infinite scroll for older chat history,
 * - and exposes methods to send messages and mark the conversation read.
 *
 * @param {object|null} selected - The currently selected friend object.
 *   Expected shape includes `_id` and `conversationId`.
 * @returns {object} hook state and action methods for the chat UI.
 */
function useFriendsMessages(selected) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [status, setStatus] = useState("idle");
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [olderLoadError, setOlderLoadError] = useState(null);
  const [oldestCursor, setOldestCursor] = useState(null);

  const accessToken = useSelector((state) => state.auth.accessToken);

  // Reset user presence status when the selected friend changes.
  // This prevents old status values from being reused when switching between
  // different friend contacts without immediately receiving fresh socket events.
  useEffect(() => {
    setUserStatus(null);
  }, [selected?._id]);

  // Reset conversation-specific caches when the selected conversation changes.
  // We clear messages and pagination state so the next chat load starts fresh.
  useEffect(() => {
    setMessages([]);
    setHasMoreHistory(false);
    setIsLoadingOlder(false);
    setOlderLoadError(null);
    setOldestCursor(null);
  }, [selected?.conversationId]);

  // Load the initial chat history for the selected conversation.
  // The `select` callback normalizes API messages and derives whether more
  // history exists based on the server page size.
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", selected?.conversationId],
    queryFn: () => getChat(selected),
    enabled: !!selected?.conversationId,
    retry: 1,
    select: (response) => {
      const rawMessages = response.chat?.messages ?? [];
      return {
        normalizedMessages: normalizeChat(rawMessages, selected),
        hasMore: rawMessages.length === 20,
      };
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setMessages(data.normalizedMessages);
    setHasMoreHistory(data.hasMore);
    setOlderLoadError(null);

    const oldestMessage = data.normalizedMessages[0];
    setOldestCursor(oldestMessage?.sentAt || oldestMessage?.createdAt || null);
  }, [data]);

  /**
   * Load older messages for the active conversation when the user scrolls upward.
   * This uses the oldest loaded message timestamp as a cursor to request the next page.
   * The hook merges older messages into existing state while avoiding duplicates.
   */
  const loadOlderMessages = useCallback(async () => {
    if (!selected?.conversationId || !hasMoreHistory || isLoadingOlder || !oldestCursor) {
      return;
    }

    setIsLoadingOlder(true);
    setOlderLoadError(null);

    try {
      const response = await getChat(selected, oldestCursor);
      const rawMessages = response.chat?.messages ?? [];
      const normalizedOlderMessages = normalizeChat(rawMessages, selected);

      setMessages((prev) => {
        if (!normalizedOlderMessages.length) {
          return prev;
        }

        const seen = new Set();
        const merged = [...normalizedOlderMessages, ...prev].filter((message) => {
          const messageKey = getMessageKey(message);
          if (seen.has(messageKey)) {
            return false;
          }
          seen.add(messageKey);
          return true;
        });

        return merged;
      });

      const oldestLoaded = normalizedOlderMessages[0];
      if (oldestLoaded) {
        setOldestCursor(oldestLoaded.sentAt || oldestLoaded.createdAt || oldestCursor);
      }

      setHasMoreHistory(rawMessages.length === 20);
    } catch (err) {
      setOlderLoadError(err);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [hasMoreHistory, isLoadingOlder, oldestCursor, selected]);

  // Establish the socket connection whenever access token or conversation changes.
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        authorization: `Bearer ${accessToken}`
      }
    });

    socketRef.current = socket;

    // Connection lifecycle status updates.
    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("connect_error", () => {
      setStatus("connect_error");
    });

    // Incoming message from the friend on the current socket.
    socket.on("receiveMessage", (payload) => {
      // Incoming message from the remote friend. We normalize it and attach
      // metadata such as friendId, conversationId, and the direction of the message.
      const senderId = payload.senderId?._id?.toString() ?? payload.senderId?.toString();
      const receiverId = payload.receiverId?.toString();
      const friendId = senderId;

      setMessages((prev) => {
        // Check if message already exists by _id or fallback key
        const messageTime = payload.sentAt || payload.createdAt;
        const msgKey = payload._id?.toString() ?? `${payload.conversationId}-${senderId}-${messageTime}`;
        const exists = prev.some((msg) => {
          const key = getMessageKey(msg);
          return key === msgKey;
        });

        if (exists) return prev;

        return [
          ...prev,
          {
            ...payload,
            conversationId: payload.conversationId,
            from: "them",
            friendId,
            senderId,
            receiverId,
            sentAt: messageTime,
          },
        ];
      });
    });

    // Confirmation of a sent message from the server.
    // This event adds the outbound message into local state and may also update
    // the current friend's online/status metadata for the active conversation.
    socket.on("successMessage", (payload) => {
      const senderId = payload.senderId?._id?.toString() ?? payload.senderId?.toString();
      const receiverId = payload.receiverId?.toString();
      const friendId = receiverId;
      const isCurrentConversation =
        payload.conversationId?.toString() === selected?.conversationId?.toString();

      const normalizedStatus = normalizeStatus(payload.status)
      if (normalizedStatus && isCurrentConversation) {
        setUserStatus(normalizedStatus)
      }

      setMessages((prev) => {
        // Check if message already exists by _id or fallback key
        const messageTime = payload.sentAt || payload.createdAt;
        const msgKey = payload._id?.toString() ?? `${payload.conversationId}-${senderId}-${messageTime}`;
        const exists = prev.some((msg) => {
          const key = getMessageKey(msg);
          return key === msgKey;
        });

        if (exists) return prev;

        return [
          ...prev,
          {
            ...payload,
            conversationId: payload.conversationId,
            from: "me",
            friendId,
            senderId,
            receiverId,
            sentAt: messageTime,
            userStatus: payload.status
          },
        ];
      });
    });


    socket.on("authError", (payload) => {
      console.warn("Socket auth error:", payload);
      setStatus("authError");
    });

    socket.on("sendError", (payload) => {
      console.warn("Socket send error:", payload);
      setStatus("sendError");
    });

    // Backend acknowledgment for the current user's mark-as-read action.
    // Keep local incoming messages in sync in case history arrived before ack.
    socket.on("markAsReadConfirmed", ({ conversationId, status }) => {
      const isCurrentConversation =
        conversationId?.toString() === selected?.conversationId?.toString();

      const normalizedStatus = normalizeStatus(status);
      if (normalizedStatus && isCurrentConversation) {
        setUserStatus(normalizedStatus);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId?.toString() === conversationId?.toString() && msg.from === "them"
            ? { ...msg, isRead: true }
            : msg,
        ),
      );
    });

    // Backend acknowledgment that a conversation was marked as read.
    // We also update local outgoing message state for the current conversation.
    socket.on("messagesMarkedAsRead", ({ conversationId, status }) => {
      const isCurrentConversation =
        conversationId?.toString() === selected?.conversationId?.toString();

      const normalizedStatus = normalizeStatus(status)
      if (normalizedStatus && isCurrentConversation) {
        setUserStatus(normalizedStatus)
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId?.toString() === conversationId?.toString() && msg.from === "me"
            ? { ...msg, isRead: true }
            : msg,
        ),
      );
    });


    return () => {
      // Disconnect the socket when the selected conversation changes or when
      // the hook is unmounted, preventing stale listeners and invalid state updates.
      socket.disconnect();
    };
  }, [accessToken, selected?._id, selected?.conversationId]);

  /**
   * Send a message through the socket to the selected friend.
   * If the socket is not available, the status is updated to sendError.
   */
  const sendMessage = useCallback(({ destId, message }) => {
    const socket = socketRef.current;
    if (!socket) {
      setStatus('sendError')
      return;
    }
    socket.emit("sendMessage", { destId, message });
  }, []);

  /**
   * Mark the current conversation as read locally and notify the backend.
   * This helps keep unread counts in sync across devices.
   */
  const markAsRead = useCallback(({ conversationId }) => {
    const socket = socketRef.current;
    if (!socket) {
      setStatus('sendError')
      return;
    }
    if (!conversationId) {
      return;
    }

    // Local read action: mark incoming messages in this chat as read immediately.
    setMessages((prev) =>
      prev.map((msg) =>
        msg.conversationId?.toString() === conversationId?.toString() && msg.from === "them"
          ? { ...msg, isRead: true }
          : msg,
      ),
    );

    socket.emit("markAsRead", { conversationId });
  }, []);




  /**
   * Returned hook API:
   * - `status`: internal socket connection lifecycle state.
   * - `socketConnectionStatus`: alias for the same socket status.
   * - `userStatus`: friend presence/status details from socket events.
   * - `messages`: normalized chat messages for the selected conversation.
   * - `sendMessage`: function to emit a new chat message to the backend.
   * - `markAsRead`: function to mark the active conversation as read.
   * - `loadOlderMessages`: function to load earlier messages when scrolling up.
   * - `hasMoreHistory`: whether more history is available from the server.
   * - `isLoadingOlder`: whether older history is currently being fetched.
   * - `isLoading`: whether the initial conversation load is in progress.
   * - `error`: any error from the initial conversation load.
   * - `olderLoadError`: any error from loading older message pages.
   */
  return {
    status,
    socketConnectionStatus: status,
    userStatus,
    messages,
    sendMessage,
    markAsRead,
    loadOlderMessages,
    hasMoreHistory,
    isLoadingOlder,
    isLoading,
    error,
    olderLoadError,
  };

}

export default useFriendsMessages

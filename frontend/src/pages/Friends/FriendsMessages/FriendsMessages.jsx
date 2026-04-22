import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";
import { formatRelativeTime } from "@/utils/formatTime";
import api from "../../../middleware/api";
import useFriendsMessages from "../../../hooks/useFriendsMessages";
import FriendsSidebar from "./components/FriendsSidebar";
import ChatPanel from "./components/ChatPanel";

/**
 * Fetch the list of friends from the backend.
 * @param {string} search - The search text to filter friends on the server.
 * @returns {Promise<object>} API response data containing the friends list.
 */
async function getFriends(search) {
  const response = await api.get(`/friends?search=${search}`);
  return response.data;
}

/**
 * `FriendsMessages` is the main chat panel used when browsing friend conversations.
 * It renders a searchable friends sidebar and a chat panel. It coordinates:
 * - fetching friend list metadata,
 * - selecting the active conversation,
 * - scrolling behavior,
 * - unread counts,
 * - sending messages,
 * - loading more history,
 * - and marking messages as read.
 */
export default function FriendsMessages() {
  const { t } = useTranslation("friends");
  const queryClient = useQueryClient();

  /**
   * Determine the display text for a friend's activity status.
   * If the friend has no last activity timestamp, show offline.
   * If the friend was active within the last minute, show online.
   * Otherwise, show a translated relative time.
   */
  const friendActivityLabelWithTranslation = (time, isOnline = false) => {
    if (isOnline) return t("messages.status.online");
    if (!time) return t("messages.status.offline");

    return formatRelativeTime(time, t);
  };

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [locallyReadConversationIds, setLocallyReadConversationIds] = useState(() => new Set());

  // DOM refs and scroll tracking
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const initialScrollDoneRef = useRef(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(search, 500);

  /**
   * Load the friends list once and whenever the debounced search changes.
   * This avoids excessive network calls while the user is typing.
   */
  const { data, isLoading, error } = useQuery({
    queryKey: ["friends", debouncedQuery],
    queryFn: () => getFriends(debouncedQuery),
    retry: false,
  });
  

  /**
   * Manage real-time chat state for the currently selected friend.
   * The hook returns connection status, message list, send/mark-as-read helpers,
   * and controls for pagination and error handling.
   */
  const {
    socketConnectionStatus,
    userStatus,
    messages,
    sendMessage,
    markAsRead,
    loadOlderMessages,
    hasMoreHistory,
    isLoadingOlder,
    isLoading: chatIsLoading,
    error: chatError,
    olderLoadError,
  } = useFriendsMessages(selected);
  // Normalize friend list data and avoid recomputing on every render.
  const friendItems = useMemo(() => data?.friends ?? [], [data?.friends]);

  const rememberConversationAsRead = (conversationId) => {
    const normalizedConversationId = conversationId?.toString?.() ?? conversationId;
    if (!normalizedConversationId) return;

    setLocallyReadConversationIds((prev) => {
      if (prev.has(normalizedConversationId)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(normalizedConversationId);
      return next;
    });
  };

  useEffect(() => {
    setLocallyReadConversationIds((prev) => {
      if (!prev.size) {
        return prev;
      }

      let changed = false;
      const next = new Set(prev);

      friendItems.forEach((item) => {
        const normalizedConversationId = item.conversationId?.toString?.() ?? item.conversationId;
        if (!normalizedConversationId) return;

        if ((item.unReadCount ?? 0) > 0 && next.has(normalizedConversationId)) {
          next.delete(normalizedConversationId);
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [friendItems]);

  const latestMessageByFriend = useMemo(() => {
    return messages.reduce((acc, msg) => {
      const friendId = msg.friendId?.toString();
      if (!friendId) return acc;

      const timestamp = new Date(msg.sentAt || msg.createdAt || 0).getTime();
      if (!acc[friendId] || timestamp > acc[friendId].time) {
        acc[friendId] = { time: timestamp, message: msg };
      }

      return acc;
    }, {});
  }, [messages]);

  const friendItemsWithLatest = useMemo(
    () =>
      friendItems.map((item) => {
        const friendId = item.friend?._id?.toString();
        if (!friendId) return item;

        const localLatest = latestMessageByFriend[friendId];
        const serverMessageTime = item.lastMessage
          ? new Date(item.lastMessage.sentAt || item.lastMessage.createdAt || 0).getTime()
          : 0;
        const friendActivityTime = item.friend?.lastActivityDate
          ? new Date(item.friend.lastActivityDate).getTime()
          : 0;
        const localTime = localLatest?.time ?? 0;
        const mostRecentTime = Math.max(localTime, serverMessageTime, friendActivityTime);

        const updatedFriend = {
          ...item.friend,
          lastActivityDate:
            localLatest && localTime > friendActivityTime
              ? localLatest.message.sentAt || localLatest.message.createdAt
              : item.friend.lastActivityDate,
        };

        const updatedLastMessage = localLatest
          ? {
              ...item.lastMessage,
              ...localLatest.message,
              content: localLatest.message.content || localLatest.message.message || item.lastMessage?.content,
              sentAt: localLatest.message.sentAt || localLatest.message.createdAt,
              createdAt: localLatest.message.createdAt,
            }
          : item.lastMessage;

        return {
          ...item,
          friend: updatedFriend,
          lastMessage: updatedLastMessage,
          sortTime: mostRecentTime,
        };
      }),
    [friendItems, latestMessageByFriend],
  );

  // Apply local friend name filtering for the sidebar and sort by newest chat activity.
  const filteredFriends = useMemo(
    () =>
      friendItemsWithLatest
        .filter((item) =>
          item.friend?.fullName?.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0)),
    [friendItemsWithLatest, search],
  );

  /**
   * Keep the selected friend item updated when a new incoming message arrives.
   * This is used to show the most recent conversation activity in the sidebar.
   */
  const displaySelected = useMemo(() => {
    if (!selected || !messages.length) return selected;

    const latest = messages[messages.length - 1];
    const friendId = latest.friendId?.toString();

    if (latest.from === "them" && friendId === selected._id?.toString()) {
      const timestamp = latest.sentAt || latest.createdAt || new Date().toISOString();
      return { ...selected, updatedAt: timestamp };
    }

    return selected;
  }, [messages, selected]);

  /**
   * Build a unified unread count map combining server-provided counts
   * with any live unread messages already received over the socket.
   * Latest live counts overwrite stale server values when applicable.
   */
  const unreadByFriend = useMemo(() => {
    const selectedConversationId =
      selected?.conversationId?.toString?.() ?? selected?.conversationId;

    const serverUnread = friendItems.reduce((acc, item) => {
      const friendId = item.friend?._id?.toString?.() ?? item.friend?._id;
      if (!friendId) return acc;

      const conversationId = item.conversationId?.toString?.() ?? item.conversationId;
      const isActiveConversation =
        !!selectedConversationId && !!conversationId && selectedConversationId === conversationId;
      const isLocallyRead = !!conversationId && locallyReadConversationIds.has(conversationId);

      // Keep UI consistent: once a conversation is open, treat its unread as cleared.
      acc[friendId] = isActiveConversation || isLocallyRead ? 0 : (item.unReadCount ?? 0);
      return acc;
    }, {});

    const liveUnread = messages.reduce((acc, msg) => {
      const id = msg.friendId?.toString?.() ?? msg.friendId;
      if (!id) return acc;

      if (acc[id] == null) {
        acc[id] = 0;
      }

      if (msg.from === "them" && !msg.isRead) {
        acc[id] = (acc[id] || 0) + 1;
      }

      return acc;
    }, {});

    return { ...serverUnread, ...liveUnread };
  }, [friendItems, messages, selected?.conversationId, locallyReadConversationIds]);

  /**
   * Filter and order the chat history for the currently selected friend.
   * Sorting ensures messages render oldest first in the chat panel.
   */
  const selectedMessages = useMemo(() => {
    const selectedFriendId = selected?._id?.toString();

    return messages
      .filter((msg) => msg.friendId === selectedFriendId)
      .sort((a, b) => {
        const firstTime = new Date(a.sentAt || a.createdAt || 0).getTime();
        const secondTime = new Date(b.sentAt || b.createdAt || 0).getTime();
        return firstTime - secondTime;
      });
  }, [messages, selected?._id]);

  const canSend = socketConnectionStatus === "connected" && !!input.trim() && !!selected?._id;

  /**
   * Scroll the chat viewport to the most recent message.
   * Only scrolls the messages container, not any parent divs.
   */
  const scrollToBottom = (behavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    if (behavior === "smooth") {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleSend = () => {
    if (!canSend) return;

    sendMessage({ message: input.trim(), destId: selected._id });
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Select a friend conversation and reset scroll/read state.
   * If a conversation is selected on mobile, close the sidebar.
   */
  const selectFriend = (friend, conversationId) => {
    setSelected({ ...friend, conversationId });
    shouldStickToBottomRef.current = true;
    initialScrollDoneRef.current = false;

    if (conversationId) {
      rememberConversationAsRead(conversationId);
      markAsRead({ conversationId });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }

    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleMessagesScroll = async (event) => {
    const container = event.currentTarget;
    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);

    // Keep track of whether the user is near the bottom of the chat.
    shouldStickToBottomRef.current = distanceFromBottom < 120;

    if (!selected?.conversationId || container.scrollTop > 80 || !hasMoreHistory || isLoadingOlder) {
      return;
    }

    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    await loadOlderMessages();

    requestAnimationFrame(() => {
      const updatedContainer = messagesContainerRef.current;
      if (!updatedContainer) {
        return;
      }

      // Preserve the user's position after loading earlier messages.
      const newHeightDelta = updatedContainer.scrollHeight - previousScrollHeight;
      updatedContainer.scrollTop = previousScrollTop + newHeightDelta;
    });
  };

  // When the active chat has any unread incoming message, mark that conversation as read.
  useEffect(() => {
    if (!selected?.conversationId || !messages.length) {
      return;
    }

    const selectedConversationId = selected.conversationId?.toString?.() ?? selected.conversationId;
    const hasUnreadInActiveConversation = messages.some((message) => {
      const messageConversationId =
        message.conversationId?.toString?.() ?? message.conversationId;

      return (
        messageConversationId === selectedConversationId &&
        message.from === "them" &&
        !message.isRead
      );
    });

    if (hasUnreadInActiveConversation) {
      rememberConversationAsRead(selected.conversationId);
      markAsRead({ conversationId: selected.conversationId });
    }
  }, [messages, selected?.conversationId, markAsRead]);

  // Scroll to the bottom automatically the first time a conversation loads.
  useEffect(() => {
    if (!selected?.conversationId) {
      initialScrollDoneRef.current = false;
      return;
    }

    if (chatIsLoading || !selectedMessages.length || initialScrollDoneRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToBottom("auto");
      initialScrollDoneRef.current = true;
    });
  }, [selected?.conversationId, chatIsLoading, selectedMessages.length]);

  useEffect(() => {
    if (!selected?.conversationId || !selectedMessages.length || isLoadingOlder) {
      return;
    }

    if (shouldStickToBottomRef.current) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }
  }, [selectedMessages.length, selected?.conversationId, isLoadingOlder]);

  return (
    <div className="mt-2 font-Inter">
      <div className="flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-[75vh] min-h-125 flex gap-3 relative">
          <FriendsSidebar
            sidebarOpen={sidebarOpen}
            t={t}
            search={search}
            onSearchChange={setSearch}
            filteredFriends={filteredFriends}
            isLoading={isLoading}
            error={error}
            friendActivityLabel={friendActivityLabelWithTranslation}
            selectedFriendId={selected?._id}
            unreadByFriend={unreadByFriend}
            onSelectFriend={selectFriend}
            userStatus={userStatus}
          />

          <ChatPanel
            selected={selected}
            displaySelected={displaySelected}
            friendActivityLabel={friendActivityLabelWithTranslation}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isLoading={chatIsLoading}
            error={selectedMessages.length ? null : chatError}
            historyError={olderLoadError}
            userStatus={userStatus}
            socketConnectionStatus={socketConnectionStatus}
            selectedMessages={selectedMessages}
            hasMoreHistory={hasMoreHistory}
            isLoadingOlder={isLoadingOlder}
            messagesContainerRef={messagesContainerRef}
            onMessagesScroll={handleMessagesScroll}
            onLoadOlder={loadOlderMessages}
            messagesEndRef={messagesEndRef}
            inputRef={inputRef}
            input={input}
            onInputChange={setInput}
            onKeyDown={handleKey}
            onSend={handleSend}
            canSend={canSend}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

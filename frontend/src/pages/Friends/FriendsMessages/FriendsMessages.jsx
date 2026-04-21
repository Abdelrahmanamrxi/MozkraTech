import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";
import { formatRelativeTime } from "@/utils/formatTime";
import api from "../../../middleware/api";
import useFriendsMessages from "../../../hooks/useFriendsMessages";
import FriendsSidebar from "./components/FriendsSidebar";
import ChatPanel from "./components/ChatPanel";

const friendActivityLabel = (updatedAt) => {
  if (!updatedAt) return "unknown";

  const diffMs = Date.now() - new Date(updatedAt).getTime();
  if (diffMs < 60_000) return "Active";

  return formatRelativeTime(updatedAt);
};

async function getFriends(search) {
  const response = await api.get(`/friends?search=${search}`);
  return response.data;
}

export default function FriendsMessages() {
  const { t } = useTranslation("friends");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["friends", debouncedQuery],
    queryFn: () => getFriends(debouncedQuery),
    retry: false,
  });

  const { socketConnectionStatus, userStatus, messages, sendMessage, markAsRead, isLoading: chatIsLoading, error: chatError } = useFriendsMessages(selected);
  const friendItems = useMemo(() => data?.friends ?? [], [data?.friends]);

  const filteredFriends = useMemo(
    () =>
      friendItems.filter((item) =>
        item.friend?.fullName?.toLowerCase().includes(search.toLowerCase()),
      ),
    [friendItems, search],
  );

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
  const unreadByFriend = useMemo(
    () =>
      messages.reduce((acc, msg) => {
        const id = msg.friendId?.toString();
        if (!id) return acc;

        if (msg.from === "them" && !msg.isRead) {
          acc[id] = (acc[id] || 0) + 1;
        }

        return acc;
      }, {}),
    [messages],
  );

  const selectedMessages = useMemo(
    () => messages.filter((msg) => msg.friendId === selected?._id?.toString()),
    [messages, selected?._id],
  );
  console.log(displaySelected)
  const activeStatus = displaySelected ? friendActivityLabel(displaySelected.updatedAt) : "";
  const canSend = socketConnectionStatus === "connected" && !!input.trim() && !!selected?._id;

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

  const selectFriend = (friend, conversationId) => {
    setSelected({ ...friend, conversationId });

    if (conversationId) {
      markAsRead({ conversationId });
    }

    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  useEffect(() => {
    if (!selected?.conversationId || !messages.length) {
      return;
    }

    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) {
      return;
    }

    const isActiveConversation =
      latestMessage.conversationId?.toString() === selected.conversationId?.toString();

    if (latestMessage.from === "them" && isActiveConversation && !latestMessage.isRead) {
      markAsRead({ conversationId: selected.conversationId });
    }
  }, [messages, selected?.conversationId, markAsRead]);

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
            selectedFriendId={selected?._id}
            unreadByFriend={unreadByFriend}
            onSelectFriend={selectFriend}
            friendActivityLabel={friendActivityLabel}
          />

          <ChatPanel
            selected={selected}
            displaySelected={displaySelected}
            activeStatus={activeStatus}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isLoading={chatIsLoading}
            error={chatError}
            userStatus={userStatus}
            socketConnectionStatus={socketConnectionStatus}
            selectedMessages={selectedMessages}
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

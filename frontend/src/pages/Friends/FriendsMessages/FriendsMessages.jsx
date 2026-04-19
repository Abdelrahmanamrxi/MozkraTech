/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendIcon,
  SearchIcon,
  EmojiIcon,
  ChevronLeft,
  ChevronRight,
} from "../../../comp/ui/Icons";
import { Loader2 } from "lucide-react";
import useDebounce from "@/hooks/useDebounce"
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { formatRelativeTime } from "@/utils/formatTime";
import api from "../../../middleware/api";


const statusColor = { online: "bg-emerald-500", offline: "bg-gray-500" };

const friendActivityLabel = (updatedAt) => {
  if (!updatedAt) return "unknown";
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  if (diffMs < 60_000) return "active";
  return formatRelativeTime(updatedAt);
};

async function getFriends(search){
  const response=await api.get(`/friends?search=${search}`)
  return response.data
}
export default function FriendsMessages() {
  const { t } = useTranslation("friends");
  const [activeId, setActiveId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const debouncedQuery=useDebounce(search,500)

  const { data, isLoading, error } = useQuery({
    queryKey: ["friends", debouncedQuery],
    queryFn: () => getFriends(debouncedQuery),
    retry: 1,
  });

  const friendItems = data?.friends ?? [];
  const filteredFriends = friendItems.filter((item) =>
    item.friend?.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeItem = filteredFriends.find((item) => item.friend?._id === activeId) || filteredFriends[0] || null;
  const activeFriend = activeItem?.friend ?? null;

  const sendMessage = () => {
    return;
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectFriend = (id) => {
    setActiveId(id);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const statusLabel = {
    online: t("messages.status.online"),
    offline: t("messages.status.offline"),
  };

  const activeStatus = activeFriend ? friendActivityLabel(activeFriend.updatedAt) : "";
  const activeStatusClass = activeStatus === "active" ? "bg-black" : "bg-gray-500";

  return (
    <div className="mt-2 font-Inter">
      <div className="flex items-center justify-center p-2 sm:p-4">
        <div className="w-full h-[75vh] min-h-125 flex gap-3 relative">
          {/* Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden shrink-0"
              >
                <div className="w-full h-full bg-[rgba(61,53,85,0.7)] backdrop-blur-lg rounded-2xl border border-[#9B7EDE]/15 flex flex-col">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-[#9B7EDE]/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">
                        {t("messages.title")}
                      </h3>
                      <span className="text-xs text-purple-300/50">
                        {filteredFriends.length} {t("messages.unread")}
                      </span>
                    </div>
                    {/* Search */}
                    <div className="bg-[#3D3555] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#9B7EDE]/10">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder={t("messages.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent text-white rounded-full placeholder-[rgba(184,167,229,0.4)] text-xs outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Friends List */}
                  <div
                    className="flex-1 overflow-y-auto py-2 px-2
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-thumb]:bg-[#52466B]
                    [&::-webkit-scrollbar-track]:bg-transparent"
                  >
                    {isLoading ? (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-[#B8A7E5]">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                        <span>Loading friends...</span>
                      </div>
                    ) : error ? (
                      <div className="flex h-full items-center justify-center text-sm text-red-300 px-4 text-center">
                        {error?.response?.data?.message || error?.message || "Unable to load friends."}
                      </div>
                    ) : filteredFriends.length > 0 ? (
                      filteredFriends.map((item) => {
                        const friend = item.friend;
                        const isActive = friendActivityLabel(friend.updatedAt) === "active";
                        return (
                          <motion.button
                            key={friend._id}
                            onClick={() => selectFriend(friend._id)}
                            whileHover={{ backgroundColor: "rgba(82,70,107,0.5)" }}
                            className={`w-full text-left rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-150 mb-1
                              ${activeId === friend._id ? "bg-[rgba(155,126,222,0.2)] border border-[#9B7EDE]/30" : "border border-transparent"}`}
                          >
                            <div className="relative shrink-0">
                              <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                  {friend.fullName?.[0] ?? "?"}
                                </span>
                              </div>
                              <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border border-[#1B1630] ${isActive ? "bg-black" : "bg-gray-500"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-sm font-medium truncate text-white/90">
                                  {friend.fullName}
                                </span>
                                <span className="text-[10px] text-purple-300/40 shrink-0 ml-1">
                                  {friendActivityLabel(friend.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-purple-300/40 text-sm">
                        {t("messages.noFriends")}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
            }}
            className="flex-1 bg-[#3D3555] backdrop-blur-lg rounded-2xl border border-[#9B7EDE]/20 flex flex-col min-w-0 overflow-hidden"
          >
            {/* Chat Header */}
            {activeFriend ? (
              <div className="px-4 py-3 border-b border-[#9B7EDE]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSidebarOpen((p) => !p)}
                    className="w-8 h-8 rounded-xl bg-[rgba(82,70,107,0.5)] hover:bg-[rgba(82,70,107,0.8)] border border-[#9B7EDE]/15 flex items-center justify-center text-purple-300 transition-colors shrink-0"
                  >
                    {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                  </motion.button>

                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {activeFriend.fullName?.[0] ?? "?"}
                      </span>
                    </div>
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border border-[#1B1630] ${activeStatusClass}`} />
                  </div>

                  <div>
                    <h2 className="text-white font-semibold text-sm leading-tight">
                      {activeFriend.fullName}
                    </h2>
                    <p className="text-xs text-[#B8A7E5]">
                      {activeStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5"></div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-[#9B7EDE]/20">
                <div className="text-white text-sm">Select a friend to view messages.</div>
              </div>
            )}

            {/* Messages */}
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm text-[#B8A7E5]">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                <span>Loading friends...</span>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-sm text-red-300 px-4 text-center">
                {error?.response?.data?.message || error?.message || "Unable to load friends."}
              </div>
            ) : activeFriend ? (
              <div
                className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-thumb]:bg-[#52466B]
                [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <AnimatePresence initial={false}>
                  {activeFriend.messages?.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 340, damping: 24 }}
                      className={`flex items-end gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.from === "them" && (
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center shrink-0 mb-1">
                          <span className="text-white font-semibold text-[10px]">
                            {activeFriend.fullName?.[0] ?? "?"}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex flex-col gap-1 max-w-[65%] ${msg.from === "me" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm text-white leading-relaxed
                          ${
                            msg.from === "me"
                              ? "bg-[#9b7ede] rounded-2xl"
                              : "bg-[#52466B] rounded-2xl"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-purple-300/40 px-1">
                          {msg.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-purple-300/50 text-sm px-4">
                Select a friend from the left to see messages.
              </div>
            )}

            {activeFriend && (
              <div className="px-4 py-3 border-t border-[#9B7EDE]/10 shrink-0">
                <div className="flex items-center gap-2 bg-[rgba(82,70,107,0.4)] border border-[#9B7EDE]/15 rounded-2xl px-3 py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={t("messages.inputPlaceholder")}
                    className="flex-1 bg-transparent text-white placeholder-[rgba(184,167,229,0.35)] text-sm outline-none min-w-0"
                  />
                  <button className="text-purple-300/60 hover:text-purple-300 transition-colors shrink-0">
                    <EmojiIcon />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-full bg-[#9b7ede] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/30 transition-opacity cursor-pointer"
                  >
                    <SendIcon />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

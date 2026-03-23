/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendIcon,SearchIcon,EmojiIcon,ChevronLeft,ChevronRight } from "../../../comp/ui/Icons";
const friends = [
  {
    id: 1, name: "Sarah Johnson", initials: "SJ", status: "online",
    lastMsg: "Hey! Ready for the algorithm test?", time: "2m ago", unread: 2,
    messages: [
      { id: 1, from: "them", text: "Cool! I struggled with that part. Want to review it together?", time: "05:43 PM" },
      { id: 2, from: "me", text: "Sure! How about tomorrow at 2 PM?", time: "05:53 PM" },
      { id: 3, from: "them", text: "Perfect! Library study room?", time: "06:13 PM" },
      { id: 4, from: "them", text: "Hey! Ready for the algorithm test?", time: "06:21 PM" },
    ],
  },
  {
    id: 2, name: "Alex Chen", initials: "AC", status: "online",
    lastMsg: "Check out this study guide I found", time: "15m ago", unread: 0,
    messages: [
      { id: 1, from: "them", text: "Check out this study guide I found", time: "09:15 AM" },
      { id: 2, from: "me", text: "Looks great! Thanks for sharing", time: "09:20 AM" },
      { id: 3, from: "them", text: "No problem! Good luck on the exam 🎯", time: "09:21 AM" },
    ],
  },
  {
    id: 3, name: "Emma Davis", initials: "ED", status: "offline",
    lastMsg: "Can we study together tomorrow?", time: "1h ago", unread: 1,
    messages: [
      { id: 1, from: "me", text: "Hey Emma! How's the project going?", time: "11:00 AM" },
      { id: 2, from: "them", text: "Almost done! Just finishing the last section", time: "11:45 AM" },
      { id: 3, from: "them", text: "Can we study together tomorrow?", time: "12:10 PM" },
    ],
  },
  {
    id: 4, name: "Michael Brown", initials: "MB", status: "offline",
    lastMsg: "Thanks for the notes!", time: "3h ago", unread: 0,
    messages: [
      { id: 1, from: "them", text: "Could you send me your notes from today?", time: "08:00 AM" },
      { id: 2, from: "me", text: "Sure, sending now!", time: "08:05 AM" },
      { id: 3, from: "them", text: "Thanks for the notes!", time: "08:10 AM" },
    ],
  },
  {
    id: 5, name: "Olivia Martinez", initials: "OM", status: "online",
    lastMsg: "Great job on your presentation!", time: "5h ago", unread: 0,
    messages: [
      { id: 1, from: "them", text: "Great job on your presentation!", time: "03:00 PM" },
      { id: 2, from: "me", text: "Thank you so much! 😊", time: "03:15 PM" },
    ],
  },
];

const statusColor = { online: "bg-emerald-500", offline: "bg-gray-500" };
const statusLabel = { online: "Online", away: "Away", offline: "Offline" };


export default function FriendsMessages() {
  const [activeId, setActiveId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [allFriends, setAllFriends] = useState(friends);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeFriend = allFriends.find(f => f.id === activeId);
  const filtered = allFriends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAllFriends(prev => prev.map(f =>
      f.id === activeId
        ? { ...f, messages: [...f.messages, { id: Date.now(), from: "me", text: input.trim(), time }], lastMsg: input.trim(), time: "now" }
        : f
    ));
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const selectFriend = (id) => {
    setActiveId(id);
    // clear unread
    setAllFriends(prev => prev.map(f => f.id === id ? { ...f, unread: 0 } : f));
    // on mobile close sidebar after selecting
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="mt-2 font-Inter">
      <div className="flex items-center justify-center p-2 sm:p-4">
        <div className="w-full  h-[75vh] min-h-[500px] flex gap-3 relative">

          {/* Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden flex-shrink-0"
              >
                <div className="w-full h-full bg-[rgba(61,53,85,0.7)] backdrop-blur-lg rounded-2xl border border-[#9B7EDE]/15 flex flex-col">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-[#9B7EDE]/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Messages</h3>
                      <span className="text-xs text-purple-300/50">{allFriends.filter(f => f.unread > 0).length} unread</span>
                    </div>
                    {/* Search */}
                    <div className="bg-[#3D3555] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#9B7EDE]/10">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search friends..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-white rounded-full placeholder-[rgba(184,167,229,0.4)] text-xs outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Friends List */}
                  <div className="flex-1 overflow-y-auto py-2 px-2
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-thumb]:bg-[#52466B]
                    [&::-webkit-scrollbar-track]:bg-transparent">
                    {filtered.map((friend) => (
                      <motion.button
                        key={friend.id}
                        onClick={() => selectFriend(friend.id)}
                        whileHover={{ backgroundColor: "rgba(82,70,107,0.5)" }}
                        className={`w-full text-left rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-150 mb-1
                          ${activeId === friend.id ? "bg-[rgba(155,126,222,0.2)] border border-[#9B7EDE]/30" : "border border-transparent"}`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">{friend.initials}</span>
                          </div>
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor[friend.status]} rounded-full border-2 border-[#2A2440]`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-sm font-medium truncate ${activeId === friend.id ? "text-white" : "text-white/90"}`}>{friend.name}</span>
                            <span className="text-[10px] text-purple-300/40 flex-shrink-0 ml-1">{friend.time}</span>
                          </div>
                          <p className="text-purple-300/50 text-xs truncate">{friend.lastMsg}</p>
                        </div>
                        {friend.unread > 0 && (
                          <div className="w-5 h-5 bg-[#9b7ede] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-bold">{friend.unread}</span>
                          </div>
                        )}
                      </motion.button>
                    ))}

                    {filtered.length === 0 && (
                      <div className="text-center py-8 text-purple-300/40 text-sm">No friends found</div>
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
  mass: 0.8
}}
          
          className="flex-1 bg-[#3D3555] backdrop-blur-lg rounded-2xl border border-[#9B7EDE]/20 flex flex-col min-w-0 overflow-hidden">

            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-[#9B7EDE]/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Toggle sidebar button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(p => !p)}
                  className="w-8 h-8 rounded-xl bg-[rgba(82,70,107,0.5)] hover:bg-[rgba(82,70,107,0.8)] border border-[#9B7EDE]/15 flex items-center justify-center text-purple-300 transition-colors flex-shrink-0"
                >
                  {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </motion.button>

                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">{activeFriend.initials}</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor[activeFriend.status]} rounded-full border-2 border-[#2A2440]`} />
                </div>

                <div>
                  <h2 className="text-white font-semibold text-sm leading-tight">{activeFriend.name}</h2>
                  <p className={`text-xs text-[#B8A7E5]`}>
                    {statusLabel[activeFriend.status]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
               
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-thumb]:bg-[#52466B]
              [&::-webkit-scrollbar-track]:bg-transparent">
              <AnimatePresence initial={false}>
                {activeFriend.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 24 }}
                    className={`flex items-end gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "them" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center flex-shrink-0 mb-1">
                        <span className="text-white font-semibold text-[10px]">{activeFriend.initials}</span>
                      </div>
                    )}

                    <div className={`flex flex-col gap-1 max-w-[65%] ${msg.from === "me" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm text-white leading-relaxed
                        ${msg.from === "me"
                          ? "bg-[#9b7ede] rounded-[16px]"
                          : "bg-[#52466B] rounded-[16px] "
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-purple-300/40 px-1">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#9B7EDE]/10 flex-shrink-0">
              <div className="flex items-center gap-2 bg-[rgba(82,70,107,0.4)] border border-[#9B7EDE]/15 rounded-2xl px-3 py-2">
               
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder-[rgba(184,167,229,0.35)] text-sm outline-none min-w-0"
                />
                <button className="text-purple-300/60 hover:text-purple-300 transition-colors flex-shrink-0">
                  <EmojiIcon />
                </button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full bg-[#9b7ede] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/30 transition-opacity cursor-pointer"
                >
                  <SendIcon />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
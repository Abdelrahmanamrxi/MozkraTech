import { AnimatePresence, motion as Motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ChevronLeft, ChevronRight, EmojiIcon, SendIcon } from "../../../../comp/ui/Icons";
import {formatRelativeTime} from "@/utils/formatTime.js"



function ChatHeader({
  displaySelected,
  lastActivityDate,
  friendActivityLabel,
  userStatus,
  socketConnectionStatus,
  sidebarOpen,
  onToggleSidebar,
}) {
  const normalizedUserStatus =
    typeof userStatus === "string"
      ? { status: userStatus, lastActivityDate: null }
      : userStatus;

  const fallbackStatus = friendActivityLabel(lastActivityDate);
  const activityStatus = normalizedUserStatus?.status || fallbackStatus;
  const isOnline = normalizedUserStatus?.status
    ? normalizedUserStatus.status === "online"
    : fallbackStatus === "online";

  return (
    <div className="px-4 py-3 border-b border-[#9B7EDE]/20 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="w-8 h-8 rounded-xl bg-[rgba(82,70,107,0.5)] hover:bg-[rgba(82,70,107,0.8)] border border-[#9B7EDE]/15 flex items-center justify-center text-purple-300 transition-colors shrink-0"
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Motion.button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
            <span className="text-white font-semibold text-xs">{displaySelected?.fullName?.[0] ?? "?"}</span>
          </div>
          <span
            className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border border-[#1B1630] ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
          />
        </div>

        <div>
          <h2 className="text-white font-semibold text-sm leading-tight">{displaySelected?.fullName}</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#B8A7E5]">{activityStatus}</p>
            <span className="text-xs text-[#B8A7E5]/60">•</span>
            <p className={`text-xs ${socketConnectionStatus === "connected" ? "text-emerald-400" : "text-red-400"}`}>
              {socketConnectionStatus === "connected" ? "Connected To Internet" : "Disconnected From The Internet"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5" />
    </div>
  );
}

function MessagesContent({ selected, selectedMessages, messagesEndRef, isLoading, error }) {

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center text-purple-300/50 text-sm px-4">
        Select a friend from the left to see messages.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-purple-300/70 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 bg-red-950/30 border border-red-500/30 rounded-lg p-4 max-w-xs">
          <p className="text-red-300 text-sm font-medium">Failed to load messages</p>
          <p className="text-red-200/70 text-xs text-center">{"An error occurred while fetching messages"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
      [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-thumb]:bg-[#52466B]
      [&::-webkit-scrollbar-track]:bg-transparent"
    >
      <AnimatePresence initial={false}>
        {selectedMessages.map((msg, index) => (
          <Motion.div
            key={msg.id ?? msg._id ?? index}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
            className={`group flex items-end gap-2 ${msg.from === "me" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`flex flex-col gap-1 max-w-[65%] ${msg.from === "me" ? "items-start" : "items-end"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-150
                ${
                  msg.from === "me"
                    ? "bg-linear-to-r from-[#c4b5fd] to-[#a78bfa] text-slate-950 rounded-bl-2xl"
                    : "bg-[#27233a] text-white rounded-br-2xl"
                }`}
                title={
                  msg.sentAt
                    ? new Date(msg.sentAt).toLocaleString()
                    : msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : ""
                }
              >
                {msg.message}
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-purple-300/40">
                <span>{formatRelativeTime(msg.sentAt || msg.createdAt || msg.time)}</span>
                {msg.from === "me" && (
                  <span className={msg.isRead ? "text-emerald-300" : "text-orange-300"}>
                    {msg.isRead ? "Seen" : "Sent"}
                  </span>
                )}
              </div>
              {msg.from === "them" && (
                <div className="self-end w-8 h-8 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center mt-1">
                  <span className="text-white font-semibold text-[10px]">{selected.fullName?.[0] ?? "?"}</span>
                </div>
              )}
            </div>
          </Motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageComposer({ selected, inputRef, input, onInputChange, onKeyDown, onSend, canSend, t }) {
  if (!selected) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-t border-[#9B7EDE]/10 shrink-0">
      <div className="flex items-center gap-2 bg-[rgba(82,70,107,0.4)] border border-[#9B7EDE]/15 rounded-2xl px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("messages.inputPlaceholder")}
          className="flex-1 bg-transparent text-white placeholder-[rgba(184,167,229,0.35)] text-sm outline-none min-w-0"
        />
        <button className="text-purple-300/60 hover:text-purple-300 transition-colors shrink-0">
          <EmojiIcon />
        </button>
        <Motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onSend}
          disabled={!canSend}
          className="w-9 h-9 rounded-full bg-[#9b7ede] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/30 transition-opacity cursor-pointer"
        >
          <SendIcon />
        </Motion.button>
      </div>
    </div>
  );
}

function ChatPanel({
  selected,
  displaySelected,
  userStatus,
  sidebarOpen,
  onToggleSidebar,
  isLoading,
  error,
  socketConnectionStatus,
  selectedMessages,
  messagesEndRef,
  inputRef,
  input,
  onInputChange,
  onKeyDown,
  onSend,
  canSend,
  friendActivityLabel,
  t,
}) {
  return (
    <Motion.div
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
      <ChatHeader
        displaySelected={displaySelected}
        lastActivityDate={displaySelected?.updatedAt || selected?.lastActivityDate}
        userStatus={userStatus}
        socketConnectionStatus={socketConnectionStatus}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        friendActivityLabel={friendActivityLabel}
      />

      <MessagesContent
        selected={selected}
        isLoading={isLoading}
        error={error}
        selectedMessages={selectedMessages}
        messagesEndRef={messagesEndRef}
      />

      <MessageComposer
        selected={selected}
        inputRef={inputRef}
        input={input}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
        canSend={canSend}
        t={t}
      />
    </Motion.div>
  );
}

export default ChatPanel;

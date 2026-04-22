import { AnimatePresence, motion as Motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SearchIcon } from "../../../../comp/ui/Icons";


function FriendsSidebar({
  sidebarOpen,
  t,
  search,
  onSearchChange,
  filteredFriends,
  isLoading,
  error,
  friendActivityLabel,
  selectedFriendId,
  unreadByFriend,
  onSelectFriend,
  userStatus,
}) {
  const normalizedSelectedFriendId = selectedFriendId?.toString?.() ?? selectedFriendId;
  const normalizedUserStatus =
    typeof userStatus === "string"
      ? { status: userStatus, lastActivityDate: null }
      : userStatus;

  const totalUnread = filteredFriends.reduce((sum, item) => {
    const friendId = item.friend?._id?.toString?.() ?? item.friend?._id;
    if (!friendId) return sum;
    return sum + (unreadByFriend[friendId] || 0);
  }, 0);

  function getLastMessagePreview(item) {
    const content = item.lastMessage?.content;
    if (!content) return t("messages.noMessagesYet");

    const senderId = item.lastMessage?.senderId?.toString?.() || item.lastMessage?.senderId;
    const friendId = item.friend?._id?.toString?.() || item.friend?._id;
    const friendFirstName = item.friend?.fullName?.split(" ")?.[0] || "Friend";

    const senderLabel =
      senderId && friendId && senderId.toString() === friendId.toString()
        ? friendFirstName
        : t("messages.youLabel");

    return `${senderLabel}: ${content}`;
  }

  function checkOnline(activity, friendId) {
    const isSelectedFriend =
      normalizedSelectedFriendId === friendId?.toString?.();

    if (isSelectedFriend) {
      return normalizedUserStatus?.status === "online"
        ? "bg-green-500"
        : "bg-gray-500";
    }

    return "bg-gray-500";
  }
  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <Motion.div
          key="sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="overflow-hidden shrink-0"
        >
          <div className="w-full h-full bg-[rgba(61,53,85,0.7)] backdrop-blur-lg rounded-2xl border border-[#9B7EDE]/15 flex flex-col">
            <div className="p-4 border-b border-[#9B7EDE]/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">{t("messages.title")}</h3>
                <span className="text-sm text-white font-semibold font-blinker">
                  {totalUnread} {t("messages.unread")}
                </span>
              </div>

              <div className="bg-[#3D3555] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#9B7EDE]/10">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={t("messages.searchPlaceholder")}
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-white rounded-full placeholder-[rgba(184,167,229,0.4)] text-xs outline-none w-full"
                />
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto py-2 px-2
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-thumb]:bg-[#52466B]
              [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-[#B8A7E5]">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span>{t("messages.loadingFriends")}</span>
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-sm text-red-300 px-4 text-center">
                  {t("messages.unableToLoadFriends")}
                </div>
              ) : filteredFriends.length > 0 ? (
                filteredFriends.map((item) => {
                  const friend = item.friend;
                  const friendId = friend._id?.toString?.() ?? friend._id;
                  const unreadCount = unreadByFriend[friendId?.toString?.() ?? friendId] ?? item.unReadCount ?? 0;
                  const isSelectedFriend =
                    normalizedSelectedFriendId === friend._id?.toString?.();

                  const isSelectedFriendOnline =
                    isSelectedFriend && normalizedUserStatus?.status === "online";

                  const activityTimestamp =
                    isSelectedFriend && normalizedUserStatus?.lastActivityDate
                      ? normalizedUserStatus.lastActivityDate
                      : item.friend.lastActivityDate;

                  const renderedActivity = friendActivityLabel(activityTimestamp, isSelectedFriendOnline);

                  return (
                    <Motion.button
                      key={friend._id}
                      onClick={() => onSelectFriend(friend, item.conversationId)}
                      whileHover={{ backgroundColor: "rgba(82,70,107,0.5)" }}
                      className={`w-full text-left rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-150 mb-1
                        ${selectedFriendId === friend._id ? "bg-[rgba(155,126,222,0.2)] border border-[#9B7EDE]/30" : "border border-transparent"}`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#9b7ede] to-[#7c5fbd] flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">{friend.fullName?.[0] ?? "?"}</span>
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border border-[#1B1630] ${checkOnline(item.friend.lastActivityDate, friend._id)
                            }`}
                        />
                        <AnimatePresence>
                          {!isSelectedFriend && unreadCount > 0 && (
                            <Motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white px-1"
                            >
                              {unreadCount}
                            </Motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium truncate text-white/90">{friend.fullName}</span>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] text-purple-300/40 shrink-0 ml-1">
                              {renderedActivity}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-purple-200/60 truncate">
                          {getLastMessagePreview(item)}
                        </p>
                      </div>
                    </Motion.button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-purple-300/40 text-sm">{t("messages.noFriends")}</div>
              )}
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default FriendsSidebar;

/* eslint-disable no-unused-vars */
import {useState} from 'react'
import { motion } from 'framer-motion'
import { SearchIcon } from 'lucide-react';


  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };




function AddFriend({setIsAddFriendsOpen}) {
      const [searchQuery, setSearchQuery] = useState("");
      const allFriends = [
    { id: 1, name: "Alex Chen", username: "@alexchen", avatar: "AC", status: "online", level: 12, bio: "Game enthusiast" },
    { id: 2, name: "Jordan Smith", username: "@jsmith", avatar: "JS", status: "online", level: 15, bio: "Always online" },
    { id: 3, name: "Taylor Moon", username: "@tmoon", avatar: "TM", status: "away", level: 10, bio: "Casual player" },
    { id: 4, name: "Casey Rivera", username: "@crivera", avatar: "CR", status: "offline", level: 8, bio: "New player" },
    { id: 5, name: "Morgan Lee", username: "@mlee", avatar: "ML", status: "online", level: 20, bio: "Pro gamer" },
    { id: 6, name: "Riley Park", username: "@rpark", avatar: "RP", status: "online", level: 14, bio: "Community leader" },
  ];

  const normalizedQuery = searchQuery.toLowerCase();

  const filteredFriends = allFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(normalizedQuery) ||
      friend.username.toLowerCase().includes(normalizedQuery)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "away":
        return "#f59e0b";
      case "offline":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
  <>
    <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                onClick={() => setIsAddFriendsOpen(false)}
                className="fixed inset-0 bg-[#0D081A]/70 backdrop-blur-xl z-50"
              />
  
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-x-0 top-1/2 z-50 mx-auto w-[95%] max-w-5xl -translate-y-1/2 transform"
              >
                <div className="relative overflow-hidden rounded-[28px] border border-[#9B7EDE]/30 bg-[#1A1530]/95 shadow-[0_35px_90px_rgba(10,7,20,0.75)]">
                  <div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-[#9B7EDE]/30 blur-3xl" />
                  <div className="absolute -right-20 top-14 h-48 w-48 rounded-full bg-[#6B6AD4]/30 blur-3xl" />
  
                  <div className="relative border-b border-[#9B7EDE]/20 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-white font-Inter text-2xl md:text-3xl font-bold">
                          Find And Add Friends
                        </h2>
                        <p className="mt-2 text-sm font-poppins text-[#C6B5F0]">
                          Search players by name or username.
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setIsAddFriendsOpen(false)}
                        whileHover={{ scale: 1.08, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-10 w-10 rounded-full border border-[#9B7EDE]/35 bg-[#9B7EDE]/10 text-[#D8CCF7] transition hover:bg-[#9B7EDE]/25"
                      >
                        x
                      </motion.button>
                    </div>
  
                    <div className="mt-6 flex flex-col gap-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A7E5]">
                          <SearchIcon size={18} />
                        </span>
                        <input
                          type="text"
                          placeholder="Search by name "
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-2xl border border-[#9B7EDE]/35 bg-[#9B7EDE]/10 py-3 pl-11 pr-4 text-white placeholder-[#B8A7E5]/60 focus:border-[#C1A8FF] focus:outline-none focus:ring-2 focus:ring-[#9B7EDE]/20"
                        />
                      </div>
  
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#C6B5F0]">
                        <span className="rounded-full border border-[#9B7EDE]/25 bg-[#9B7EDE]/10 px-3 py-1">
                          {filteredFriends.length} matches
                        </span>
                        <span className="rounded-full border border-[#9B7EDE]/25 bg-[#9B7EDE]/10 px-3 py-1">
                          {allFriends.length} total players
                        </span>
                        <span className="rounded-full border border-[#9B7EDE]/25 bg-[#9B7EDE]/10 px-3 py-1">
                          Search only mode
                        </span>
                      </div>
                    </div>
                  </div>
  
                  <div className="relative p-4 md:p-6">
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                      className="rounded-2xl border border-[#9B7EDE]/25 bg-[#120D24]/65 p-3"
                    >
                      <div className="mb-3 px-2 text-xs font-blinker uppercase tracking-[0.2em] text-[#B8A7E5]">
                        People
                      </div>
  
                      <div className="max-h-[48vh] space-y-3 overflow-y-auto pr-1 scrollbar-hide">
                        {filteredFriends.length > 0 ? (
                          filteredFriends.map((friend, index) => (
                            <motion.div
                              key={friend.id}
                              custom={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover={{ y: -2 }}
                              className="w-full rounded-2xl border border-[#9B7EDE]/20 bg-[#9B7EDE]/8 p-4 text-left transition-all duration-200 hover:border-[#B59EF7]/55 hover:bg-[#9B7EDE]/16"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#9B7EDE] via-[#7F77DD] to-[#6B6AD4] text-sm font-bold text-white shadow-lg">
                                    {friend.avatar}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-blinker font-semibold text-white">
                                      {friend.name}
                                    </p>
                         
                                  </div>
                                </div>
  
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: getStatusColor(friend.status) }}
                                  />
                                  <span className="text-xs text-[#C6B5F0]">Lv. {friend.level}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex min-h-55 flex-col items-center justify-center rounded-2xl border border-dashed border-[#9B7EDE]/30 bg-[#9B7EDE]/5 p-8 text-center"
                          >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#9B7EDE]/20 text-white">
                              <SearchIcon size={28} />
                            </div>
                            <p className="text-base font-medium text-[#E5DBFF]">
                              {searchQuery ? "No friends found" : "Start searching to find friends"}
                            </p>
                            <p className="mt-1 text-sm text-[#B8A7E5]/85">
                              Try a different name or username.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
  </>
  )
}

export default AddFriend

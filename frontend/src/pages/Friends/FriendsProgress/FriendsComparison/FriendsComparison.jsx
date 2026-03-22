/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { YellowFireIcon, BadgeIcon } from "@/comp/ui/Icons";
import SubjectComparison from "./SubjectComparison/SubjectComparison";




const friends = [
  { id: 1, name: "Sarah", initials: "SJ", level: 9, color: "bg-purple-500", online: true },
  { id: 2, name: "Alex", initials: "AC", level: 10, color: "bg-purple-400", online: true },
  { id: 3, name: "Emma", initials: "ED", level: 8, color: "bg-purple-500", online: false, away: true },
  { id: 4, name: "Michael", initials: "MB", level: 9, color: "bg-purple-400", online: true },
  { id: 5, name: "Olivia", initials: "OM", level: 8, color: "bg-purple-500", online: true },
];

const userData = {
  name: "Mohamed (You)",
  initials: "ME",
  level: 8,
  rank: 3,
  color: "bg-purple-500",
  studyHours: 157,
  goals: 24,
  streak: 12,
  achievements: 8,
  progress: 78,
};

const friendStats = {
  1: { name: "Sarah Johnson", initials: "SJ", level: 9, rank: 4, color: "bg-purple-400", studyHours: 142, goals: 22, streak: 15, achievements: 9, progress: 82, diff: { studyHours: -10.6, goals: -9.1, streak: 20.0, achievements: 11.1 } },
  2: { name: "Alex Chen", initials: "AC", level: 10, rank: 1, color: "bg-orange-400", studyHours: 178, goals: 28, streak: 20, achievements: 14, progress: 95, diff: { studyHours: 13.4, goals: 16.7, streak: 66.7, achievements: 75.0 } },
  3: { name: "Emma Davis", initials: "ED", level: 8, rank: 6, color: "bg-emerald-500", studyHours: 128, goals: 19, streak: 7, achievements: 6, progress: 65, diff: { studyHours: -18.5, goals: -20.8, streak: -41.7, achievements: -25.0 } },
  4: { name: "Michael Brown", initials: "MB", level: 9, rank: 2, color: "bg-slate-400", studyHours: 165, goals: 25, streak: 18, achievements: 11, progress: 89, diff: { studyHours: 5.1, goals: 4.2, streak: 50.0, achievements: 37.5 } },
  5: { name: "Olivia Martinez", initials: "OM", level: 8, rank: 5, color: "bg-rose-400", studyHours: 135, goals: 20, streak: 10, achievements: 7, progress: 71, diff: { studyHours: -14.0, goals: -16.7, streak: -16.7, achievements: -12.5 } },
};

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);



const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const Diff = ({ value }) => {
  if (!value) return null;
  const isPos = value > 0;
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${isPos ? "text-green-400" : "text-red-400"}`}>
      {isPos ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
};

const StatCard = ({ icon, value, label, diff }) => (
  <div className="flex flex-col bg-[#3D3555]/50 p-3 rounded-[16px]  gap-1">
    <div className="flex items-center justify-between">
      <span className="text-purple-300/60">{icon}</span>
      {diff !== undefined && <Diff value={diff} />}
    </div>
    <p className="text-white font-bold text-2xl leading-tight">{value}</p>
    <p className="text-purple-300/50 text-sm">{label}</p>
  </div>
);

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 22 } },
};

export default function FriendsComparison() {
  const [selected, setSelected] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const friend = friendStats[selected];

  return (
    <div className="font-Inter w-full  mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 280, damping: 24 }}
        className="w-full  mx-auto rounded-2xl "
     
      >
        {/* Title */}
          
        <div className="bg-[#3D3555] border border-[#9B7EDE]/20 p-8 mb-8 rounded-[24px]">
        <h2 className="text-white font-bold text-2xl mb-5">Compare Progress</h2>  
        {/* Search */}
        <div className="flex items-center gap-3 bg-[#3D3555]/60 border border-[#9B7EDE]/20 rounded-xl px-4 py-3 mb-5">
          <span className="text-purple-300/50"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search friends to compare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-purple-300/40 text-sm outline-none flex-1"
          />
        </div>

        {/* Friend Selector */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6"
        >
          {filtered.map((f) => (
              <motion.button
              key={f.id}
              variants={itemVariants}
              onClick={() => setSelected(f.id)}
              className={`flex flex-col items-center gap-1.5 rounded-[16px] py-3 px-2 border transition-all duration-200 cursor-pointer ${
                selected === f.id
                  ? "bg-[#9B7EDE]/20 border-3 hover:bg-[#9B7EDE]/20 border-[#9B7EDE]"
                  : "bg-[#52466B] border-2 border-[#9B7EDE]/15 hover:border-[#9B7EDE]/60"
              }`}
            >
              <div className="relative">
                <div className={`w-11 h-11 rounded-full ${f.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {f.initials}
                </div>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1E1B2E] ${f.away ? "bg-yellow-400" : f.online ? "bg-green-400" : "bg-gray-500"}`} />
              </div>
              <p className="text-white text-xs font-medium">{f.name}</p>
              <p className="text-purple-300/50 text-[10px]">Level</p>
              <p className="text-purple-300/70 text-xs font-semibold">{f.level}</p>
            </motion.button>
          ))}
        </motion.div>

          </div>
        {/* Comparison Cards */}
        <div className="flex flex-col lg:flex-row lg:gap-12 gap-6 items-center w-full">
          {/* You */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
            className="rounded-[24px] bg-[#3D3555] p-5 w-full lg:w-1/2 border-3 hover:bg-primary-dark/60 transition-colors border-[#9B7EDE] flex flex-col gap-5"
           
          >
            {/* User Header */}
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl ${userData.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {userData.initials}
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{userData.name}</p>
                <p className="text-purple-300/60 text-sm">Level {userData.level} • #{userData.rank}</p>
                <p className="text-purple-300/40 text-xs">Rank</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <StatCard icon={<ClockIcon />} value={userData.studyHours} label="Study Hours" />
              <StatCard icon={<TargetIcon />} value={userData.goals} label="Goals" />
              <StatCard icon={<YellowFireIcon />} value={userData.streak} label="Day Streak" />
              <StatCard icon={<BadgeIcon />} value={userData.achievements} label="Achievements" />
            </div>

            {/* Progress Bar */}
            <div className="bg-[#3D3555] p-3 rounded-[16px]">
              <div className="flex justify-between  items-center mb-2">
                <span className="text-white font-semibold text-sm">Overall Progress</span>
                <span className="text-[#9B7EDE] font-bold text-lg">{userData.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#2A2440] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userData.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]"
                />
              </div>
            </div>
          </motion.div>

          {/* Friend */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.15 }}
            className="rounded-[24px] bg-[#3D3555] border-3 w-full lg:w-1/2 hover:bg-primary-dark/60 transition-colors border-[#7C5FBD] p-5 flex flex-col gap-5"
            
          >
            {/* Friend Header */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-xl ${friend.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {friend.initials}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1E1B2E]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{friend.name}</p>
                <p className="text-purple-300/60 text-sm">Level {friend.level} • #{friend.rank}</p>
                <p className="text-purple-300/40 text-xs">Rank</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <StatCard icon={<ClockIcon />} value={friend.studyHours} label="Study Hours" diff={friend.diff.studyHours} />
              <StatCard icon={<TargetIcon />} value={friend.goals} label="Goals" diff={friend.diff.goals} />
              <StatCard icon={<YellowFireIcon />} value={friend.streak} label="Day Streak" diff={friend.diff.streak} />
              <StatCard icon={<BadgeIcon />} value={friend.achievements} label="Achievements" diff={friend.diff.achievements} />
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold text-sm">Overall Progress</span>
                <span className="text-[#9B7EDE] font-bold text-lg">{friend.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#2A2440] rounded-full overflow-hidden">
                <motion.div
                  key={selected}
                  initial={{ width: 0 }}
                  animate={{ width: `${friend.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/** SUBJECT COMPARISON */}
    <SubjectComparison/>




    </div>
  );
}
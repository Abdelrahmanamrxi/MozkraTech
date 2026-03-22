/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon } from '@/comp/ui/Icons';
import { YellowFireIcon } from '@/comp/ui/Icons';


const topThree = [
  {
    rank: 1,
    name: "Alex Chen",
    level: 10,
    initials: "AC",
    color: "bg-orange-400",
    hours: "178h",
    goals: 28,
    streak: "20 days",
    isYou: false,
  },
  {
    rank: 2,
    name: "Michael Brown",
    level: 9,
    initials: "MB",
    color: "bg-slate-500",
    hours: "165h",
    goals: 25,
    streak: "18 days",
    isYou: false,
  },
  {
    rank: 3,
    name: "Mohamed (You)",
    level: 8,
    initials: "ME",
    color: "bg-purple-500",
    hours: "157h",
    goals: 24,
    streak: "12 days",
    isYou: true,
  },
];
 
const fullRankings = [
  { rank: 4, name: "Sarah Johnson", level: 9, initials: "SJ", color: "bg-[linear-gradient(180deg,#9B7EDE_0%,#7C5FBD_100%)]", hours: "142h", goals: 22 },
  { rank: 5, name: "Olivia Martinez", level: 8, initials: "OM", color: "bg-[linear-gradient(180deg,#9B7EDE_0%,#7C5FBD_100%)]", hours: "135h", goals: 20 },
  { rank: 6, name: "Emma Davis", level: 8, initials: "ED", color: "bg-[linear-gradient(180deg,#9B7EDE_0%,#7C5FBD_100%)]", hours: "128h", goals: 19 },
];
 

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
 
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 22 } },
};
function Leaderboard() {
  return (
       <motion.div
           initial={{ opacity: 0, y: 24 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, type: "spring", stiffness: 280, damping: 24 }}
           className="w-full mt-3  rounded-2xl p-5 sm:p-7 border-t-1 border-[#9B7EDE]/30"
           style={{
            background: "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)"
           }}
         >
           {/* Header */}
           <div className="flex items-center gap-3 mb-6">
             <div className="w-13 h-13 rounded-xl bg-orange-400 flex items-center justify-center flex-shrink-0">
               <TrophyIcon/>
             </div>
             <div>
               <h2 className="text-white font-semibold text-xl sm:text-2xl leading-tight">Leaderboard</h2>
               <p className="text-purple-300 text-sm mt-0.5">You're ranked <span className='text-white font-semibold'>#3</span> out of 6</p>
             </div>
           </div>
    
           {/* Top 3 Cards */}
           <motion.div
             variants={containerVariants}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5"
           >
             {topThree.map((user) => (
               <motion.div
                 key={user.rank}
                 variants={itemVariants}
                 className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${
                   user.isYou
                     ? "bg-[#9B7EDE]/30 border-2 border-[#9B7EDE] transition-colors hover:bg-[#9B7EDE]/60"
                     : "bg-[#3D3555]/50 border border-t border-[#9B7EDE]/20"
                 }`}
               >
                 {/* Avatar + Name Row */}
                 <div className="flex items-center gap-3">
                   <div className="relative flex-shrink-0">
                     <div
                       className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-sm`}
                     >
                       {user.initials}
                     </div>
                     <span
                       className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#3D3555] text-white border-2`}
                     >
                       {user.rank}
                     </span>
                   </div>
                   <div>
                     <p className="text-white font-semibold text-sm leading-tight">{user.name}</p>
                     <p className="text-purple-300 text-xs">Level {user.level}</p>
                   </div>
                 </div>
    
                 {/* Stats */}
                 <div className="flex flex-col gap-1.5 text-sm">
                   <div className="flex justify-between items-center">
                     <span className="text-purple-200/60">Study Hours</span>
                     <span className="text-white font-medium">{user.hours}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-purple-200/60">Goals</span>
                     <span className="text-white font-medium">{user.goals}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-purple-200/60">Streak</span>
                     <span className="text-white font-medium flex items-center gap-1">
                       <YellowFireIcon/>
                       {user.streak}
                     </span>
                   </div>
                 </div>
               </motion.div>
             ))}
           </motion.div>
    
           {/* Full Rankings */}
   <div className="rounded-xl bg-[#3D3555]/50 border border-[#9B7EDE]/20 overflow-hidden">
     <h3 className="text-white font-semibold text-base px-4 sm:px-5 py-3 border-b border-[#9B7EDE]/20">
       Full Rankings
     </h3>
     <motion.div
       variants={containerVariants}
       initial="hidden"
       animate="show"
       className="flex flex-col"
     >
       {fullRankings.map((user) => (
         <motion.div
           key={user.rank}
           variants={itemVariants}
           className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-white/[0.03] border-b border-[#9B7EDE]/20 last:border-b-0 transition-colors duration-150 cursor-pointer"
         >
           {/* Rank */}
           <span className="text-purple-300/60 text-sm font-medium w-6 text-center flex-shrink-0">
             #{user.rank}
           </span>
   
           {/* Avatar */}
           <div
             className={`w-9 h-9 rounded-full ${user.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
           >
             {user.initials}
           </div>
   
           {/* Name + Level */}
           <div className="flex-1 min-w-0">
             <p className="text-white text-sm font-medium truncate">{user.name}</p>
             <p className="text-purple-300/60 text-xs">Level {user.level}</p>
           </div>
   
           {/* Stats */}
           <div className="text-right flex-shrink-0">
             <p className="text-white font-semibold text-sm">{user.hours}</p>
             <p className="text-purple-300/60 text-xs">{user.goals} goals</p>
           </div>
         </motion.div>
       ))}
     </motion.div>
   </div>
         </motion.div>
  )
}

export default Leaderboard

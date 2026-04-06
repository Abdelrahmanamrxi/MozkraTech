

/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import TopCard from "@/comp/ui/TopCard";
import useCountUp from "@/hooks/useCountUp";
import { FireIcon, AchievementIcon, CompletedIcon } from "@/comp/ui/Icons";
import { BookOpenIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
 
// Reuse the same TopCard component pattern from TodaysSummary
export default function StatsOverview({ mockProgressData }) {
  const totalHours = useCountUp(mockProgressData.totalStudyHours, 0);
  const goals = useCountUp(mockProgressData.goalsAchieved, 0);
  const streak = useCountUp(mockProgressData.dayStreak, 0);
  const achievements = useCountUp(mockProgressData.achievements, 0);
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
 
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
 
  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.15,
      rotate: 8,
      transition: { duration: 0.3 }
    }
  };
 
  const numberVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: { duration: 0.2 }
    }
  };
  const {t}=useTranslation(['progress'])
 
  return (
    <section className="mt-8">
      <motion.div
        className="grid font-blinker grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Study Hours */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8 }}
          className="group flex bg-[#9B7EDE]/10 flex-col items-start border-2 border-[#9B7EDE]/60 rounded-[24px] font-Inter p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#9B7EDE]/80 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at top right, #9B7EDE15, transparent)" }} />
          
          <motion.div
            variants={iconVariants}
            initial="idle"
            whileHover="hover"
            className="relative z-10"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.00033 12H6.00033C5.11627 12 4.26842 11.6489 3.6433 11.0237C3.01818 10.3986 2.66699 9.55076 2.66699 8.66671C2.66699 7.78265 3.01818 6.93481 3.6433 6.30968C4.26842 5.68456 5.11627 5.33337 6.00033 5.33337H8.00033"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 12H26C26.8841 12 27.7319 11.6489 28.357 11.0237C28.9821 10.3986 29.3333 9.55076 29.3333 8.66671C29.3333 7.78265 28.9821 6.93481 28.357 6.30968C27.7319 5.68456 26.8841 5.33337 26 5.33337H24"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33301 29.3334H26.6663"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.333 19.5466V22.6666C13.333 23.4 12.7063 23.9733 12.0397 24.28C10.4663 25 9.33301 26.9866 9.33301 29.3333"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.667 19.5466V22.6666C18.667 23.4 19.2937 23.9733 19.9603 24.28C21.5337 25 22.667 26.9866 22.667 29.3333"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 2.66663H8V12C8 14.1217 8.84286 16.1565 10.3431 17.6568C11.8434 19.1571 13.8783 20 16 20C18.1217 20 20.1566 19.1571 21.6569 17.6568C23.1571 16.1565 24 14.1217 24 12V2.66663Z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          
          <motion.p
            variants={numberVariants}
            initial="idle"
            whileHover="hover"
            className="font-bold text-white mt-2 text-2xl relative z-10"
          >
            {totalHours}
          </motion.p>
          <p className="text-[#B8A7E5] relative z-10">{t("stats.totalStudyHours")}</p>
 
          <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: "#9B7EDE" }} />
        </motion.div>
 
        {/* Goals Achieved */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8 }}
          className="group flex bg-[#7C5FBD]/20 flex-col items-start border border-[#9B7EDE]/50 rounded-[24px] font-Inter p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#7C5FBD]/80 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at top right, #7C5FBD15, transparent)" }} />
          
          <motion.div
            variants={iconVariants}
            initial="idle"
            whileHover="hover"
            className="relative z-10"
          >
            <CompletedIcon />
          </motion.div>
 
          <motion.p
            variants={numberVariants}
            initial="idle"
            whileHover="hover"
            className="font-bold text-white mt-2 text-2xl relative z-10"
          >
            {goals}
          </motion.p>
          <p className="text-[#B8A7E5] relative z-10">{t("stats.goalsAchieved")}</p>
 
          <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: "#7C5FBD" }} />
        </motion.div>
 
        {/* Day Streak */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8 }}
          className="group flex bg-gradient-to-b from-[rgba(0,201,80,0.2)] to-[rgba(0,201,80,0.1)] flex-col items-start border border-[#FF8904] rounded-[24px] font-Inter p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#00C950]/80 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at top right, #00C95015, transparent)" }} />
          
          <motion.div
            variants={iconVariants}
            initial="idle"
            whileHover="hover"
            className="relative z-10"
          >
            <FireIcon />
          </motion.div>
 
          <motion.p
            variants={numberVariants}
            initial="idle"
            whileHover="hover"
            className="font-bold text-white mt-2 text-2xl relative z-10"
          >
            {streak}
          </motion.p>
          <p className="text-[#B8A7E5] relative z-10">{t("stats.dayStreak")}</p>
 
          <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: "#00C950" }} />
        </motion.div>
 
        {/* Achievements */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -8 }}
          className="group flex bg-gradient-to-br from-[#F0B100]/20 via-[white]/5 to-transparent flex-col items-start border-t-2 border-[#F0B100]/40 rounded-[24px] font-Inter p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[#F0B100]/60 relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at top right, #F0B10015, transparent)" }} />
          
          <motion.div
            variants={iconVariants}
            initial="idle"
            whileHover="hover"
            className="relative z-10"
          >
            <AchievementIcon />
          </motion.div>
 
          <motion.p
            variants={numberVariants}
            initial="idle"
            whileHover="hover"
            className="font-bold text-white mt-2 text-2xl relative z-10"
          >
            {achievements}
          </motion.p>
          <p className="text-[#B8A7E5] relative z-10">{t("stats.achievements")}</p>
 
          <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500" style={{ backgroundColor: "#F0B100" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
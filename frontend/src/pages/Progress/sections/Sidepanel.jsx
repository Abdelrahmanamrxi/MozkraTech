/* eslint-disable no-unused-vars */
import React from "react";
import { Card } from "@/comp/ui/TopCard";
import { motion } from "framer-motion";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton";
import { StartIcon } from "@/comp/ui/Icons";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProgressBar from "@/comp/ui/ProgressBar";


/* ── Overall Progress card ── */
function OverallProgressCard({ mockProgressData }) {
  const {i18n}=useTranslation()
  return (
    <Card variant="purple" className="p-5">
      <div className="flex flex-row items-center gap-2 mb-2">
        <TrendingUp size={18} className="text-white/70" />
        <p className="font-blinker font-semibold text-white/80 text-sm uppercase tracking-widest">
          {i18n.language==="ar"?"التقدم الشامل":"Overall Progress"}
        </p>
      </div>
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="font-poppins text-5xl font-bold text-white"
      >
        {mockProgressData.overallProgress}%
      </motion.p>
      <p className="font-blinker text-white/70 text-sm mt-1">
        {i18n.language==="ar"?"إنت ماشي كويس جدًا  !   كمل بنفس الحماس":"You're doing great! Keep up the momentum."}
      </p>
      <div className="mt-4 flex flex-row items-center justify-between">
        <p className="font-blinker text-xs text-white/50">{i18n.language==="ar"?"هذا الشهر":"This Month"}</p>
        <span
          className="font-blinker text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        >
          {mockProgressData.progressChangeThisMonth}
        </span>
      </div>
    </Card>
  );
}

/* ── Achievements card ── */
function AchievementsCard({ mockProgressData }) {
  const unlocked = mockProgressData.achievementBadges.filter(
    (b) => b.unlocked,
  ).length;
  const total = mockProgressData.achievementBadges.length;
const {i18n}=useTranslation()
  return (
    <div  className="p-5 bg-[#3D3555] border border-[#9B7EDE]/30 rounded-[24px]">
      <div className="flex flex-row items-center justify-between mb-4">
        <p className="font-poppins font-semibold text-white">{i18n.language==="ar"?"الإنجازات":"Achievements"}</p>
        <span className="font-blinker text-sm text-white/50">
          {unlocked}/{total}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {mockProgressData.achievementBadges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.07 * index,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="relative"
          >
            <div
              className="w-full aspect-square rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: badge.unlocked
                  ? badge.color
                  : "rgba(255,255,255,0.06)",
                opacity: badge.unlocked ? 1 : 0.5,
              }}
            >
              <span>{badge.icon}</span>
            </div>
            {badge.unlocked && (
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#22c55e" }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4l1.8 1.8L6.5 2"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <button
        className="mt-4 w-full py-2 rounded-xl font-blinker text-sm text-white/60 font-semibold"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {i18n.language==="ar"?"عرض جميع الإنجازات":"View All Achievements"}
      </button>
    </div>
  );
}

/* ── Level Progress card ── */
function LevelProgressCard({ mockProgressData }) {
  const { level, xp, xpRequired } = mockProgressData;
  const xpPct = Math.round((xp / xpRequired) * 100);
  const xpRemaining = xpRequired - xp;

  return (
    <Card variant="dark" className="p-5">
      <div className="flex flex-row items-center justify-between mb-3">
        <p className="font-poppins font-semibold text-white">Level Progress</p>
        <span
          className="font-blinker text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(144, 103, 198, 0.25)", color: "#c4b5fd" }}
        >
          Level {level}
        </span>
      </div>
      <div className="flex flex-row justify-between font-blinker text-xs text-white/50 mb-1">
        <span>XP Progress</span>
        <span>
          {xp.toLocaleString()} / {xpRequired.toLocaleString()}
        </span>
      </div>
      <ProgressBar value={xpPct} max={100} delay={400} />
      <p className="font-blinker text-xs text-white/40 mt-2">
        {xpRemaining.toLocaleString()} XP needed to reach Level {level + 1}
      </p>
    </Card>
  );
}

/* ── Streak card ── */
function StreakCard({ mockProgressData }) {
  const { dayStreak, personalBestStreak, streakDays } = mockProgressData;
  const {i18n}=useTranslation()
  return (
    <div  className="p-5 bg-[#3D3555] border border-[#9B7EDE]/20 rounded-[24px]">
      <div className="flex flex-row items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: "#f97316" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.91634 16.9167C10.6899 16.9167 11.4318 16.6094 11.9787 16.0624C12.5257 15.5154 12.833 14.7735 12.833 14C12.833 12.39 12.2497 11.6667 11.6663 10.5C10.4157 7.99983 11.405 5.77033 13.9997 3.5C14.583 6.41667 16.333 9.21667 18.6663 11.0833C20.9997 12.95 22.1663 15.1667 22.1663 17.5C22.1663 18.5725 21.9551 19.6344 21.5447 20.6252C21.1343 21.6161 20.5327 22.5164 19.7744 23.2747C19.016 24.033 18.1157 24.6346 17.1249 25.045C16.1341 25.4554 15.0721 25.6667 13.9997 25.6667C12.9272 25.6667 11.8653 25.4554 10.8744 25.045C9.8836 24.6346 8.98331 24.033 8.22497 23.2747C7.46662 22.5164 6.86507 21.6161 6.45466 20.6252C6.04424 19.6344 5.83301 18.5725 5.83301 17.5C5.83301 16.1548 6.33817 14.8237 6.99967 14C6.99967 14.7735 7.30697 15.5154 7.85395 16.0624C8.40093 16.6094 9.14279 16.9167 9.91634 16.9167Z"
              stroke="white"
              stroke-width="2.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-poppins font-semibold text-white">
            {dayStreak} {i18n.language==="ar"?"عدد الأيام المتتالية":"Day Streak"}
          </p>
          <p className="font-blinker text-xs flex flex-row gap-3 text-white/50">
            {i18n.language==="ar"?"أفضل إنجاز شخصي":"Personal Best"} : {personalBestStreak} {i18n.language==="ar"?"ايام":"Days"}
          </p>
        </div>
      </div>

      {/* Streak grid — 2 rows of 7 */}
      <div className="grid grid-cols-7 gap-2">
        {streakDays.map((active, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.04 * i,
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="aspect-square rounded-lg flex items-center justify-center text-base"
            style={{
              background: active ? "#f97316" : "rgba(255,255,255,0.07)",
            }}
          >
            {active && (
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.91634 16.9167C10.6899 16.9167 11.4318 16.6094 11.9787 16.0624C12.5257 15.5154 12.833 14.7735 12.833 14C12.833 12.39 12.2497 11.6667 11.6663 10.5C10.4157 7.99983 11.405 5.77033 13.9997 3.5C14.583 6.41667 16.333 9.21667 18.6663 11.0833C20.9997 12.95 22.1663 15.1667 22.1663 17.5C22.1663 18.5725 21.9551 19.6344 21.5447 20.6252C21.1343 21.6161 20.5327 22.5164 19.7744 23.2747C19.016 24.033 18.1157 24.6346 17.1249 25.045C16.1341 25.4554 15.0721 25.6667 13.9997 25.6667C12.9272 25.6667 11.8653 25.4554 10.8744 25.045C9.8836 24.6346 8.98331 24.033 8.22497 23.2747C7.46662 22.5164 6.86507 21.6161 6.45466 20.6252C6.04424 19.6344 5.83301 18.5725 5.83301 17.5C5.83301 16.1548 6.33817 14.8237 6.99967 14C6.99967 14.7735 7.30697 15.5154 7.85395 16.0624C8.40093 16.6094 9.14279 16.9167 9.91634 16.9167Z"
                    stroke="white"
                    stroke-width="2.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Keep Going card ── */
function KeepGoingCard({ mockProgressData }) {
  const {i18n}=useTranslation()
  return (
    <div  className="p-5 border-2 bg-[#9B7EDE]/20 border-[#9B7EDE]/30 rounded-[24px]">
      <div className="flex flex-col items-start gap-2 mb-2">
        <span className="text-xl">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 9.33325V27.9999"
              stroke="#9B7EDE"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.00033 24C3.6467 24 3.30756 23.8595 3.05752 23.6095C2.80747 23.3594 2.66699 23.0203 2.66699 22.6667V5.33333C2.66699 4.97971 2.80747 4.64057 3.05752 4.39052C3.30756 4.14048 3.6467 4 4.00033 4H10.667C12.0815 4 13.438 4.5619 14.4382 5.5621C15.4384 6.56229 16.0003 7.91885 16.0003 9.33333C16.0003 7.91885 16.5622 6.56229 17.5624 5.5621C18.5626 4.5619 19.9192 4 21.3337 4H28.0003C28.3539 4 28.6931 4.14048 28.9431 4.39052C29.1932 4.64057 29.3337 4.97971 29.3337 5.33333V22.6667C29.3337 23.0203 29.1932 23.3594 28.9431 23.6095C28.6931 23.8595 28.3539 24 28.0003 24H20.0003C18.9395 24 17.922 24.4214 17.1719 25.1716C16.4218 25.9217 16.0003 26.9391 16.0003 28C16.0003 26.9391 15.5789 25.9217 14.8288 25.1716C14.0786 24.4214 13.0612 24 12.0003 24H4.00033Z"
              stroke="#9B7EDE"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <p className="font-poppins font-semibold text-white">{i18n.language==="ar"? "استمر في التقدم":"Keep Going"}!</p>
      </div>
      <p className="font-blinker text-sm text-white/60 mb-4">
        {i18n.language==="ar"?"إنت ماشي صح عشان تحقق هدفك الأسبوعي. كمل جلستين مذاكرة كمان النهارده!":"You're on track to meet your weekly goal. Complete 2 more study sessions today!"}
      </p>
      <LiquidGlassButton
        icon={StartIcon}
        className="w-full py-2 justify-center"
      >
        {i18n.language==="ar"?"ابدأ المذاكرة":"Start Study Session"}
      </LiquidGlassButton>
    </div>
  );
}

/* ── Composed side panel ── */
export default function SidePanel({ mockProgressData }) {
  return (
    <div className="flex flex-col gap-6 shrink-0 lg:w-72 w-full">
      <OverallProgressCard mockProgressData={mockProgressData} />
      <AchievementsCard mockProgressData={mockProgressData} />
      <LevelProgressCard mockProgressData={mockProgressData} />
      <StreakCard mockProgressData={mockProgressData} />
      <KeepGoingCard mockProgressData={mockProgressData} />
    </div>
  );
}

import React from "react";
import { Card } from "@/comp/ui/TopCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProgressBar from "@/comp/ui/ProgressBar";

function AchievementsCard({ progressData }) {
  const badges = progressData.achievementBadges ?? [];
  const unlocked = progressData.achievements ?? 0;
  const total = progressData.achievementTotal ?? badges.length;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="rounded-[24px] border border-[#9B7EDE]/30 bg-[#3D3555] p-5">
      <div className="mb-4 flex flex-row items-center justify-between">
        <p className="font-poppins font-semibold text-white">
          {isArabic ? "الإنجازات" : "Achievements"}
        </p>
        <span className="font-blinker text-sm text-white/50">
          {unlocked}/{total}
        </span>
      </div>

      {badges.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => (
            <motion.div
              key={`${badge.icon}-${index}`}
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
                className="flex aspect-square w-full items-center justify-center rounded-2xl text-2xl"
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
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e]">
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
      ) : (
        <p className="font-blinker text-sm text-white/50">
          {isArabic ? "لا توجد إنجازات بعد." : "No achievements available yet."}
        </p>
      )}

      <Link
        to="/dashboard/achievements"
        className="mt-4 block w-full rounded-xl border border-white/10 bg-white/5 py-2 text-center font-blinker text-sm font-semibold text-white/60 transition hover:text-white"
      >
        {isArabic ? "عرض كل الإنجازات" : "View All Achievements"}
      </Link>
    </div>
  );
}

function LevelProgressCard({ progressData }) {
  const { level, xp, xpRequired } = progressData;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const safeRequired = Math.max(Number(xpRequired) || 100, 1);
  const safeXp = Math.min(Math.max(Number(xp) || 0, 0), safeRequired);
  const xpPct = Math.round((safeXp / safeRequired) * 100);
  const xpRemaining = Math.max(0, safeRequired - safeXp);

  return (
    <Card variant="dark" className="p-5">
      <div className="mb-3 flex flex-row items-center justify-between">
        <p className="font-poppins font-semibold text-white">
          {isArabic ? "تقدم المستوى" : "Level Progress"}
        </p>
        <span className="rounded-full bg-[#9067c6]/25 px-2 py-0.5 font-blinker text-xs font-semibold text-[#c4b5fd]">
          {isArabic ? "المستوى" : "Level"} {level}
        </span>
      </div>
      <div className="mb-1 flex flex-row justify-between font-blinker text-xs text-white/50">
        <span>{isArabic ? "تقدم XP" : "XP Progress"}</span>
        <span>
          {safeXp.toLocaleString()} / {safeRequired.toLocaleString()}
        </span>
      </div>
      <ProgressBar value={xpPct} max={100} delay={400} />
      <p className="mt-2 font-blinker text-xs text-white/40">
        {isArabic
          ? `${xpRemaining.toLocaleString()} XP للوصول إلى المستوى ${level + 1}`
          : `${xpRemaining.toLocaleString()} XP needed to reach Level ${
              level + 1
            }`}
      </p>
    </Card>
  );
}

function StreakCard({ progressData }) {
  const { dayStreak, personalBestStreak, streakDays } = progressData;
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="rounded-[24px] border border-[#9B7EDE]/20 bg-[#3D3555] p-5">
      <div className="mb-4 flex flex-row items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f97316] text-lg">
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
              strokeWidth="2.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-poppins font-semibold text-white">
            {dayStreak}{" "}
            {isArabic ? "يوم متتالي" : "Day Streak"}
          </p>
          <p className="flex flex-row gap-3 font-blinker text-xs text-white/50">
            {isArabic ? "أفضل رقم" : "Personal Best"}: {personalBestStreak}{" "}
            {isArabic ? "أيام" : "Days"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {(streakDays ?? []).map((active, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.04 * index,
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="flex aspect-square items-center justify-center rounded-lg text-base"
            style={{
              background: active ? "#f97316" : "rgba(255,255,255,0.07)",
            }}
          >
            {active && (
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
                  strokeWidth="2.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SidePanel({ progressData }) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-6 lg:w-72">
      <AchievementsCard progressData={progressData} />
      <LevelProgressCard progressData={progressData} />
      <StreakCard progressData={progressData} />
    </div>
  );
}

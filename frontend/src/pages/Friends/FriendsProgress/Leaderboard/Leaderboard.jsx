import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrophyIcon, YellowFireIcon } from "@/comp/ui/Icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../../../middleware/api";

const sortOptions = [
  { value: "overallProgress", labelKey: "leaderboard.filters.overallProgress" },
  { value: "studyHours", labelKey: "leaderboard.filters.studyHours" },
  { value: "level", labelKey: "leaderboard.filters.level" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatHours(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return "0h";
  }

  return `${Number(value)}h`;
}

function formatValue(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return null;
  }

  return Number(value);
}

function Leaderboard({ onAddFriends }) {
  const { t } = useTranslation("friends");
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("overallProgress");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["friends-leaderboard", sortBy],
    queryFn: async () => {
      const response = await api.get(`/friends/leaderboard?sortBy=${sortBy}`);
      return response.data;
    },
    retry: false,
    staleTime: 30_000,
  });

  const leaderboard = data?.leaderboard ?? [];

  const rankedLeaderboard = useMemo(
    () =>
      leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
      })),
    [leaderboard],
  );

  const topThree = rankedLeaderboard.slice(0, 3);
  const fullRankings = rankedLeaderboard.slice(3);
  const meEntry = rankedLeaderboard.find((user) => user.isMe);
  const userRank = meEntry?.rank ?? null;
  const totalUsers = rankedLeaderboard.length;
  const leaderboardError =
    error?.response?.data?.message || t("leaderboard.errorMessage");
  const isEmpty = !isLoading && !isError && leaderboard.length === 0;

  const openProfile = (userId, isMe) => {
    if (!userId || isMe) return;
    navigate(`/dashboard/profile/${userId}`);
  };

  const renderAvatar = (user, size = "w-10 h-10", textSize = "text-sm") => {
    const name = user?.fullName || user?.name || "?";
    const initials = getInitials(name);
    const profileImage = user?.profileImage;
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    return profileImage ? (
      <img
        src={`${serverUrl}${profileImage}`}
        alt={name}
        className={`${size} rounded-full object-cover shrink-0`}
      />
    ) : (
      <div
        className={`${size} rounded-full bg-[linear-gradient(180deg,#9B7EDE_0%,#7C5FBD_100%)] flex items-center justify-center text-white font-bold ${textSize} shrink-0`}
      >
        {initials}
      </div>
    );
  };

  const renderStatRow = (label, value, suffix = "") => {
    const formattedValue = formatValue(value);
    if (formattedValue == null) return null;

    return (
      <div className="flex justify-between items-center">
        <span className="text-purple-200/60">{label}</span>
        <span className="text-white font-medium">
          {formattedValue}
          {suffix}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 280, damping: 24 }}
        className="w-full mt-11 rounded-2xl p-5 sm:p-7 border-t border-[#9B7EDE]/30"
        style={{
          background:
            "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-13 h-13 rounded-xl bg-orange-400 flex items-center justify-center shrink-0">
            <TrophyIcon />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl sm:text-2xl leading-tight">
              {t("leaderboard.title")}
            </h2>
            <p className="text-purple-300 text-sm mt-0.5">
              {t("leaderboard.loading")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#9B7EDE]/20 bg-[#3D3555]/45 p-4 min-h-41 animate-pulse"
            >
              <div className="h-10 w-36 rounded-lg bg-white/10 mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-4/5 rounded bg-white/10" />
                <div className="h-4 w-3/5 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-[#3D3555]/50 border border-[#9B7EDE]/20 overflow-hidden">
          <div className="h-12 border-b border-[#9B7EDE]/20 bg-white/5" />
          <div className="divide-y divide-[#9B7EDE]/20">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-18 px-4 sm:px-5 py-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-1/4 rounded bg-white/10" />
                  </div>
                  <div className="h-4 w-16 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 280, damping: 24 }}
        className="w-full mt-11 rounded-2xl p-5 sm:p-7 border-t border-[#9B7EDE]/30"
        style={{
          background:
            "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)",
        }}
      >
        <div className="rounded-2xl border border-red-400/25 bg-[#2A2440]/80 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-300">
            !
          </div>
          <h2 className="text-white font-semibold text-xl">
            {t("leaderboard.errorTitle")}
          </h2>
          <p className="mt-2 text-sm text-purple-200/70">
            {leaderboardError}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-full bg-[#9B7EDE] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b197ef]"
          >
            {t("leaderboard.retry")}
          </button>
        </div>
      </motion.div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 280, damping: 24 }}
        className="w-full mt-11 rounded-2xl p-5 sm:p-7 border-t border-[#9B7EDE]/30"
        style={{
          background:
            "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)",
        }}
      >
        <div className="rounded-2xl border border-[#9B7EDE]/20 bg-[#3D3555]/60 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9B7EDE]/20 text-white">
            <TrophyIcon />
          </div>
          <h2 className="text-white font-semibold text-xl">
            {t("leaderboard.emptyTitle")}
          </h2>
          <p className="mt-2 text-sm text-purple-200/70">
            {t("leaderboard.emptyDescription")}
          </p>
          <button
            type="button"
            onClick={onAddFriends}
            className="mt-5 rounded-full bg-[#9B7EDE] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b197ef]"
          >
            {t("leaderboard.emptyCta")}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 280,
        damping: 24,
      }}
      className="w-full mt-11 rounded-2xl p-5 sm:p-7 border-t border-[#9B7EDE]/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)",
      }}
    >
      <div className="flex items-center gap-3 mb-6 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-xl bg-orange-400 flex items-center justify-center shrink-0">
            <TrophyIcon />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xl sm:text-2xl leading-tight">
              {t("leaderboard.title")}
            </h2>
            <p className="text-purple-300 text-sm mt-0.5">
              {t("leaderboard.subtitle")} {" "}
              <span className="text-white font-semibold">
                {userRank ? `#${userRank}` : "—"}
              </span>{" "}
              {t("leaderboard.outOf")} {totalUsers}
            </p>
          </div>
        </div>

        {isFetching && !isLoading ? (
          <div className="flex items-center gap-2 rounded-full border border-[#9B7EDE]/20 bg-[#3D3555]/50 px-3 py-2 text-xs text-purple-200/70">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            {t("leaderboard.refreshing")}
          </div>
        ) : null}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const active = sortBy === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortBy(option.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                active
                  ? "bg-[#9B7EDE] text-white shadow-[0_8px_24px_rgba(155,126,222,0.35)]"
                  : "bg-[#3D3555]/60 text-purple-200/75 border border-[#9B7EDE]/15 hover:bg-[#52466B]"
              }`}
            >
              {t(option.labelKey)}
            </button>
          );
        })}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5"
      >
        {topThree.map((user) => {
          const displayName = user.fullName || user.name || t("leaderboard.unknownUser");
          const isMe = Boolean(user.isMe);
          const streakValue = formatValue(user.currentStreak);
          const studyHoursValue = formatHours(user.hoursSpent);

          return (
            <motion.button
              key={user._id}
              variants={itemVariants}
              type="button"
              onClick={() => openProfile(user._id, isMe)}
              disabled={isMe}
              className={`rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 text-left ${
                isMe
                  ? "bg-[#9B7EDE]/30 border-2 border-[#9B7EDE] cursor-default"
                  : "bg-[#3D3555]/50 border border-t border-[#9B7EDE]/20 cursor-pointer hover:bg-[#4a4066]"
              }`}
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {renderAvatar(user)}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#3D3555] text-white border-2 border-[#1E1B2E]">
                      {user.rank}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold text-sm leading-tight truncate">
                        {displayName}
                      </p>
                      {isMe ? (
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {t("leaderboard.me")}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-purple-300 text-xs">
                      {t("progress.level")} {formatValue(user.level) ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200/60">
                    {t("leaderboard.studyHours")}
                  </span>
                  <span className="text-white font-medium">{studyHoursValue}</span>
                </div>
                {streakValue != null ? (
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200/60">
                      {t("leaderboard.streak")}
                    </span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <YellowFireIcon />
                      {streakValue} {t("leaderboard.days")}
                    </span>
                  </div>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="rounded-xl bg-[#3D3555]/50 border border-[#9B7EDE]/20 overflow-hidden">
        <h3 className="text-white font-semibold text-base px-4 sm:px-5 py-3 border-b border-[#9B7EDE]/20">
          {t("leaderboard.fullRankings")}
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          {fullRankings.map((user) => {
            const displayName = user.fullName || user.name || t("leaderboard.unknownUser");
            const isMe = Boolean(user.isMe);
            const streakValue = formatValue(user.currentStreak);
            const levelValue = formatValue(user.level);

            return (
              <motion.button
                key={user._id}
                variants={itemVariants}
                type="button"
                onClick={() => openProfile(user._id, isMe)}
                disabled={isMe}
                className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-[#9B7EDE]/20 last:border-b-0 transition-colors duration-150 text-left ${
                  isMe
                    ? "bg-[#9B7EDE]/10 cursor-default"
                    : "cursor-pointer hover:bg-white/3"
                }`}
              >
                <span className="text-purple-300/60 text-sm font-medium w-6 text-center shrink-0">
                  #{user.rank}
                </span>
                <div className="relative shrink-0">
                  {renderAvatar(user, "w-9 h-9", "text-xs")}
                  {isMe ? (
                    <span className="absolute -top-1 -right-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      {t("leaderboard.me")}
                    </span>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {displayName}
                  </p>
                  <p className="text-purple-300/60 text-xs">
                    {t("progress.level")} {levelValue ?? 0}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-semibold text-sm">
                    {formatHours(user.hoursSpent)}
                  </p>
                  {streakValue != null ? (
                    <p className="text-purple-300/60 text-xs flex items-center justify-end gap-1 mt-0.5">
                      <YellowFireIcon />
                      {streakValue} {t("leaderboard.days")}
                    </p>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Leaderboard;
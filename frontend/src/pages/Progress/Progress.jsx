import React, { useMemo } from "react";
import ProgressBanner from "./sections/Progressbanner";
import StatsOverview from "./sections/Statsoverview";
import SubjectProgress from "./sections/Subjectprogress";
import RecentAchievements from "./sections/Recentachievements";
import SidePanel from "./sections/Sidepanel";
import { useQuery } from "@tanstack/react-query";
import api from "../../middleware/api";

const badgeColors = {
  common: "#64748b",
  rare: "#4f46e5",
  epic: "#9333ea",
  legendary: "#d97706",
};

const buildStreakDays = (streak, length = 14) => {
  const activeDays = Math.min(Math.max(Number(streak) || 0, 0), length);
  return Array.from({ length }, (_, index) => index >= length - activeDays);
};

const getSubjectId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id ?? value);
};

const roundOne = (value) => Math.round((Number(value) || 0) * 10) / 10;

function Progress() {
  const todayKey = useMemo(() => new Date().toISOString(), []);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["progress-profile"],
    queryFn: async () => {
      const response = await api.get("/user/get-profile");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: subjectsData, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["progress-subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: scheduleData, isLoading: isScheduleLoading } = useQuery({
    queryKey: ["progress-schedule", todayKey],
    queryFn: async () => {
      const response = await api.get(
        `/sessions/schedule?date=${todayKey}&filter=All`,
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const { data: achievementsData, isLoading: isAchievementsLoading } = useQuery({
    queryKey: ["progress-achievements"],
    queryFn: async () => {
      const response = await api.get("/achievements/all");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const progressData = useMemo(() => {
    const user = profileData?.user ?? {};
    const metrics = profileData?.metrics ?? {};
    const subjects = subjectsData?.subjects ?? [];
    const tasks = scheduleData?.tasks ?? [];
    const achievements = achievementsData?.achievements ?? [];
    const unlockedAchievements = achievements.filter(
      (achievement) => achievement.unlocked,
    );

    const tasksBySubject = tasks.reduce((map, task) => {
      const subjectId = getSubjectId(task.subjectId);
      if (!subjectId) return map;
      const current = map.get(subjectId) ?? { hoursStudied: 0, totalHours: 0 };
      current.hoursStudied += Number(task.hoursSpent) || 0;
      current.totalHours += Number(task.totalHours) || 0;
      map.set(subjectId, current);
      return map;
    }, new Map());

    const subjectProgress = subjects.map((subject) => {
      const totals = tasksBySubject.get(String(subject._id)) ?? {
        hoursStudied: 0,
        totalHours: Number(subject.hoursPerWeek) || 0,
      };
      const totalHours = Number(totals.totalHours) || Number(subject.hoursPerWeek) || 0;
      const hoursStudied = roundOne(totals.hoursStudied);
      const progress =
        totalHours > 0
          ? Math.min(100, Math.round((hoursStudied / totalHours) * 100))
          : 0;

      return {
        name: subject.name,
        hoursStudied,
        totalHours: roundOne(totalHours),
        grade: subject.difficulty
          ? subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)
          : "Subject",
        progress,
      };
    });

    const completedTasks = tasks.filter(
      (task) => String(task.status).toLowerCase() === "completed",
    ).length;
    const level = Number(user.level) || 1;
    const currentXP = Number(user.currentXP) || 0;
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;

    return {
      totalStudyHours: roundOne(metrics.studyHours),
      subjectCount: subjects.length,
      goalsAchieved: completedTasks,
      dayStreak: Number(user.currentStreak ?? metrics.streak) || 0,
      achievements: unlockedAchievements.length,
      level,
      xp: Math.max(0, currentXP - currentLevelXP),
      xpRequired: Math.max(100, nextLevelXP - currentLevelXP),
      personalBestStreak: Number(user.longestStreak) || 0,
      streakDays: buildStreakDays(user.currentStreak),
      subjects: subjectProgress,
      recentAchievements: unlockedAchievements
        .slice()
        .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
        .slice(0, 5),
      achievementBadges: achievements.slice(0, 6).map((achievement) => ({
        icon: achievement.icon || "*",
        color: badgeColors[achievement.badge] ?? "#64748b",
        unlocked: achievement.unlocked,
      })),
      achievementTotal: achievements.length,
    };
  }, [profileData, subjectsData, scheduleData, achievementsData]);

  const isLoading =
    isProfileLoading ||
    isSubjectsLoading ||
    isScheduleLoading ||
    isAchievementsLoading;

  return (
    <div className="text-white pt-10 main-background lg:p-15 p-5 sm:p-8">
      <ProgressBanner />

      {isLoading ? (
        <div className="mt-12 flex min-h-[360px] items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-[#9B7EDE]/30 border-t-[#9B7EDE] animate-spin" />
        </div>
      ) : (
        <>
          <StatsOverview progressData={progressData} />

          <div className="flex flex-col lg:flex-row gap-8 mt-10 items-start">
            <div className="flex-1 flex flex-col gap-8 w-full">
              <SubjectProgress progressData={progressData} />
              <RecentAchievements progressData={progressData} />
            </div>

            <SidePanel progressData={progressData} />
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;

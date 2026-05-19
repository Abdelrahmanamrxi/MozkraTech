/* eslint-disable no-unused-vars */
import React, { useMemo, useCallback } from "react";
import Body from "../../comp/layout/Body";
import WelcomeBanner from "./sections/WelcomeBanner/WelcomeBanner";
import mockUserData from "./Dashboard.constant";
import { motion } from "framer-motion";
import TodaysSummary from "./sections/TodaysSummary/TodaysSummary";
import LearningOverview from "./sections/LearningOverview/LearningOverview";
import { useQuery } from "@tanstack/react-query";
import api from "../../middleware/api";
import { useTranslation } from "react-i18next";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const normalizeDifficultyKey = (value) => {
  const key = String(value || "").toLowerCase();
  if (key === "easy" || key === "medium" || key === "hard") return key;
  return "medium";
};

const toTitleCase = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const formatDuration = (startDate, endDate) => {
  const durationMs = endDate.getTime() - startDate.getTime();
  if (!Number.isFinite(durationMs) || durationMs <= 0) return "0m";
  const totalMinutes = Math.round(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const formatTime = (date, locale) =>
  date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });

const formatDateTime = (date, locale) => {
  const dateLabel = date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${dateLabel} • ${formatTime(date, locale)}`;
};

function Home() {
  const { i18n } = useTranslation(["dashboard"]);
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const todayKey = useMemo(() => new Date().toISOString(), []);

  const { data: scheduleData, isLoading: isScheduleLoading } = useQuery({
    queryKey: ["dashboard-schedule", todayKey],
    queryFn: async () => {
      const response = await api.get(
        `/sessions/schedule?date=${todayKey}&filter=All`,
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  const { data: subjectsData, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: profileData } = useQuery({
    queryKey: ["dashboard-user-profile"],
    queryFn: async () => {
      const response = await api.get("/user/get-profile");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const sessions = scheduleData?.sessions ?? [];
  const subjects = subjectsData?.subjects ?? [];
  const tasks = tasksData?.tasks ?? [];

  const subjectsById = useMemo(() => {
    const map = new Map();
    subjects.forEach((subject) => {
      map.set(String(subject._id), subject);
    });
    return map;
  }, [subjects]);

  const resolveSubject = useCallback(
    (session) => {
      const subjectId = session.subjectId?._id ?? session.subjectId ?? null;
      const subject = subjectId ? subjectsById.get(String(subjectId)) : null;
      const name =
        session.subjectId?.name ||
        subject?.name ||
        session.subjectName ||
        session.name ||
        "Session";
      const difficultyKey = normalizeDifficultyKey(
        session.subjectId?.difficulty || subject?.difficulty,
      );
      return { name, difficultyKey };
    },
    [subjectsById],
  );

  const { todaysSchedule, upComingSchedule } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const buildTodayItem = (session) => {
      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);
      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return null;
      }

      const { name, difficultyKey } = resolveSubject(session);

      return {
        subject: name,
        session: formatDuration(startDate, endDate),
        time: formatTime(startDate, locale),
        difficulty: toTitleCase(difficultyKey),
      };
    };

    const buildUpcomingItem = (session) => {
      const startDate = new Date(session.startTime);
      if (Number.isNaN(startDate.getTime())) return null;

      const { name } = resolveSubject(session);
      const daysLeft = Math.max(
        0,
        Math.ceil((startDate.getTime() - startOfToday.getTime()) / MS_PER_DAY),
      );

      return {
        subject: name,
        date: formatDateTime(startDate, locale),
        daysLeft,
      };
    };

    const allowedStatuses = new Set(["scheduled", "completed"]);

    const todaysSchedule = sessions
      .filter((session) => {
        const status = session.status ?? "scheduled";
        if (!allowedStatuses.has(status)) return false;
        const startDate = new Date(session.startTime);
        return startDate >= startOfToday && startDate < startOfTomorrow;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .map(buildTodayItem)
      .filter(Boolean);

    const upComingSchedule = sessions
      .filter((session) => {
        const status = session.status ?? "scheduled";
        if (!allowedStatuses.has(status)) return false;
        const startDate = new Date(session.startTime);
        return startDate >= startOfTomorrow;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 3)
      .map(buildUpcomingItem)
      .filter(Boolean);

    return { todaysSchedule, upComingSchedule };
  }, [sessions, resolveSubject, locale]);

  const focusMix = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    sessions.forEach((session) => {
      const status = String(session.status ?? "scheduled").toLowerCase();
      if (status !== "scheduled" && status !== "completed") return;
      const subjectId = session.subjectId?._id ?? session.subjectId ?? null;
      const subject = subjectId ? subjectsById.get(String(subjectId)) : null;
      const difficultyKey = normalizeDifficultyKey(
        session.subjectId?.difficulty || subject?.difficulty,
      );
      counts[difficultyKey] += 1;
    });
    const total = counts.easy + counts.medium + counts.hard;
    return { ...counts, total };
  }, [sessions, subjectsById]);

  const { studyTimeToday, upcomingSubject } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const totalMinutes = sessions.reduce((sum, session) => {
      const status = String(session.status ?? "scheduled").toLowerCase();
      if (status !== "scheduled") return sum;
      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);
      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return sum;
      }
      if (startDate < startOfToday || startDate >= startOfTomorrow) return sum;
      const minutes = Math.max(0, (endDate - startDate) / (1000 * 60));
      return sum + minutes;
    }, 0);

    const nextSession = sessions
      .filter(
        (session) =>
          String(session.status ?? "scheduled").toLowerCase() === "scheduled",
      )
      .map((session) => ({
        session,
        startDate: new Date(session.startTime),
      }))
      .filter(
        ({ startDate }) =>
          !Number.isNaN(startDate.getTime()) && startDate > now,
      )
      .sort((a, b) => a.startDate - b.startDate)[0];

    const studyTimeToday = Math.round((totalMinutes / 60) * 10) / 10;

    if (!nextSession) {
      return {
        studyTimeToday,
        upcomingSubject: { subject: "", time: 0 },
      };
    }

    const { name } = resolveSubject(nextSession.session);
    const minutesToStart = Math.max(
      0,
      Math.round((nextSession.startDate - now) / (1000 * 60)),
    );

    return {
      studyTimeToday,
      upcomingSubject: { subject: name, time: minutesToStart },
    };
  }, [sessions, resolveSubject]);

  const dashboardData = useMemo(() => {
    const metrics = profileData?.metrics ?? {};
    const user = profileData?.user ?? {};

    const doneTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    const totalTasks = tasks.length;

    const nextDeadlineTask = tasks
      .filter((task) => task.status !== "completed" && task.dueDate)
      .map((task) => ({
        ...task,
        dueAt: new Date(task.dueDate),
      }))
      .filter((task) => !Number.isNaN(task.dueAt.getTime()))
      .sort((a, b) => a.dueAt - b.dueAt)[0];

    const nextDeadline = nextDeadlineTask
      ? {
          name: nextDeadlineTask.name,
          date: nextDeadlineTask.dueAt,
          hoursLeft: Math.max(
            0,
            Number(nextDeadlineTask.totalHours || 0) -
              Number(nextDeadlineTask.hoursSpent || 0),
          ),
        }
      : null;

    console.log(doneTasks,totalTasks)

    return {
      name: user.fullName || "User",
      streak: metrics.streak ?? user.currentStreak ?? 0,
      achievements: metrics.achievementCount ?? 0,
      studyHours: Number(metrics.studyHours ?? 0),
      studyHoursGoal: Number(user.weeklyGoalHours ?? 0),
      tasks: {
        doneTasks,
        totalTasks,
      },
      nextDeadline,
      studyTimeToday,
      upcomingSubject,
      focusMix,
      aiRecommendation: mockUserData.aiRecommendation,
    };
  }, [
    profileData,
    tasks,
    subjects,
    scheduleData,
    studyTimeToday,
    upcomingSubject,
    focusMix,
  ]);

  return (
    <div className=" text-white main-background lg:p-15 p-5 sm:p-8">
      <WelcomeBanner dashboardData={dashboardData} />
      <TodaysSummary dashboardData={dashboardData} isLoading={isTasksLoading} />
      <LearningOverview
        todaysSchedule={todaysSchedule}
        upComingSchedule={upComingSchedule}
        aiRecommendation={dashboardData.aiRecommendation}
        isScheduleLoading={
          isScheduleLoading || isSubjectsLoading || isTasksLoading
        }
      />
    </div>
  );
}

export default Home;

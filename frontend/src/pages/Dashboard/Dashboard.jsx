/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
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
      const response = await api.get(`/sessions?date=${todayKey}&filter=All`);
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

  const sessions = scheduleData?.sessions ?? [];
  const subjects = subjectsData?.subjects ?? [];

  const subjectsById = useMemo(() => {
    const map = new Map();
    subjects.forEach((subject) => {
      map.set(String(subject._id), subject);
    });
    return map;
  }, [subjects]);

  const { todaysSchedule, upComingSchedule } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const resolveSubject = (session) => {
      const subjectId = session.subjectId?._id ?? session.subjectId ?? null;
      const subject = subjectId ? subjectsById.get(String(subjectId)) : null;
      const name =
        session.subjectId?.name ||
        subject?.name ||
        session.subjectName ||
        session.name ||
        "Session";
      const difficultyKey = normalizeDifficultyKey(
        session.subjectId?.difficulty || subject?.difficulty
      );
      return { name, difficultyKey };
    };

    const buildTodayItem = (session) => {
      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
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
        Math.ceil((startDate.getTime() - startOfToday.getTime()) / MS_PER_DAY)
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
  }, [sessions, subjectsById, locale]);

  return (
   
      <div className=" text-white main-background lg:p-15 p-5 sm:p-8">
        <WelcomeBanner mockUserData={mockUserData} />
        <TodaysSummary mockUserData={mockUserData} />
        <LearningOverview
          todaysSchedule={todaysSchedule}
          upComingSchedule={upComingSchedule}
          aiRecommendation={mockUserData.aiRecommendation}
          isScheduleLoading={isScheduleLoading || isSubjectsLoading}
        />
      </div>
   
  );
}

export default Home;

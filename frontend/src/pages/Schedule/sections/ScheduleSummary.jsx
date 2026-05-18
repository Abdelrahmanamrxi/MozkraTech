/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import {
  FilterIcon,
  ScheduleIcon,
  OpenBookIcon,
  CalenderIcon,
  TipBackgroundIcon,
} from "@/comp/ui/Icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function ScheduleSummary({ metrics, scheduleData, weekStart }) {
  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );

  // Get today's date and count sessions for today
  const today = useMemo(() => {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const sessionsToday = scheduleData?.[dateStr] || [];
    return sessionsToday.length;
  }, [scheduleData]);

  const spentHoursThisWeek = metrics?.spentHoursThisWeek || 0;
  const avgDaily = metrics?.avgDailyHours || 0;
  const subjectsCount = metrics?.uniqueSubjects || 0;
  const upcomingDeadlines = metrics?.todaySessionCount || today;

  // Format hours display
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    const hLabel = numberFormatter.format(h);
    const mLabel = numberFormatter.format(m);
    return m > 0
      ? `${hLabel}${t("time.hourShort")} ${mLabel}${t("time.minuteShort")}`
      : `${hLabel}${t("time.hourShort")}`;
  };
  console.log(metrics);
  return (
    <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-row mt-6 lg:gap-3">
      <div className="flex bg-[#9B7EDE]/20 flex-col items-start border-t border-[#9B7EDE]/30 rounded-[24px] font-Inter lg:w-1/4 p-6">
        <ScheduleIcon />
        <p className="text-sm text-[#B8A7E5] mt-3">{t("summary.thisWeek")}</p>
        <p className="font-bold text-white mt-2 text-2xl">
          {formatHours(spentHoursThisWeek)}
        </p>
        <p className="text-[#B8A7E5]">{t("summary.studyHoursLeft")}</p>
      </div>
      <div className="flex bg-[#7C5FBD]/20 flex-col items-start border-t border-[#7C5FBD]/30 rounded-[24px] font-Inter lg:w-1/4 p-6">
        <svg
          width="25"
          height="25"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0003 29.3333C23.3641 29.3333 29.3337 23.3638 29.3337 16C29.3337 8.6362 23.3641 2.66666 16.0003 2.66666C8.63653 2.66666 2.66699 8.6362 2.66699 16C2.66699 23.3638 8.63653 29.3333 16.0003 29.3333Z"
            stroke="#7C5FBD"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 8V16L21.3333 18.6667"
            stroke="#7C5FBD"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-[#B8A7E5] mt-3">{t("summary.avgDaily")}</p>
        <p className="font-bold text-white mt-2 text-2xl">
          {formatHours(avgDaily)}
        </p>
        <p className="text-[#B8A7E5]">{t("summary.studyTime")}</p>
      </div>

      <div className="flex bg-[#3D3555] flex-col items-start border-t border-[#7C5FBD]/20 rounded-[24px] font-Inter lg:w-1/4 p-6">
        <OpenBookIcon />
        <p className="text-sm text-[#B8A7E5] mt-3">{t("summary.subjects")}</p>
        <p className="font-bold text-white mt-2 text-2xl">{subjectsCount}</p>
        <p className="text-[#B8A7E5]">{t("summary.activeCourses")}</p>
      </div>

      <div className="flex bg-[#3D3555] flex-col items-start border-t border-[#7C5FBD]/20 rounded-[24px] font-Inter lg:w-1/4 p-6">
        <ScheduleIcon />
        <p className="text-sm text-[#B8A7E5] mt-3">{t("summary.upcoming")}</p>
        <p className="font-bold text-white mt-2 text-2xl">
          {upcomingDeadlines}
        </p>
        <p className="text-[#B8A7E5]">{t("summary.deadlines")}</p>
      </div>
    </div>
  );
}

export default ScheduleSummary;

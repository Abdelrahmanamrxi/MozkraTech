/* eslint-disable no-unused-vars */
import React from "react";
import { Card } from "@/comp/ui/TopCard";
import { motion } from "framer-motion";
import { TimerIcon } from "@/comp/ui/Icons";
import {useTranslation} from 'react-i18next'

export default function WeeklyActivity({ mockProgressData }) {
  const { days, totalHoursThisWeek } = mockProgressData.weeklyActivity;
  const maxHours = Math.max(...days.map((d) => d.hours));
  const {i18n}=useTranslation()
  const dayLabelsAr = {
    Mon: "الاثنين",
    Tue: "الثلاثاء",
    Wed: "الأربعاء",
    Thu: "الخميس",
    Fri: "الجمعة",
    Sat: "السبت",
    Sun: "الأحد",
  };
  return (
    <div  className="p-8 bg-[#3D3555] bordr border-[#9B7EDE]/20 rounded-[24px]">
      <div className="flex flex-row items-center justify-between mb-6">
        <p className="font-poppins text-lg font-semibold">
          {i18n.language==="ar"? "النشاط الأسبوعي":"Weekly Activity"}</p>
        <div className="flex flex-row items-center gap-2 text-white/60 font-blinker text-sm">
          <TimerIcon />
          <span className="inline-flex items-center gap-1">
            <span>{totalHoursThisWeek}</span>
            <span>{i18n.language==="ar"?"ساعات هذا الأسبوع":"hours this week"}</span>
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex flex-row items-end justify-between gap-2 h-32 px-1 mb-4">
        {days.map((day, index) => {
          const heightPct = (day.hours / maxHours) * 100;
          return (
            <div
              key={day.day}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "100%" }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{
                    delay: 0.08 * index,
                    duration: 0.7,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="w-full rounded-t-xl rounded-b-md"
                  style={{
                    background:
                      day.day === "Thu"
                        ? "linear-gradient(180deg, #9067c6, #6d28d9)"
                        : "rgba(255,255,255,0.08)",
                    minHeight: "6px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex flex-row justify-between px-1">
        {days.map((day) => (
          <div
            key={day.day}
            className="flex flex-col items-center flex-1 gap-1"
          >
            <p className="font-blinker text-xs text-white/50">
              {i18n.language === "ar" ? dayLabelsAr[day.day] || day.day : day.day}
            </p>
          </div>
        ))}
      </div>

      {/* Task circles row */}
      <div className="flex flex-row justify-between px-1 mt-3">
        {days.map((day, index) => (
          <div
            key={day.day}
            className="flex flex-col items-center flex-1 gap-1"
          >
            <div
              className="w-full h-7 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(144, 103, 198, 0.18)",
                border: "1px solid rgba(144, 103, 198, 0.25)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_96_8491)">
                  <path
                    d="M14.5341 6.66666C14.8385 8.16086 14.6215 9.71427 13.9193 11.0679C13.2171 12.4214 12.072 13.4934 10.6751 14.1049C9.27816 14.7164 7.71382 14.8305 6.24293 14.4282C4.77205 14.026 3.48353 13.1316 2.59225 11.8943C1.70097 10.657 1.26081 9.15148 1.34518 7.62892C1.42954 6.10635 2.03332 4.65872 3.05583 3.52744C4.07835 2.39616 5.45779 1.64961 6.96411 1.4123C8.47043 1.17498 10.0126 1.46123 11.3334 2.22333"
                    stroke="#9B7EDE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 7.33341L8 9.33341L14.6667 2.66675"
                    stroke="#9B7EDE"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_96_8491">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="font-blinker text-xs text-white/40">
              {day.tasks} {i18n.language==="ar"?"المهام":"tasks"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* eslint-disable no-unused-vars */
import React from "react";
import TopCard from "@/comp/ui/TopCard";
import useCountUp from "@/hooks/useCountUp";
import { FireIcon, AchievementIcon, CompletedIcon } from "@/comp/ui/Icons";
import { BookOpenIcon } from "lucide-react";

// Reuse the same TopCard component pattern from TodaysSummary
export default function StatsOverview({ mockProgressData }) {
  const totalHours = useCountUp(mockProgressData.totalStudyHours, 0);
  const goals = useCountUp(mockProgressData.goalsAchieved, 0);
  const streak = useCountUp(mockProgressData.dayStreak, 0);
  const achievements = useCountUp(mockProgressData.achievements, 0);

  return (
    <section className="mt-8">
      <div className="grid font-blinker grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Study Hours */}
        <TopCard
          variant="dark"
          delay={0}
          icon={
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 12H26C26.8841 12 27.7319 11.6489 28.357 11.0237C28.9821 10.3986 29.3333 9.55076 29.3333 8.66671C29.3333 7.78265 28.9821 6.93481 28.357 6.30968C27.7319 5.68456 26.8841 5.33337 26 5.33337H24"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.33301 29.3334H26.6663"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.333 19.5466V22.6666C13.333 23.4 12.7063 23.9733 12.0397 24.28C10.4663 25 9.33301 26.9866 9.33301 29.3333"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.667 19.5466V22.6666C18.667 23.4 19.2937 23.9733 19.9603 24.28C21.5337 25 22.667 26.9866 22.667 29.3333"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 2.66663H8V12C8 14.1217 8.84286 16.1565 10.3431 17.6568C11.8434 19.1571 13.8783 20 16 20C18.1217 20 20.1566 19.1571 21.6569 17.6568C23.1571 16.1565 24 14.1217 24 12V2.66663Z"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          value={totalHours}
          sub="Total Study Hours"
          label="Total Study Hours"
        />

        {/* Goals Achieved */}
        <TopCard
          variant="dark"
          delay={100}
          icon={<CompletedIcon />}
          value={goals}
          sub="Goals Achieved"
          label="Goals Achieved"
        />

        {/* Day Streak */}
        <TopCard
          variant="purple"
          delay={200}
          icon={<FireIcon />}
          value={streak}
          sub="Day Streak"
          label="Day Streak"
        />

        {/* Achievements */}
        <TopCard
          variant="dark"
          delay={300}
          icon={<AchievementIcon />}
          value={achievements}
          sub="Achievements"
          label="Achievements"
        />
      </div>
    </section>
  );
}

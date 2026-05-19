import { AchievementIcon, FireIcon } from "@/comp/ui/Icons";
import { NoteIcon, TimerIcon } from "@/comp/ui/Icons";
import { Card, T } from "@/comp/ui/TopCard";
import useCountUp from "@/hooks/useCountUp";
import Dots from "@/comp/ui/Dots";
import ProgressBar from "@/comp/ui/ProgressBar";
import { useTranslation } from "react-i18next";

export default function TodaysSummary({ dashboardData, isLoading = false }) {
  const { t, i18n } = useTranslation(["dashboard"]);
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const streakValue = dashboardData?.streak ?? 0;
  const achievementsValue = dashboardData?.achievements ?? 0;
  const studyHoursValue = dashboardData?.studyHours ?? 0;
  const studyHoursGoal = dashboardData?.studyHoursGoal ?? 0;
  const tasksDone = dashboardData?.tasks?.doneTasks ?? 0;
  const tasksTotal = dashboardData?.tasks?.totalTasks ?? 0;
  const nextDeadline = dashboardData?.nextDeadline ?? null;
  const studyTimeToday = dashboardData?.studyTimeToday ?? 0;
  const focusMix = dashboardData?.focusMix ?? {
    easy: 0,
    medium: 0,
    hard: 0,
    total: 0,
  };

  const [streak, achievements, hours] = [
    useCountUp(streakValue, 365),
    useCountUp(achievementsValue, 500),
    useCountUp(studyHoursValue, 0),
  ];

  const safeStudyGoal = Math.max(studyHoursGoal, 1);
  const progressValue = Math.min(studyHoursValue, safeStudyGoal);
  const focusTotal = focusMix.total || 0;
  const focusItems = [
    {
      key: "easy",
      label: t("summary.focusMix.easy"),
      value: focusMix.easy,
      color: "#70c1b3",
    },
    {
      key: "medium",
      label: t("summary.focusMix.medium"),
      value: focusMix.medium,
      color: "#f0c36d",
    },
    {
      key: "hard",
      label: t("summary.focusMix.hard"),
      value: focusMix.hard,
      color: "#e07a7a",
    },
  ];

  return (
<section className="mt-15">
  <div className="grid font-blinker grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-10">

    {/* Current Streak */}
    <Card variant="purple" delay={0} className="relative  overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <FireIcon />
          <span className="font-semibold text-sm lg:text-base truncate" style={{ ...T.light }}>
            {t("summary.currentStreak.label")}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto"
          style={{ background: "rgba(255,255,255,0.18)", ...T.light }}
        >
          {t("summary.currentStreak.sub")}
        </span>
      </div>
      <div className="mt-3 text-3xl lg:text-4xl font-semibold" style={{ ...T.light }}>
        {streak}
      </div>
      <div className="text-xs lg:text-sm mt-1 leading-snug" style={{ ...T.muted }}>
        {t("summary.currentStreak.todayStudy", { hours: studyTimeToday })}
      </div>
    </Card>

    {/* Next Deadline */}
    <Card variant="dark" delay={100} className="justify-between relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <NoteIcon />
          <span className="font-semibold text-sm lg:text-base truncate" style={{ ...T.light }}>
            {t("summary.nextDeadline.label")}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto"
          style={{ background: "rgba(255,255,255,0.18)", color: "#f7ece1" }}
        >
          {t("summary.nextDeadline.sub")}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-3">
          <div className="h-8 bg-gray-600 rounded animate-pulse mb-3 w-24"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse w-32"></div>
        </div>
      ) : nextDeadline ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="text-2xl lg:text-4xl font-semibold" style={{ ...T.light }}>
            {t("summary.nextDeadline.hoursLeft", {
              hours: Math.round(nextDeadline.hoursLeft || 0),
            })}
          </div>
          <div className="rounded-2xl px-3 py-2" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="text-sm font-semibold leading-snug" style={{ ...T.light }}>
              {t("summary.nextDeadline.task", { name: nextDeadline.name })}
            </div>
          </div>
          <div className="text-xs lg:text-sm" style={{ ...T.muted }}>
            {t("summary.nextDeadline.due", {
              date: nextDeadline.date.toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              }),
            })}
          </div>
        </div>
      ) : (
        <div className="mt-3 text-sm" style={{ ...T.muted }}>
          {t("summary.nextDeadline.none")}
        </div>
      )}
    </Card>

    {/* Achievements */}
    <Card variant="purple" delay={200} className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <AchievementIcon />
          <span className="font-semibold text-sm lg:text-base truncate" style={{ ...T.light }}>
            {t("summary.achievements.label")}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto"
          style={{ background: "rgba(255,255,255,0.18)", ...T.light }}
        >
          {t("summary.achievements.sub")}
        </span>
      </div>
      <div className="mt-3 text-3xl lg:text-4xl font-semibold" style={{ ...T.light }}>
        {achievements}
      </div>
      <div className="text-xs lg:text-sm mt-1" style={{ ...T.muted }}>
        {t("summary.achievements.total", { count: achievementsValue })}
      </div>
    </Card>

    {/* Study Hours */}
    <Card variant="light" delay={300} className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <TimerIcon />
          <span className="font-semibold text-sm lg:text-base truncate" style={{ ...T.light }}>
            {t("summary.studyHours.label")}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto"
          style={{ background: "rgba(255,255,255,0.2)", ...T.light }}
        >
          {t("summary.studyHours.subLabel")}
        </span>
      </div>
      <div className="mt-3 text-3xl lg:text-4xl font-semibold" style={{ ...T.light }}>
        {hours}
      </div>
      <div className="text-xs lg:text-sm mt-1" style={{ ...T.muted }}>
        {t("summary.studyHours.goal", { hours: studyHoursGoal })}
      </div>
      <ProgressBar value={progressValue} max={safeStudyGoal} delay={600} />
    </Card>

    {/* Tasks */}
    <Card variant="purple" delay={400} className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2">
          <NoteIcon />
          <span className="font-semibold text-sm lg:text-base truncate" style={{ ...T.light }}>
            {t("summary.tasks.label")}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto"
          style={{ background: "rgba(255,255,255,0.2)", ...T.light }}
        >
          {isLoading ? (
            <span className="bg-gray-600 rounded animate-pulse inline-block px-2 py-1 w-20">&nbsp;</span>
          ) : (
            <>{Math.max(tasksTotal - tasksDone, 0)} {t("summary.tasks.remaining")}</>
          )}
        </span>
      </div>
      {isLoading ? (
        <div className="mt-3">
          <div className="h-8 bg-gray-600 rounded animate-pulse mb-3 w-16"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse w-32"></div>
        </div>
      ) : (
        <>
          <div className="mt-3 text-3xl lg:text-4xl font-semibold" style={{ ...T.light }}>
            {tasksDone}/{tasksTotal}
          </div>
          <div className="text-xs lg:text-sm mt-1" style={{ ...T.muted }}>
            {t("summary.tasks.completed", { count: tasksDone })}
          </div>
        </>
      )}
      <Dots done={tasksDone} total={tasksTotal} delay={600} />
    </Card>

    {/* Focus Mix — spans full width on mobile since it's the 6th/last card */}
    <Card
      variant="light"
      delay={500}
      className="relative overflow-hidden "
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <span className="font-semibold text-sm lg:text-base" style={{ ...T.light }}>
          {t("summary.focusMix.label")}
        </span>
        <span
          className="text-xs mt-2 font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)", ...T.light }}
        >
          {t("summary.focusMix.total", { count: focusTotal })}
        </span>
      </div>
      <div className="text-xs lg:text-sm mt-1" style={{ ...T.light }}>
        {t("summary.focusMix.sub")}
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {focusItems.map((item) => {
          const pct = focusTotal ? Math.round((item.value / focusTotal) * 100) : 0;
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-xs w-14 lg:w-16 shrink-0" style={{ ...T.light }}>
                {item.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: item.color }}
                />
              </div>
              <span className="text-xs w-12 text-right shrink-0" style={{ ...T.light }}>
                {pct}% · {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </Card>

  </div>
</section>
  );
}

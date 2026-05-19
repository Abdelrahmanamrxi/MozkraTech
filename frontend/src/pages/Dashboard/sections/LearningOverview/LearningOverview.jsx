/* eslint-disable no-unused-vars */
import GlassySection from "@/comp/ui/GlassySection";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton";
import { StartIcon, CalenderIcon } from "@/comp/ui/Icons";
import { Card } from "@/comp/ui/TopCard";
import { Calendar, Sparkles, Clock3, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

const normalizeDifficultyKey = (value) => {
  const key = String(value || "").toLowerCase();

  if (key === "easy" || key === "medium" || key === "hard") return key;

  return "medium";
};

const difficultyStyles = {
  easy: {
    bg: "bg-emerald-500/10 border border-emerald-400/20",
    text: "text-emerald-300",
  },

  medium: {
    bg: "bg-amber-500/10 border border-amber-400/20",
    text: "text-amber-300",
  },

  hard: {
    bg: "bg-rose-500/10 border border-rose-400/20",
    text: "text-rose-300",
  },
};

const LearningOverview = ({
  todaysSchedule = [],
  upComingSchedule = [],
  aiRecommendation = "",
  isScheduleLoading = false,
}) => {
  const { t } = useTranslation(["dashboard"]);
  const navigate = useNavigate();

  const getDifficultyLabel = (difficulty) => {
    const key = normalizeDifficultyKey(difficulty);

    if (key === "easy")
      return t("learningOverview.todaysSchedule.difficulty.easy");

    if (key === "hard")
      return t("learningOverview.todaysSchedule.difficulty.hard");

    return t("learningOverview.todaysSchedule.difficulty.medium");
  };

  return (
    <div className="mt-10">
      {/* AI SECTION */}
      <Card
        variant="dark"
        className="
          relative
          overflow-hidden
          rounded-[28px]
          p-6 sm:p-8
          glassy-secondary-background
          border border-white/10
          shadow-[0_10px_50px_rgba(0,0,0,0.22)]
        "
      >
        {/* Background Glow */}
        <div className="absolute -top-20 -right-16 w-56 h-56 bg-violet-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
          {/* LEFT */}
          <div className="flex gap-5">
            {/* Icon Box */}
            <div
              className="
                w-20 h-20
                rounded-3xl
                glassy-background
                border border-white/10
                flex items-center justify-center
                shrink-0
              "
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <BrainCircuit className="w-10 h-10 text-violet-300" />
              </motion.div>
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-violet-300" />

                <p className="font-poppins font-semibold text-xl">
                  {t("learningOverview.aiSuggestion.label")}
                </p>
              </div>

              <p className="font-blinker text-[15px] text-white/75 leading-relaxed max-w-2xl">
                {aiRecommendation}
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <LiquidGlassButton
            icon={StartIcon}
            className="
              px-5
              py-2.5
              rounded-2xl
              lg:w-auto
              w-full
              transition-all duration-300
              hover:brightness-110
            "
          >
            {t("learningOverview.aiSuggestion.button")}
          </LiquidGlassButton>
        </div>
      </Card>

      {/* SCHEDULES */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8 items-start">
        {/* TODAY SCHEDULE */}
        <Card
          variant="dark"
          className="
            xl:col-span-3
            rounded-[28px]
            glassy-secondary-background
            border border-white/10
            p-6
            shadow-[0_10px_50px_rgba(0,0,0,0.22)]
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-poppins text-xl font-semibold">
                {t("learningOverview.todaysSchedule.label")}
              </p>

              <p className="text-sm text-white/50 font-blinker mt-1">
                Stay focused and keep your progress consistent
              </p>
            </div>

            <div
              className="
                w-12 h-12
                rounded-2xl
                glassy-background
                border border-white/10
                flex items-center justify-center
              "
            >
              <Clock3 className="text-violet-300" size={22} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col gap-4">
            {isScheduleLoading ? (
              <p className="font-blinker text-sm text-white/70 py-4">
                {t("learningOverview.todaysSchedule.loading")}
              </p>
            ) : todaysSchedule.length === 0 ? (
              <p className="font-blinker text-sm text-white/70 py-4">
                {t("learningOverview.todaysSchedule.empty")}
              </p>
            ) : (
              todaysSchedule.map((subj, index) => {
                const difficultyKey = normalizeDifficultyKey(subj.difficulty);

                return (
                  <div
                    key={`${subj.subject}-${index}`}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      glassy-background
                      border border-white/10
                      px-5
                      py-4
                      transition-all duration-300
                      hover:border-white/20
                      hover:bg-white/[0.06]
                    "
                  >
                    {/* HOVER LIGHT */}
                    <div
                      className="
                        absolute inset-0 opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-500
                        bg-gradient-to-r
                        from-white/[0.04]
                        to-transparent
                        pointer-events-none
                      "
                    />

                    <div className="relative z-10 flex items-center justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        {/* TIME */}
                        <div
                          className="
                            min-w-[82px]
                            h-[60px]
                            rounded-2xl
                            bg-black/10
                            border border-white/10
                            flex items-center justify-center
                            text-sm font-semibold text-white/85
                          "
                        >
                          {subj.time}
                        </div>

                        {/* SUBJECT */}
                        <div>
                          <p className="font-poppins font-medium text-[16px]">
                            {subj.subject}
                          </p>

                          <p className="text-sm text-white/50 mt-1 font-blinker">
                            {subj.session}
                          </p>
                        </div>
                      </div>

                      {/* DIFFICULTY */}
                      <div
                        className={`
                          ${difficultyStyles[difficultyKey].bg}
                          ${difficultyStyles[difficultyKey].text}

                          px-4
                          py-2
                          rounded-full
                          text-sm
                          font-semibold
                          font-blinker
                          transition-all duration-300
                          group-hover:scale-105
                        `}
                      >
                        {getDifficultyLabel(difficultyKey)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* UPCOMING */}
        <Card
          variant="dark"
          className="
    rounded-[28px]
    glassy-secondary-background
    border border-white/10
    p-6
    shadow-[0_10px_50px_rgba(0,0,0,0.22)]
  "
        >
          {/* HEADER */}
          <div className="mb-6">
            <p className="flex items-center gap-3 font-poppins font-semibold text-xl">
              <CalenderIcon />
              {t("learningOverview.upcomingSchedule.label")}
            </p>

            <p className="text-sm text-white/50 mt-1 font-blinker">
              Upcoming exams and deadlines
            </p>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col gap-4">
            {isScheduleLoading ? (
              <p className="font-blinker text-sm text-white/70">
                {t("learningOverview.upcomingSchedule.loading")}
              </p>
            ) : upComingSchedule.length === 0 ? (
              <p className="font-blinker text-sm text-white/70">
                {t("learningOverview.upcomingSchedule.empty")}
              </p>
            ) : (
              upComingSchedule.map((subj, index) => (
                <div
                  key={`${subj.subject}-${index}`}
                  className="
            group
            relative
            overflow-hidden
            rounded-3xl
            glassy-background
            border border-white/10
            p-9
            transition-all duration-300
            hover:border-white/20
            hover:bg-white/[0.06]
          "
                >
                  {/* Hover Glow */}
                  <div
                    className="
              absolute inset-0 opacity-0
              group-hover:opacity-100
              transition-opacity duration-500
              bg-gradient-to-br
              from-white/[0.04]
              to-transparent
              pointer-events-none
            "
                  />

                  {/* DAYS LEFT */}
                  <div
                    className="
              absolute top-2 right-2
              px-3 py-1
              rounded-full
              text-xs
              font-semibold
              bg-blue-500/10
              border border-blue-400/20
              text-blue-200
              font-blinker
              transition-all duration-300
              group-hover:scale-105
            "
                  >
                    {subj.daysLeft}{" "}
                    {t("learningOverview.upcomingSchedule.daysLeft")}
                  </div>

                  <div className="relative z-10">
                    <p className="font-poppins text-lg font-semibold mb-4">
                      {subj.subject}
                    </p>

                    <div className="flex items-center gap-3 text-white/65 text-sm font-blinker">
                      <Calendar size={18} />
                      {subj.date}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* VIEW FULL SCHEDULE BUTTON */}
          <div className="flex justify-center w-full mt-6">
            <Link to="/dashboard/schedule" className="inline-block">
              <LiquidGlassButton
                className="
        group flex flex-row items-center justify-center gap-2
        py-2.5 px-5 text-sm
        md:py-3 md:px-7 md:text-base
        rounded-2xl
        bg-white/5 backdrop-blur-md
        border border-white/10
        text-white/80 font-medium font-blinker
        transition-all duration-300
        hover:bg-white/10 hover:border-white/20 hover:text-white
      "
              >
                <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                  <span>{t("weekly.schedule")}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1 text-white/70 group-hover:text-white flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </LiquidGlassButton>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningOverview;

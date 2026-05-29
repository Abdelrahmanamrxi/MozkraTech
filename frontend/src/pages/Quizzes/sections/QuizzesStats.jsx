import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { useTranslation } from "react-i18next";

const cards = [
  {
    key: "total",
    icon: ListChecks,
    labelKey: "stats.totalQuizzes",
    accent: "#8b5cf6",
    accentMuted: "rgba(139, 92, 246, 0.08)",
    accentBorder: "rgba(139, 92, 246, 0.2)",
    accentGlow: "rgba(139, 92, 246, 0.35)",
    textAccent: "#c4b5fd",
  },
  {
    key: "completed",
    icon: CheckCircle2,
    labelKey: "stats.completed",
    accent: "#10b981",
    accentMuted: "rgba(16, 185, 129, 0.08)",
    accentBorder: "rgba(16, 185, 129, 0.2)",
    accentGlow: "rgba(16, 185, 129, 0.35)",
    textAccent: "#6ee7b7",
  },
  {
    key: "inProgress",
    icon: Clock3,
    labelKey: "stats.inProgress",
    accent: "#f59e0b",
    accentMuted: "rgba(245, 158, 11, 0.08)",
    accentBorder: "rgba(245, 158, 11, 0.2)",
    accentGlow: "rgba(245, 158, 11, 0.35)",
    textAccent: "#fcd34d",
  },
  {
    key: "avgScoreLabel",
    icon: BarChart3,
    labelKey: "stats.averageScore",
    accent: "#0ea5e9",
    accentMuted: "rgba(14, 165, 233, 0.08)",
    accentBorder: "rgba(14, 165, 233, 0.2)",
    accentGlow: "rgba(14, 165, 233, 0.35)",
    textAccent: "#7dd3fc",
  },
];

export default function QuizzesStats({ stats, isLoading }) {
  const { t } = useTranslation("quizzes");

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-8"
    >
      {cards.map(
        (
          {
            key,
            icon: Icon,
            labelKey,
            accent,
            accentMuted,
            accentBorder,
            textAccent,
          },
          i,
        ) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 border will-change-transform"
            style={{
              background: `linear-gradient(135deg, rgb(2,6,23) 0%, ${accentMuted} 100%)`,
              borderColor: accentBorder,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Giant background icon */}
            <div
              className="pointer-events-none absolute -bottom-4 -right-4 select-none"
              style={{ opacity: 0.07 }}
            >
              <Icon
                style={{
                  width: 110,
                  height: 110,
                  color: accent,
                  strokeWidth: 1.2,
                }}
              />
            </div>

            {/* Radial glow behind icon */}
            <div
              className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full blur-3xl"
              style={{ backgroundColor: accent, opacity: 0.15 }}
            />

            {/* Top accent line */}
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                opacity: 0.4,
              }}
            />

            {/* Label */}
            <p
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: textAccent, opacity: 0.75 }}
            >
              {t(labelKey)}
            </p>

            {/* Value */}
            <div className="flex items-end gap-2">
              {isLoading ? (
                <div
                  className="h-9 w-16 animate-pulse rounded-xl"
                  style={{ backgroundColor: accentMuted }}
                />
              ) : (
                <h3
                  className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
                  style={{ color: "#fff" }}
                >
                  {stats[key] ?? "—"}
                </h3>
              )}
            </div>

            {/* Bottom accent bar */}
            <div className="mt-4 h-0.5 w-full rounded-full overflow-hidden bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isLoading ? "0%" : "60%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + 0.08 * i,
                  ease: "easeOut",
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: accent, opacity: 0.6 }}
              />
            </div>
          </motion.div>
        ),
      )}
    </motion.section>
  );
}

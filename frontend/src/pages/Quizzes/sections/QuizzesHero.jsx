import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuizzesHero() {
  const { t } = useTranslation("quizzes");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/10 mb-8 sm:mb-10"
      style={{
        background:
          "linear-gradient(135deg, rgba(2,6,23,0.97) 0%, rgba(15,10,40,0.97) 50%, rgba(2,6,23,0.97) 100%)",
      }}
    >
      {/* ── Ambient mesh blobs ── */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: "var(--color-primary, #7c3aed)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: "#0ea5e9" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "#8b5cf6" }}
      />

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Top border glow ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.6) 30%, rgba(14,165,233,0.6) 70%, transparent 100%)",
        }}
      />

      {/* ── Giant watermark icon ── */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.04] select-none">
        <BrainCircuit
          style={{ width: 280, height: 280, color: "#fff", strokeWidth: 0.8 }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            borderColor: "rgba(139,92,246,0.35)",
            background: "rgba(139,92,246,0.1)",
            color: "#c4b5fd",
          }}
        >
          <Sparkles size={11} className="shrink-0" />
          {t("hero.tag")}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-4 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
        >
          {t("hero.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3"
        >
          {[
            {
              icon: Zap,
              label: "PDF & PPTX",
              color: "#fcd34d",
              bg: "rgba(245,158,11,0.08)",
              border: "rgba(245,158,11,0.2)",
            },
            {
              icon: BrainCircuit,
              label: "AI Generated",
              color: "#c4b5fd",
              bg: "rgba(139,92,246,0.08)",
              border: "rgba(139,92,246,0.2)",
            },
            {
              icon: Sparkles,
              label: "MCQ · True/False · Mixed",
              color: "#7dd3fc",
              bg: "rgba(14,165,233,0.08)",
              border: "rgba(14,165,233,0.2)",
            },
          ].map(({ icon: PillIcon, label, color, bg, border }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-semibold"
              style={{ color, background: bg, borderColor: border }}
            >
              <PillIcon size={11} className="shrink-0" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

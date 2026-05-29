import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, BarChart4, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuizzesScoreModal({
  isOpen,
  score,
  totalQuestions,
  percentage,
  onReview,
  onClose,
}) {
  const { t } = useTranslation("quizzes");

  // Prevent background scrolling while the score modal is mounted
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>

            {/* Glowing Accent Ring Illustration */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Award size={40} className="animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              {t("attempt.completedTitle")}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("attempt.completedDesc")}
            </p>

            {/* Score & Percentage Display Badges */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {t("history.labelScoreShort")}
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  {score} / {totalQuestions}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {t("stats.percentage")}
                </p>
                <p className="mt-2 text-xl font-bold text-primary-light">
                  {percentage}%
                </p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-6">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Action Buttons Footer Layout */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
              >
                {t("attempt.exit")}
              </button>
              <button
                type="button"
                onClick={onReview}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark shadow-lg shadow-primary/20"
              >
                <BarChart4 size={16} />
                {t("history.review")}
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

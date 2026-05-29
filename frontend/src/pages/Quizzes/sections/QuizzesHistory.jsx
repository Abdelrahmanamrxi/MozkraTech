import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Trash2, Eye, Play, Loader2, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";

const statusStyles = {
  completed: "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20",
  in_progress: "bg-amber-500/10 text-amber-200 border border-amber-500/20",
};

const statusLabelKey = {
  completed: "history.statusCompleted",
  in_progress: "history.statusInProgress",
};

function formatDate(dateString, locale) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRemainingTime(quiz) {
  if (quiz.status === "completed") return 0;

  const endTime =
    new Date(quiz.createdAt).getTime() + quiz.durationMinutes * 60 * 1000;

  return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
}

function formatCountdown(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function QuizzesHistory({
  quizzes = [],
  filter,
  onFilterChange,
  isLoading,
  isError,
  errorMessage,
  notice,
  onStart,
  onReview,
  onDelete,
  deletingId,
}) {
  const { t, i18n } = useTranslation("quizzes");

  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="rounded-2xl sm:rounded-[32px] border border-white/10 bg-slate-950 p-4 sm:p-8 shadow-xl shadow-black/10"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("history.sectionTitle")}
          </p>

          <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">
            {t("history.title")}
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none snap-x">
          {[
            { id: "all", label: t("history.filters.all") },
            {
              id: "in_progress",
              label: t("history.filters.inProgress"),
            },
            {
              id: "completed",
              label: t("history.filters.completed"),
            },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onFilterChange(option.id)}
              className={`shrink-0 snap-items rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                filter === option.id
                  ? "bg-primary text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {notice && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-100">
            {notice}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-100">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl sm:rounded-3xl bg-slate-900/70"
              />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 text-center text-slate-300">
            <Bookmark size={28} className="mx-auto text-primary sm:size-8" />

            <p className="mt-4 text-base sm:text-lg font-semibold text-white">
              {t("history.emptyTitle")}
            </p>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {t("history.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {quizzes.map((quiz) => (
                <motion.article
                  key={quiz._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col justify-between min-w-0 w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6 shadow-xl shadow-black/10 gap-5"
                >
                  <div className="min-w-0 w-full">
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between min-w-0 w-full">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 truncate">
                          {quiz.questionType?.replace("_", " ")}
                        </p>

                        <h3 className="mt-1 text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                          {quiz.quizTitle}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                          <span className="shrink-0">
                            {t("history.labelQuestions", {
                              count: quiz.numberOfQuestions,
                            })}
                          </span>

                          <span className="text-slate-600 select-none">•</span>

                          <span className="shrink-0">
                            {t("history.labelDuration", {
                              minutes: quiz.durationMinutes,
                            })}
                          </span>

                          <span className="text-slate-600 select-none">•</span>

                          <span className="capitalize truncate max-w-[80px] sm:max-w-none">
                            {t(`history.difficulty.${quiz.difficultyLevel}`)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`inline-flex shrink-0 self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          statusStyles[quiz.status] ?? statusStyles.in_progress
                        }`}
                      >
                        {t(
                          statusLabelKey[quiz.status] ??
                            statusLabelKey.in_progress,
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl sm:rounded-2xl border border-white/5 bg-white/5 p-3">
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-slate-500 truncate">
                          {quiz.status === "completed"
                            ? t("history.completed")
                            : t("history.lastActivity")}
                        </p>

                        <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-200 truncate">
                          {formatDate(
                            quiz.completedAt ||
                              quiz.updatedAt ||
                              quiz.createdAt,
                            locale,
                          )}
                        </p>
                      </div>

                      <div className="text-end min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-slate-500 truncate">
                          {t("history.labelScoreShort")}
                        </p>

                        <p className="mt-0.5 text-xs sm:text-sm font-semibold text-primary-light truncate">
                          {quiz.score ?? 0}/{quiz.numberOfQuestions} (
                          {quiz.percentage ? `${quiz.percentage}%` : "—"})
                        </p>
                      </div>
                    </div>

                    {quiz.status !== "completed" && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2">
                        <Timer size={14} className="text-amber-300" />

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.12em] text-amber-200/70">
                            Remaining Time
                          </p>

                          <p className="text-sm font-semibold text-amber-200">
                            {formatCountdown(getRemainingTime(quiz))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/5 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => onDelete(quiz._id)}
                      disabled={deletingId === quiz._id}
                      className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-40"
                      title={t("history.delete")}
                    >
                      {deletingId === quiz._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>

                    {quiz.status === "completed" ? (
                      <button
                        type="button"
                        onClick={() => onReview(quiz)}
                        className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        <Eye size={14} />
                        <span>{t("history.review")}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStart(quiz)}
                        className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full bg-primary px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white transition hover:bg-primary-dark"
                      >
                        <Play size={14} />
                        <span>{t("history.start")}</span>
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}

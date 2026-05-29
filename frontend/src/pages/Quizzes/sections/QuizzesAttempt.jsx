import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Timer,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const getButtonLabel = (index, total, isReview, t) => {
  if (isReview) {
    return index >= total - 1
      ? t("attempt.backToHistory")
      : t("attempt.nextButton");
  }
  return index >= total - 1
    ? t("attempt.submitButton")
    : t("attempt.nextButton");
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function QuizzesAttempt({
  quiz,
  mode,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answersByQuestion,
  setAnswersByQuestion,
  onExit,
  onSubmit,
  isSubmitting,
  error,
  timeLeft,
}) {
  const { t } = useTranslation("quizzes");

  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const isReview = mode === "review";

  // Look up user's response from key-value state mapping
  const selectedAnswer =
    currentQuestion && answersByQuestion
      ? answersByQuestion[currentQuestion.questionNumber]
      : undefined;

  const optionButtons = currentQuestion?.options ?? [];

  // Determine correct index dynamically using number tracking or string value comparison fallback
  const correctAnswerIndex = currentQuestion
    ? currentQuestion.correctAnswerIndex !== undefined &&
      currentQuestion.correctAnswerIndex !== null
      ? Number(currentQuestion.correctAnswerIndex)
      : currentQuestion.options.findIndex(
          (opt) => opt === currentQuestion.correctAnswer,
        )
    : null;

  // Review status derivations
  const isSkipped =
    isReview && (selectedAnswer === null || selectedAnswer === undefined);
  const isCorrect =
    isReview && !isSkipped && Number(selectedAnswer) === correctAnswerIndex;
  const isIncorrect =
    isReview && !isSkipped && Number(selectedAnswer) !== correctAnswerIndex;

  console.log("Review Diagnostics:", {
    isReview,
    currentQuestionNumber: currentQuestion?.questionNumber,
    derivedSelectedAnswer: selectedAnswer,
    derivedCorrectIndex: correctAnswerIndex,
    isSkipped,
    isCorrect,
    isIncorrect,
    rawAnswersMap: answersByQuestion,
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 backdrop-blur-xl shadow-xl shadow-black/10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("attempt.sectionTitle")}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            {quiz.quizTitle}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {t("attempt.description", {
              current: currentQuestionIndex + 1,
              total: questions.length,
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isReview && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">
              <Timer size={16} />
              {formatTime(timeLeft)}
            </div>
          )}

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            {t("attempt.exit")}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Question card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-slate-400">
                {t("attempt.questionLabel")}
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">
                {currentQuestion?.questionText ?? t("attempt.noQuestion")}
              </h3>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 whitespace-nowrap">
                {t("attempt.progress", {
                  current: currentQuestionIndex + 1,
                  total: questions.length,
                })}
              </div>

              {/* Review Badges */}
              {isReview && (
                <>
                  {isSkipped && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                      <AlertTriangle size={12} />
                      Skipped
                    </span>
                  )}
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <ShieldCheck size={12} />
                      Correct
                    </span>
                  )}
                  {isIncorrect && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                      <XCircle size={12} />
                      Incorrect
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Options grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {optionButtons.map((option, index) => {
            const isSelected =
              selectedAnswer !== undefined &&
              selectedAnswer !== null &&
              Number(selectedAnswer) === index;

            const isCorrectChoice =
              isReview &&
              correctAnswerIndex !== null &&
              Number(correctAnswerIndex) === index;

            const isWrongChoice =
              isReview &&
              selectedAnswer !== null &&
              selectedAnswer !== undefined &&
              isSelected &&
              !isCorrectChoice;

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                disabled={isReview}
                onClick={() => {
                  if (isReview) return;

                  setAnswersByQuestion((prev) => ({
                    ...prev,
                    [currentQuestion.questionNumber]: index,
                  }));
                }}
                className={`rounded-3xl border p-5 text-left transition duration-200 w-full ${
                  isReview
                    ? isCorrectChoice
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100"
                      : isWrongChoice
                        ? "border-rose-500/50 bg-rose-500/10 text-rose-100"
                        : "border-white/10 bg-white/5 text-slate-400 opacity-60"
                    : isSelected
                      ? "border-primary bg-primary/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{option}</p>

                    {isCorrectChoice && (
                      <p className="mt-2 text-xs text-emerald-200 flex items-center gap-1">
                        <ShieldCheck size={14} className="inline" />
                        {t("attempt.correctAnswer")}
                      </p>
                    )}

                    {isWrongChoice && (
                      <p className="mt-2 text-xs text-rose-200">
                        {t("attempt.selectedWrong")}
                      </p>
                    )}
                  </div>

                  {isSelected && !isReview && (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shrink-0">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Error banner */}
        {error ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {/* Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            {t("attempt.explanationHint")}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              {t("attempt.previousButton")}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!currentQuestion) return;

                if (currentQuestionIndex >= questions.length - 1) {
                  if (isReview) {
                    onExit();
                  } else {
                    onSubmit();
                  }
                  return;
                }

                setCurrentQuestionIndex((prev) =>
                  Math.min(prev + 1, questions.length - 1),
                );
              }}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                t("attempt.submitting")
              ) : (
                <>
                  {getButtonLabel(
                    currentQuestionIndex,
                    questions.length,
                    isReview,
                    t,
                  )}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

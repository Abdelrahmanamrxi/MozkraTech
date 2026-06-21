import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { UploadCloud, FileText, ShieldCheck, ChevronDown } from "lucide-react";

const QUIZ_TYPES = [
  { value: "MCQ", labelKey: "generator.types.mcq" },
  { value: "True_False", labelKey: "generator.types.trueFalse" },
  { value: "Mixed", labelKey: "generator.types.mixed" },
];

const DIFFICULTIES = [
  { value: "easy", labelKey: "history.difficulty.easy" },
  { value: "medium", labelKey: "history.difficulty.medium" },
  { value: "hard", labelKey: "history.difficulty.hard" },
];

export default function QuizzesGenerator({
  form,
  file,
  fileInputKey,
  isGenerating,
  error,
  success,
  onFormChange,
  onFileChange,
  onSubmit,
}) {
  const { t } = useTranslation("quizzes");

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
            {t("generator.sectionTitle")}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {t("generator.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            {t("generator.description")}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="rounded-2xl bg-primary/15 p-2 text-primary">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {t("generator.supportedFiles")}
            </p>
            <p className="text-xs text-slate-400">PDF, PPTX</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left column — controls */}
        <div className="space-y-6">
          {/* File upload */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <label className="label mb-2 block text-sm font-medium text-slate-300">
              {t("generator.uploadLabel")}
            </label>
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-white/20 bg-slate-950/50 p-5 text-sm text-slate-300">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("quiz-file-input")?.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <UploadCloud size={16} />
                  {t("generator.chooseFile")}
                </button>
                <span className="text-sm text-slate-400">
                  {file?.name ?? t("generator.noFileSelected")}
                </span>
              </div>
              <input
                id="quiz-file-input"
                key={fileInputKey}
                type="file"
                accept=".pdf,.pptx"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  onFileChange(selected);
                }}
                className="hidden"
              />
              <p className="text-xs text-slate-500">
                {t("generator.fileHint")}
              </p>
            </div>
          </div>

          {/* Question type + difficulty */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="label text-sm font-medium text-slate-300">
                {t("generator.questionType")}
              </label>
              <div className="relative">
                <select
                  value={form.questionType}
                  onChange={(event) =>
                    onFormChange("questionType", event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                >
                  {QUIZ_TYPES.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-900 text-white"
                    >
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="label text-sm font-medium text-slate-300">
                {t("generator.difficulty")}
              </label>
              <div className="relative">
                <select
                  value={form.difficultyLevel}
                  onChange={(event) =>
                    onFormChange("difficultyLevel", event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                >
                  {DIFFICULTIES.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-900 text-white"
                    >
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Number of questions + duration option */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="label text-sm font-medium text-slate-300">
                {t("generator.numberOfQuestions")}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.numberOfQuestions}
                onChange={(event) =>
                  onFormChange("numberOfQuestions", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                placeholder={t("generator.numberOfQuestionsPlaceholder")}
              />
            </div>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="label text-sm font-medium text-slate-300">
                {t("generator.durationOption")}
              </label>
              <div className="relative">
                <select
                  value={form.timeOption}
                  onChange={(event) =>
                    onFormChange("timeOption", event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                >
                  <option
                    value="ai_defined"
                    className="bg-slate-900 text-white"
                  >
                    {t("generator.aiDefined")}
                  </option>
                  <option
                    value="user_defined"
                    className="bg-slate-900 text-white"
                  >
                    {t("generator.userDefined")}
                  </option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Custom duration — only shown when user_defined */}
          {form.timeOption === "user_defined" && (
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="label text-sm font-medium text-slate-300">
                {t("generator.durationMinutes")}
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                required={form.timeOption === "user_defined"}
                value={form.userDuration}
                onChange={(event) =>
                  onFormChange("userDuration", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                placeholder={t("generator.durationPlaceholder")}
              />
            </div>
          )}

          {/* Feedback + submit */}
          <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            {error && <p className="text-sm text-rose-300">{error}</p>}
            {success && <p className="text-sm text-emerald-300">{success}</p>}
            <button
              type="button"
              disabled={isGenerating}
              onClick={onSubmit}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating
                ? t("generator.generating")
                : t("generator.generateButton")}
            </button>
          </div>
        </div>

        {/* Right column — tips */}
        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-sm text-slate-400">
              {t("generator.quickTipsTitle")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                {t("generator.tipSource")}
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-sky-400" />
                {t("generator.tipQuestions")}
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-violet-400" />
                {t("generator.tipDuration")}
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">
              {t("generator.helpTitle")}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {t("generator.helpDescription")}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

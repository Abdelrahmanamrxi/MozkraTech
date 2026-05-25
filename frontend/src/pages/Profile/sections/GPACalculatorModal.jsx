import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Pencil, Plus, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import LiquidGlassButton from "../../../comp/ui/LiquidGlassButton";

const GRADE_SCALE = [
  { grade: "A", points: 4.0 },
  { grade: "A-", points: 3.7 },
  { grade: "B+", points: 3.3 },
  { grade: "B", points: 3.0 },
  { grade: "B-", points: 2.7 },
  { grade: "C+", points: 2.3 },
  { grade: "C", points: 2.0 },
  { grade: "C-", points: 1.7 },
  { grade: "D+", points: 1.3 },
  { grade: "D", points: 1.0 },
  { grade: "F", points: 0.0 },
];

const DEMO_COURSES = [
  { name: "Data Structures", credits: 3, grade: "A" },
  { name: "Web Development", credits: 3, grade: "B+" },
  { name: "Database Design", credits: 4, grade: "A-" },
  { name: "Algorithm Analysis", credits: 3, grade: "B" },
];

const gradePointsMap = GRADE_SCALE.reduce((acc, item) => {
  acc[item.grade] = item.points;
  return acc;
}, {});

const buildStorageKey = (user) => {
  const identity = user?.email?.trim();
  return identity ? `gpa-courses:${identity}` : "gpa-courses:default";
};

const createId = () =>
  `course-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const normalizeCourse = (course) => ({
  id: course.id || createId(),
  name: typeof course.name === "string" ? course.name : "",
  credits: Number(course.credits) || 0,
  grade: course.grade || "",
});

function GPACalculatorModal({ user, onClose }) {
  const { t } = useTranslation("profile");
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", credits: "", grade: "" });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const hasLoadedRef = useRef(false);
  const firstInputRef = useRef(null);
  const storageKey = useMemo(() => buildStorageKey(user), [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(storageKey);
    let initialCourses = [];

    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        initialCourses = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        initialCourses = [];
      }
    } else {
      initialCourses = DEMO_COURSES;
    }

    setCourses(initialCourses.map(normalizeCourse));
    hasLoadedRef.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasLoadedRef.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(courses));
  }, [courses, storageKey]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const summary = useMemo(() => {
    const totalCourses = courses.length;
    const totalCredits = courses.reduce(
      (sum, course) => sum + (Number(course.credits) || 0),
      0,
    );
    const totalWeighted = courses.reduce((sum, course) => {
      const credits = Number(course.credits) || 0;
      const points = gradePointsMap[course.grade] ?? 0;
      return sum + points * credits;
    }, 0);
    const gpaValue = totalCredits ? totalWeighted / totalCredits : 0;
    const avgCredits = totalCourses ? totalCredits / totalCourses : 0;

    return {
      totalCourses,
      totalCredits,
      gpaValue,
      avgCredits,
    };
  }, [courses]);

  const gpaDisplay = summary.gpaValue.toFixed(2);
  const avgCreditsDisplay = summary.avgCredits.toFixed(2);

  const interpretation = useMemo(() => {
    if (!summary.totalCourses) {
      return {
        label: t("gpaCalculator.interpretation.empty"),
        tone: "text-white/60",
      };
    }

    if (summary.gpaValue >= 3.7) {
      return {
        label: t("gpaCalculator.interpretation.excellent"),
        tone: "text-emerald-300",
      };
    }

    if (summary.gpaValue >= 3.0) {
      return {
        label: t("gpaCalculator.interpretation.good"),
        tone: "text-sky-300",
      };
    }

    if (summary.gpaValue >= 2.0) {
      return {
        label: t("gpaCalculator.interpretation.satisfactory"),
        tone: "text-amber-300",
      };
    }

    return {
      label: t("gpaCalculator.interpretation.needsImprovement"),
      tone: "text-rose-300",
    };
  }, [summary.gpaValue, summary.totalCourses, t]);

  const resetForm = () => {
    setForm({ name: "", credits: "", grade: "" });
    setErrors({});
    setEditingId(null);
  };

  const validateForm = (payload) => {
    const nextErrors = {};

    if (!payload.name.trim()) {
      nextErrors.name = t("gpaCalculator.form.errors.nameRequired");
    }

    const creditsValue = Number(payload.credits);
    if (!creditsValue || creditsValue <= 0) {
      nextErrors.credits = t("gpaCalculator.form.errors.creditsRequired");
    }

    if (!payload.grade) {
      nextErrors.grade = t("gpaCalculator.form.errors.gradeRequired");
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextCourse = {
      id: editingId || createId(),
      name: form.name.trim(),
      credits: Number(form.credits),
      grade: form.grade,
    };

    if (editingId) {
      setCourses((prev) =>
        prev.map((course) => (course.id === editingId ? nextCourse : course)),
      );
    } else {
      setCourses((prev) => [...prev, nextCourse]);
    }

    resetForm();
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setForm({
      name: course.name,
      credits: String(course.credits),
      grade: course.grade,
    });
    setErrors({});
    firstInputRef.current?.focus();
  };

  const handleDelete = (courseId) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
    if (editingId === courseId) {
      resetForm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gpa-modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(event) => event.stopPropagation()}
        className="edit-profile-scroll bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-white/20 rounded-[24px] p-5 sm:p-6 max-w-5xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 id="gpa-modal-title" className="text-2xl font-bold text-white">
              {t("gpaCalculator.title")}
            </h3>
            <p className="text-sm text-[#B8A7E5] mt-1">
              {t("gpaCalculator.subtitle")}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-all self-end"
            aria-label={t("gpaCalculator.actions.close")}
          >
            <X className="w-5 h-5 text-[#B8A7E5]" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {[
            {
              label: t("gpaCalculator.summary.currentGpa"),
              value: gpaDisplay,
            },
            {
              label: t("gpaCalculator.summary.totalCourses"),
              value: summary.totalCourses,
            },
            {
              label: t("gpaCalculator.summary.totalCredits"),
              value: summary.totalCredits,
            },
            {
              label: t("gpaCalculator.summary.averageCredits"),
              value: avgCreditsDisplay,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/15 bg-white/5 p-4"
            >
              <p className="text-xs text-[#B8A7E5] font-medium">{item.label}</p>
              <p className="text-lg font-semibold text-white mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.05fr_1.4fr] gap-6 mt-6">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">
                {editingId
                  ? t("gpaCalculator.form.titleEdit")
                  : t("gpaCalculator.form.titleAdd")}
              </p>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-[#B8A7E5] hover:text-white"
                >
                  {t("gpaCalculator.form.cancelEdit")}
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                  {t("gpaCalculator.form.courseName")}
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
                  placeholder={t("gpaCalculator.form.courseName")}
                />
                {errors.name && (
                  <p className="mt-2 text-xs text-red-300" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                    {t("gpaCalculator.form.credits")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.credits}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        credits: event.target.value,
                      }))
                    }
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
                    placeholder="3"
                  />
                  {errors.credits && (
                    <p className="mt-2 text-xs text-red-300" role="alert">
                      {errors.credits}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">
                    {t("gpaCalculator.form.grade")}
                  </label>
                  <select
                    value={form.grade}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        grade: event.target.value,
                      }))
                    }
                    className="w-full bg-primary-dark/70 backdrop-blur-lg border border-white/20 rounded-[12px] px-3 py-3 text-white focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
                  >
                    <option value="" className="bg-primary-dark text-white">
                      {t("gpaCalculator.form.grade")}
                    </option>
                    {GRADE_SCALE.map((option) => (
                      <option
                        key={option.grade}
                        value={option.grade}
                        className="bg-primary-dark text-white"
                      >
                        {option.grade}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-2 text-xs text-red-300" role="alert">
                      {errors.grade}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <LiquidGlassButton
                  icon={editingId ? Check : Plus}
                  className="px-5 py-2 text-sm"
                >
                  {editingId
                    ? t("gpaCalculator.form.updateButton")
                    : t("gpaCalculator.form.addButton")}
                </LiquidGlassButton>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm rounded-full border border-white/20 text-[#B8A7E5] hover:bg-white/10 transition"
                >
                  {t("gpaCalculator.form.cancelEdit")}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">
                {t("gpaCalculator.list.title")}
              </p>
              <span className="text-xs text-[#B8A7E5]">
                {summary.totalCourses} {t("gpaCalculator.summary.totalCourses")}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {courses.map((course) => {
                  const points = gradePointsMap[course.grade] ?? 0;
                  return (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-white/15 bg-white/8 p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {course.name}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[11px] font-semibold text-white bg-white/15 border border-white/20 rounded-full px-3 py-1">
                              {t("gpaCalculator.form.credits")}:{" "}
                              {course.credits}
                            </span>
                            <span className="text-[11px] font-semibold text-white bg-white/15 border border-white/20 rounded-full px-3 py-1">
                              {t("gpaCalculator.form.grade")}: {course.grade}
                            </span>
                            <span className="text-[11px] font-semibold text-white bg-white/15 border border-white/20 rounded-full px-3 py-1">
                              {t("gpaCalculator.fields.gradePoints")}:{" "}
                              {points.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(course)}
                            className="p-2 rounded-full border border-white/20 text-[#B8A7E5] hover:bg-white/10 transition"
                            aria-label={t("gpaCalculator.actions.edit")}
                          >
                            <Pencil size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(course.id)}
                            className="p-2 rounded-full border border-red-400/30 text-red-200 hover:bg-red-500/20 transition"
                            aria-label={t("gpaCalculator.actions.delete")}
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {!courses.length && (
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-[#B8A7E5]">
                  {t("gpaCalculator.list.empty")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white mb-4">
              {t("gpaCalculator.scale.title")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GRADE_SCALE.map((item) => (
                <div
                  key={item.grade}
                  className="rounded-xl border border-white/15 bg-white/8 p-3 text-center"
                >
                  <p className="text-sm font-semibold text-white">
                    {item.grade}
                  </p>
                  <p className="text-xs text-[#B8A7E5] mt-1">
                    {item.points.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white mb-3">
              {t("gpaCalculator.interpretation.title")}
            </p>
            <p className={`text-lg font-semibold ${interpretation.tone}`}>
              {interpretation.label}
            </p>
            <div className="mt-4 grid gap-2 text-xs text-[#B8A7E5]">
              <p>3.7 - 4.0 • {t("gpaCalculator.interpretation.excellent")}</p>
              <p>3.0 - 3.69 • {t("gpaCalculator.interpretation.good")}</p>
              <p>
                2.0 - 2.99 • {t("gpaCalculator.interpretation.satisfactory")}
              </p>
              <p>
                0.0 - 1.99 •{" "}
                {t("gpaCalculator.interpretation.needsImprovement")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg hover:bg-white/20 transition-all font-medium cursor-pointer"
          >
            {t("gpaCalculator.actions.close")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GPACalculatorModal;

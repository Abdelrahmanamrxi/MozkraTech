/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  X,
  Trash2,
  BookOpen,
  Target,
  Clock,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../middleware/api";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ClockCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0003 29.3333C23.3641 29.3333 29.3337 23.3638 29.3337 16C29.3337 8.6362 23.3641 2.66666 16.0003 2.66666C8.63653 2.66666 2.66699 8.6362 2.66699 16C2.66699 23.3638 8.63653 29.3333 16.0003 29.3333Z"
      stroke="#7C5FBD"
      strokeWidth="2.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 8V16L21.3333 18.6667"
      stroke="#7C5FBD"
      strokeWidth="2.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OpenBookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6.66666C4 6.66666 8 5.33333 16 5.33333C24 5.33333 28 6.66666 28 6.66666V25.3333C28 25.3333 24 24 16 24C8 24 4 25.3333 4 25.3333V6.66666Z"
      stroke="#9B7EDE"
      strokeWidth="2.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 5.33333V24"
      stroke="#9B7EDE"
      strokeWidth="2.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Reusable Dropdown ───────────────────────────────────────────────────────

const FormDropdown = ({ options, value, onChange, placeholder, isRTL }) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        setOpen(true);
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }
    if (e.key === "ArrowDown")
      setHighlighted((prev) => (prev + 1) % options.length);
    else if (e.key === "ArrowUp")
      setHighlighted((prev) => (prev === 0 ? options.length - 1 : prev - 1));
    else if (e.key === "Enter") {
      onChange(options[highlighted].value);
      setOpen(false);
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="relative flex-1"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        onClick={() => setOpen((v) => !v)}
        className={`cursor-pointer w-full bg-white/10 border border-white/20 rounded-[12px] px-3 py-2.5 text-white text-sm flex items-center backdrop-blur-md hover:border-[#9B7EDE]/60 transition-all ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between`}
      >
        <span className={!selected ? "text-white/40" : ""}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-[#9B7EDE] text-[10px]"
        >
          ▼
        </motion.span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute mt-2 w-full bg-[#2F2844] border border-white/10 rounded-[14px] shadow-xl overflow-hidden z-[60]"
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-all ${isRTL ? "flex-row-reverse" : "flex-row"} ${value === option.value ? "bg-[#9B7EDE]/20 text-[#9B7EDE]" : highlighted === index ? "bg-white/10 text-white" : "text-white"}`}
              >
                {option.label}
                {value === option.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B7EDE]" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SubjectCard ──────────────────────────────────────────────────────────────

const SubjectCard = ({ subject, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="flex items-center justify-between bg-[#2F2844]/80 border border-white/10 rounded-[16px] px-4 py-3"
  >
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-[#9B7EDE] flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-white">{subject.name}</p>
        <p className="text-[10px] text-[#B8A7E5] mt-0.5">
          {subject.difficulty} • {subject.hoursPerWeek}h/week •{" "}
          {subject.subjectType}
        </p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRemove}
      className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
    >
      <Trash2 size={14} />
    </motion.button>
  </motion.div>
);

// ─── AddSubjectForm ───────────────────────────────────────────────────────────

const AddSubjectForm = ({ onAdd, onCancel, lang }) => {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [subjectType, setSubjectType] = useState("theoretical");
  const [interestLevel, setInterestLevel] = useState(3);

  const isRTL = lang === "ar";

  const difficultyOptions = [
    { value: "Easy", label: isRTL ? "سهل" : "Easy" },
    { value: "Medium", label: isRTL ? "متوسط" : "Medium" },
    { value: "Hard", label: isRTL ? "صعب" : "Hard" },
  ];

  const typeOptions = [
    { value: "theoretical", label: isRTL ? "نظري" : "Theoretical" },
    { value: "practical", label: isRTL ? "عملي" : "Practical" },
  ];

  const interestOptions = [1, 2, 3, 4, 5].map((level) => ({
    value: level,
    label: isRTL ? `اهتمام ${level}` : `Interest ${level}`,
  }));

  const handleAdd = () => {
    const parsedHours = parseInt(hoursPerWeek, 10);
    if (!name.trim() || !Number.isFinite(parsedHours) || parsedHours < 1)
      return;
    onAdd({
      name: name.trim(),
      difficulty,
      hoursPerWeek: parsedHours,
      subjectType,
      interestLevel: parseInt(interestLevel, 10) || 3,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 bg-[#2F2844]/80 border border-white/10 rounded-[16px] p-4 overflow-visible"
    >
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            isRTL ? "اسم المادة (مثلاً: رياضة)" : "Subject name (e.g. Calculus)"
          }
          className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
        />

        <div className="flex gap-3">
          <FormDropdown
            options={difficultyOptions}
            value={difficulty}
            onChange={setDifficulty}
            isRTL={isRTL}
          />
          <input
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="h/week"
            className="flex-1 bg-white/10 border border-white/20 rounded-[12px] px-3 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#9B7EDE]/60 transition-all [appearance:textfield]"
          />
        </div>

        <div className="flex gap-3">
          <FormDropdown
            options={typeOptions}
            value={subjectType}
            onChange={setSubjectType}
            isRTL={isRTL}
          />
          <FormDropdown
            options={interestOptions}
            value={interestLevel}
            onChange={setInterestLevel}
            isRTL={isRTL}
          />
        </div>

        <div className="flex gap-2 mt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 py-2 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg text-sm font-medium hover:bg-white/20 transition-all cursor-pointer"
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex-1 py-2 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            {isRTL ? "إضافة" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── RegisterData (Main Page) ─────────────────────────────────────────────────

const SubjectRegister = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const navigate = useNavigate();

  const labels = {
    en: {
      pageTitle: "Register Your Data",
      pageSubtitle:
        "Set up your subjects and study preferences to get personalized AI recommendations",
      mySubjects: "My Subjects",
      mySubjectsSubtitle: "Manage your courses and subjects",
      addSubject: "Add Subject",
      studyPreferences: "Study Preferences",
      preferredTime: "Preferred Study Time",
      sessionDuration: "Session Duration (minutes)",
      breakDuration: "Break Duration (minutes)",
      weeklyGoal: "Weekly Study Goal (hours)",
      studyProfile: "Your Study Profile",
      subjects: "Subjects",
      weeklyHours: "Weekly Hours",
      saveButton: "Save & Continue to Dashboard",
      saving: "Saving...",
    },
    ar: {
      pageTitle: "سجّل بياناتك",
      pageSubtitle: "حط موادك وتفضيلات مذاكرتك علشان تاخد توصيات AI شخصية",
      mySubjects: "موادي",
      mySubjectsSubtitle: "تحكم في كورساتك ومواد الدراسة",
      addSubject: "ضيف مادة",
      studyPreferences: "تفضيلات المذاكرة",
      preferredTime: "وقت المذاكرة المفضل",
      sessionDuration: "مدة الجلسة (دقائق)",
      breakDuration: "مدة الراحة (دقائق)",
      weeklyGoal: "هدف المذاكرة الأسبوعي (ساعات)",
      studyProfile: "ملف مذاكرتك",
      subjects: "المواد",
      weeklyHours: "الساعات الأسبوعية",
      saveButton: "احفظ وكمّل للداشبورد",
      saving: "جاري الحفظ...",
    },
  };

  const t = labels[lang];
  const isRTL = lang === "ar";

  // ── State ──
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [breakDuration, setBreakDuration] = useState(15);
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(25);
  const [preferredTime, setPreferredTime] = useState("morning");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const timeOptions = [
    {
      value: "morning",
      label: isRTL ? "الصبح (٦ ص - ١٢ م)" : "Morning (6AM - 12PM)",
    },
    {
      value: "afternoon",
      label: isRTL ? "الظهر (١٢ م - ٦ م)" : "Afternoon (12PM - 6PM)",
    },
    {
      value: "evening",
      label: isRTL ? "المساء (٦ م - ١٢ ص)" : "Evening (6PM - 12AM)",
    },
    {
      value: "night",
      label: isRTL ? "الليل (١٢ ص - ٦ ص)" : "Night (12AM - 6AM)",
    },
  ];

  useEffect(() => {
    let isActive = true;
    const loadSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const { data } = await api.get("/subjects");
        if (isActive)
          setSubjects(Array.isArray(data?.subjects) ? data.subjects : []);
      } catch (err) {
        if (isActive) setSubjectsError("Failed to load subjects.");
      } finally {
        if (isActive) setIsLoadingSubjects(false);
      }
    };
    loadSubjects();
    return () => {
      isActive = false;
    };
  }, []);

  const totalWeeklyHours = subjects.reduce(
    (sum, s) => sum + (s.hoursPerWeek || 0),
    0,
  );

  const handleAddSubject = (subject) => {
    const tempId = `temp-${Date.now()}`;
    setSubjects((prev) => [...prev, { ...subject, tempId }]);
    setShowAddSubject(false);
  };

  const handleRemoveSubject = async (subject) => {
    if (!subject?._id) {
      setSubjects((prev) =>
        prev.filter((item) => item.tempId !== subject.tempId),
      );
      return;
    }
    try {
      await api.delete(`/subjects/${subject._id}`);
      setSubjects((prev) => prev.filter((item) => item._id !== subject._id));
    } catch (err) {
      setSubjectsError("Failed to delete subject.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newSubjects = subjects.filter((s) => !s._id);
      if (newSubjects.length > 0) {
        await Promise.all(newSubjects.map((s) => api.post("/subjects", s)));
      }
      await api.patch("/user/study-preferences", {
        sessionDuration,
        breakDuration,
        preferredTime,
        weeklyGoalHours,
        weeklyStudyHours: totalWeeklyHours,
      });
      navigate("/dashboard");
    } catch (err) {
      setSaveError("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <section className="min-h-screen p-7 lg:p-14 pt-12 lg:pt-16">
        <div
          className={`flex flex-col font-Inter gap-2 mb-8 ${isRTL ? "text-right" : ""}`}
        >
          <p className="text-3xl font-semibold text-white">{t.pageTitle}</p>
          <p className="text-xs text-[#B8A7E5]">{t.pageSubtitle}</p>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-6 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 lg:w-[58%]">
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6">
              <div
                className={`flex justify-between items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className={isRTL ? "text-right" : ""}>
                  <p className="text-lg font-semibold text-white">
                    {t.mySubjects}
                  </p>
                  <p className="text-xs text-[#B8A7E5] mt-0.5">
                    {t.mySubjectsSubtitle}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddSubject((v) => !v)}
                  className="flex items-center gap-1.5 bg-[#9B7EDE] text-white text-sm px-4 py-2 rounded-full font-medium cursor-pointer"
                >
                  <PlusIcon size={16} /> {t.addSubject}
                </motion.button>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {subjects.map((subject, idx) => (
                    <SubjectCard
                      key={subject._id || subject.tempId || idx}
                      subject={subject}
                      onRemove={() => handleRemoveSubject(subject)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {showAddSubject && (
                  <AddSubjectForm
                    onAdd={handleAddSubject}
                    onCancel={() => setShowAddSubject(false)}
                    lang={lang}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5 lg:w-[42%]">
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6">
              <p
                className={`text-lg font-semibold text-white mb-5 ${isRTL ? "text-right" : ""}`}
              >
                {t.studyPreferences}
              </p>
              <div className="flex flex-col gap-4">
                <div className={isRTL ? "text-right" : ""}>
                  <label className="text-xs text-[#B8A7E5] mb-1.5 block font-medium">
                    {t.preferredTime}
                  </label>
                  <FormDropdown
                    options={timeOptions}
                    value={preferredTime}
                    onChange={setPreferredTime}
                    isRTL={isRTL}
                  />
                </div>
                {/* Number Inputs */}
                {[
                  {
                    label: t.sessionDuration,
                    val: sessionDuration,
                    set: setSessionDuration,
                    min: 15,
                  },
                  {
                    label: t.breakDuration,
                    val: breakDuration,
                    set: setBreakDuration,
                    min: 5,
                  },
                  {
                    label: t.weeklyGoal,
                    val: weeklyGoalHours,
                    set: setWeeklyGoalHours,
                    min: 1,
                  },
                ].map((input, i) => (
                  <div key={i} className={isRTL ? "text-right" : ""}>
                    <label className="text-xs text-[#B8A7E5] mb-1.5 block font-medium">
                      {input.label}
                    </label>
                    <input
                      type="number"
                      value={input.val}
                      onChange={(e) =>
                        input.set(parseInt(e.target.value) || input.min)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-[12px] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6">
              <div
                className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <OpenBookIcon />
                <p className="text-sm font-semibold text-white">
                  {t.studyProfile}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-xs text-[#B8A7E5]">{t.subjects}</span>
                  <span className="text-sm font-bold text-white">
                    {subjects.length}
                  </span>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div
                  className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-xs text-[#B8A7E5]">
                    {t.weeklyHours}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {totalWeeklyHours}h
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3.5 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-[16px] font-semibold text-sm transition-all cursor-pointer disabled:opacity-70"
            >
              {isSaving ? t.saving : t.saveButton}
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubjectRegister;

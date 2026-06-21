/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  PlusIcon,
  X,
  ArrowLeft,
  Trash2,
  Pencil,
  BookOpen,
  Target,
  Clock,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../slices/authSlice";
import { getPostAuthRedirectPath } from "../../utils/authRedirect";
import api from "../../middleware/api";

const normalizeDifficultyValue = (value) => {
  const normalized = String(value || "medium").toLowerCase();
  if (["easy", "medium", "hard"].includes(normalized)) return normalized;
  return "medium";
};

const formatSubjectLabel = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

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
        className={`cursor-pointer w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm flex items-center backdrop-blur-md hover:border-[#9B7EDE]/60 transition-all ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between`}
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
            className="absolute mt-2 w-full bg-[#2F2844] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-60"
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

const SubjectCard = ({ subject, onRemove, onEdit, isEdit }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="flex items-center justify-between bg-[#2F2844]/80 border border-white/10 rounded-2xl px-4 py-3"
  >
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-[#9B7EDE] shrink-0" />
      <div>
        <p className="text-sm font-semibold text-white">{subject.name}</p>
        <p className="text-[10px] text-[#B8A7E5] mt-0.5">
          {formatSubjectLabel(subject.difficulty)} • {subject.hoursPerWeek}h/week •{" "}
          {formatSubjectLabel(subject.subjectType)}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {isEdit && onEdit && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="text-[#B59EF7] hover:text-white transition-colors p-1 cursor-pointer"
          type="button"
          aria-label="Edit subject"
        >
          <Pencil size={14} />
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
        type="button"
        aria-label="Delete subject"
      >
        <Trash2 size={14} />
      </motion.button>
    </div>
  </motion.div>
);

// ─── AddSubjectForm ───────────────────────────────────────────────────────────

const AddSubjectForm = ({ onSubmit, onCancel, lang, initialSubject = null, submitLabel = "Add" }) => {
  const [name, setName] = useState(initialSubject?.name || "");
  const [difficulty, setDifficulty] = useState(
    normalizeDifficultyValue(initialSubject?.difficulty),
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(
    initialSubject?.hoursPerWeek ? String(initialSubject.hoursPerWeek) : "",
  );
  const [subjectType, setSubjectType] = useState(
    initialSubject?.subjectType || "theoretical",
  );
  const [interestLevel, setInterestLevel] = useState(
    initialSubject?.interestLevel || 3,
  );

  const isRTL = lang === "ar";

  const difficultyOptions = [
    { value: "easy", label: isRTL ? "سهل" : "Easy" },
    { value: "medium", label: isRTL ? "متوسط" : "Medium" },
    { value: "hard", label: isRTL ? "صعب" : "Hard" },
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
    onSubmit({
      name: name.trim(),
      difficulty,
      hoursPerWeek: parsedHours,
      subjectType,
      interestLevel: parseInt(interestLevel, 10) || 3,
    });
  };

  useEffect(() => {
    setName(initialSubject?.name || "");
    setDifficulty(normalizeDifficultyValue(initialSubject?.difficulty));
    setHoursPerWeek(
      initialSubject?.hoursPerWeek ? String(initialSubject.hoursPerWeek) : "",
    );
    setSubjectType(initialSubject?.subjectType || "theoretical");
    setInterestLevel(initialSubject?.interestLevel || 3);
  }, [initialSubject]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 bg-[#2F2844]/80 border border-white/10 rounded-2xl p-4 overflow-visible"
    >
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            isRTL ? "اسم المادة (مثلاً: رياضة)" : "Subject name (e.g. Calculus)"
          }
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
        />

        <div className="flex flex-col lg:flex-row gap-3">
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
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#9B7EDE]/60 transition-all [appearance:textfield]"
          />
        </div>

        <div className="flex lg:flex-row flex-col gap-3">
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
            className="flex-1 py-2 bg-linear-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            {submitLabel}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── RegisterData (Main Page) ─────────────────────────────────────────────────

const SubjectRegister = ({ isEdit = false }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const labels = {
    en: {
      pageTitle: "Register Your Data",
      pageSubtitle:
        "Set up your subjects and study preferences to get personalized AI recommendations",
      editPageTitle: "Edit Subjects",
      editPageSubtitle: "Update your subjects and study preferences",
      mySubjects: "My Subjects",
      mySubjectsSubtitle: "Manage your courses and subjects",
      addSubject: "Add Subject",
      studyPreferences: "Study Preferences",
      preferredTime: "Preferred Study Time",
      preferredTimeRange: "Preferred Study Time Range",
      weeklyGoalHours: "Weekly Goal Hours",
      from: "From",
      to: "To",
      freeDays: "Days I'm Free",
      freeDaysHint: "Select all days you’re usually available.",
      sessionDuration: "Session Duration (minutes)",
      breakDuration: "Break Duration (minutes)",
      studyProfile: "Your Study Profile",
      subjects: "Subjects",
      weeklyHours: "Weekly Hours",
      saveButton: "Save & Continue to Dashboard",
      saving: "Saving...",
    },
    ar: {
      pageTitle: "سجّل بياناتك",
      pageSubtitle: "حط موادك وتفضيلات مذاكرتك علشان تاخد توصيات AI شخصية",
      editPageTitle: "تعديل المواد",
      editPageSubtitle: "حدّث موادك وتفضيلات مذاكرتك",
      mySubjects: "موادي",
      mySubjectsSubtitle: "تحكم في كورساتك ومواد الدراسة",
      addSubject: "ضيف مادة",
      studyPreferences: "تفضيلات المذاكرة",
      preferredTime: "وقت المذاكرة المفضل",
      weeklyGoalHours: "ساعات الهدف الأسبوعية",
      preferredTimeRange: "نطاق وقت المذاكرة",
      from: "من",
      to: "إلى",
      freeDays: "الأيام اللي أنا فاضي فيها",
      freeDaysHint: "اختار كل الأيام اللي غالباً بتكون متاح فيها.",
      sessionDuration: "مدة الجلسة (دقائق)",
      breakDuration: "مدة الراحة (دقائق)",
      studyProfile: "ملف مذاكرتك",
      subjects: "المواد",
      weeklyHours: "الساعات الأسبوعية",
      saveButton: "احفظ وكمّل للداشبورد",
      saving: "جاري الحفظ...",
    },
  };

  const t = labels[lang];
  const pageTitle = isEdit ? t.editPageTitle : t.pageTitle;
  const pageSubtitle = isEdit ? t.editPageSubtitle : t.pageSubtitle;
  const isRTL = lang === "ar";

  // ── State ─
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [sessionDuration, setSessionDuration] = useState("60");
  const [breakDuration, setBreakDuration] = useState("15");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState("1");
  const [preferredStartTime, setPreferredStartTime] = useState("08:00");
  const [preferredEndTime, setPreferredEndTime] = useState("22:00");
  const [freeDays, setFreeDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editingSubjectKey, setEditingSubjectKey] = useState(null);

  const dayOptions = [
    { value: "Monday", label: isRTL ? "الاثنين" : "Mon" },
    { value: "Tuesday", label: isRTL ? "الثلاثاء" : "Tue" },
    { value: "Wednesday", label: isRTL ? "الأربعاء" : "Wed" },
    { value: "Thursday", label: isRTL ? "الخميس" : "Thu" },
    { value: "Friday", label: isRTL ? "الجمعة" : "Fri" },
    { value: "Saturday", label: isRTL ? "السبت" : "Sat" },
    { value: "Sunday", label: isRTL ? "الأحد" : "Sun" },
  ];

  const timeToMinutes = (timeStr) => {
    if (typeof timeStr !== "string") return 0;
    const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
    if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
    return h * 60 + m;
  };

  const toIntOrFallback = (value, fallback) => {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < fallback) return fallback;
    return parsed;
  };

  // Map a preferred range to the backend enum: morning/afternoon/evening/night.
  const derivePreferredTimeEnum = (start, end) => {
    const startMin = timeToMinutes(start);
    const endMinRaw = timeToMinutes(end);
    const endMin = endMinRaw <= startMin ? endMinRaw + 24 * 60 : endMinRaw;
    const mid = ((startMin + endMin) / 2) % (24 * 60);

    if (mid >= 6 * 60 && mid < 12 * 60) return "morning";
    if (mid >= 12 * 60 && mid < 18 * 60) return "afternoon";
    if (mid >= 18 * 60 && mid < 24 * 60) return "evening";
    return "night";
  };

  const toggleFreeDay = (day) => {
    setFreeDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  };

  useEffect(() => {
    if (!isEdit) {
      setSubjects([]);
      setSubjectsError("");
      setIsLoadingSubjects(false);
      setSessionDuration("60");
      setBreakDuration("15");
      setWeeklyGoalHours("1");
      setPreferredStartTime("08:00");
      setPreferredEndTime("22:00");
      setFreeDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
      return;
    }

    let isActive = true;
    const loadPreferences = async () => {
      setIsLoadingSubjects(true);
      try {
        const { data } = await api.get("/user/get-profile?edit=true");
        if (!isActive || !data) return;

        const profileData = data?.data || {};
        const subjectsFromProfile = profileData?.subjects;

        if (Array.isArray(subjectsFromProfile) && subjectsFromProfile.length > 0) {
          setSubjects(subjectsFromProfile);
        }

        const prefs = profileData?.preferences;

        if (Number.isFinite(prefs?.timer?.sessionDuration))
          setSessionDuration(String(prefs.timer.sessionDuration));
        if (Number.isFinite(prefs?.timer?.breakDuration))
          setBreakDuration(String(prefs.timer.breakDuration));
        if (Number.isFinite(prefs?.weeklyStudyHours))
          setWeeklyGoalHours(String(prefs.weeklyStudyHours));
        else if (Number.isFinite(prefs?.weeklyGoalHours))
          setWeeklyGoalHours(String(prefs.weeklyGoalHours));
        if (prefs?.preferredTimeRange?.start)
          setPreferredStartTime(prefs.preferredTimeRange.start);
        if (prefs?.preferredTimeRange?.end)
          setPreferredEndTime(prefs.preferredTimeRange.end);
        if (Array.isArray(prefs?.freeDays) && prefs.freeDays.length > 0)
          setFreeDays(prefs.freeDays);
      } catch (err) {
        if (isActive) setSubjectsError("Failed to load study preferences.");
      } finally {
        if (isActive) setIsLoadingSubjects(false);
      }
    };

    loadPreferences();
    return () => {
      isActive = false;
    };
  }, [isEdit]);

  const totalWeeklyHours = subjects.reduce(
    (sum, s) => sum + (s.hoursPerWeek || 0),
    0,
  );

  const handleAddSubject = (subject) => {
    const tempId = `temp-${Date.now()}`;
    setSubjects((prev) => [...prev, { ...subject, tempId }]);
    setShowAddSubject(false);
  };

  const handleUpdateSubject = async (subject, updatedSubject) => {
    const subjectKey = subject?._id || subject?.tempId;

    if (!subjectKey) return;

    if (subject?._id) {
      try {
        const { data } = await api.patch(`/subjects/${subject._id}`, updatedSubject);
        if (data?.subject) {
          setSubjects((prev) =>
            prev.map((item) => (item._id === subject._id ? data.subject : item)),
          );
        }
        setEditingSubjectKey(null);
      } catch (err) {
        setSubjectsError("Failed to update subject.");
      }
      return;
    }

    setSubjects((prev) =>
      prev.map((item) =>
        item.tempId === subject.tempId
          ? { ...item, ...updatedSubject, tempId: subject.tempId }
          : item,
      ),
    );
    setEditingSubjectKey(null);
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
      const normalizedSessionDuration = toIntOrFallback(sessionDuration, 15);
      const normalizedBreakDuration = toIntOrFallback(breakDuration, 5);
      const normalizedWeeklyGoalHours = toIntOrFallback(weeklyGoalHours, 1);

      await api.patch("/user/study-preferences", {
        sessionDuration: normalizedSessionDuration,
        breakDuration: normalizedBreakDuration,
        preferredTime: derivePreferredTimeEnum(
          preferredStartTime,
          preferredEndTime,
        ),
        preferredTimeRange: {
          start: preferredStartTime,
          end: preferredEndTime,
        },
        freeDays,
        weeklyStudyHours: normalizedWeeklyGoalHours,
        weeklyGoalHours: normalizedWeeklyGoalHours,
      });
      // Refresh access token so client sees updated isSubjectVerified claim
      try {
        const { data } = await api.post("/auth/refresh-token");
        if (data?.accessToken) {
          dispatch(setAccessToken(data.accessToken));
          const dest = getPostAuthRedirectPath(data.accessToken);
          navigate(dest, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        // fallback navigation
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.log(err);
      setSaveError("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen main-background">
       {isEdit &&<button onClick={()=>{navigate(-1)}} className="text-white  cursor-pointer hover:underline mb-8 absolute top-5 text-sm left-5 flex flex-row gap-3 font-Inter  items-center" to="-1"><ArrowLeft size={15}/> Back </button>}
      <section className="min-h-screen p-7 lg:p-14 pt-12 lg:pt-18">
       
        <div
          className={`flex flex-col font-Inter gap-2 mb-8 ${isRTL ? "text-right" : ""}`}
        >
          <p className="text-3xl font-semibold text-white">{pageTitle}</p>
          <p className="text-xs text-[#B8A7E5]">{pageSubtitle}</p>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-6 ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 lg:w-[58%]">
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-3xl p-6">
              <div
                className={`flex flex-col lg:flex-row gap-5 lg:justify-between lg:items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
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
                  className="flex items-center gap-1.5 bg-[#9B7EDE] self-start text-white text-sm px-4 py-2 rounded-full font-medium cursor-pointer"
                >
                  <PlusIcon size={16} /> {t.addSubject}
                </motion.button>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {subjects.map((subject, idx) => {
                    const subjectKey = subject._id || subject.tempId || idx;
                    const isEditing = isEdit && editingSubjectKey === subjectKey;

                    return (
                      <div key={subjectKey} className="flex flex-col gap-3">
                        {isEditing ? (
                          <AddSubjectForm
                            initialSubject={subject}
                            submitLabel={isRTL ? "حفظ التعديل" : "Save Changes"}
                            onSubmit={(updatedSubject) =>
                              handleUpdateSubject(subject, updatedSubject)
                            }
                            onCancel={() => setEditingSubjectKey(null)}
                            lang={lang}
                          />
                        ) : (
                          <SubjectCard
                            subject={subject}
                            isEdit={isEdit}
                            onEdit={() => setEditingSubjectKey(subjectKey)}
                            onRemove={() => handleRemoveSubject(subject)}
                          />
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {showAddSubject && (
                  <AddSubjectForm
                    onSubmit={handleAddSubject}
                    onCancel={() => setShowAddSubject(false)}
                    lang={lang}
                    submitLabel={isRTL ? "إضافة" : "Add"}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5 lg:w-[42%]">
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-3xl p-6">
              <p
                className={`text-lg font-semibold text-white mb-5 ${isRTL ? "text-right" : ""}`}
              >
                {t.studyPreferences}
              </p>
              <div className="flex flex-col gap-4">
                <div className={isRTL ? "text-right" : ""}>
                  <label className="text-sm text-[#B8A7E5] mb-3 block font-medium">
                    {t.preferredTimeRange}
                  </label>
                  <div
                    className={`flex flex-col sm:flex-row gap-3 ${
                      isRTL ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-[10px] text-[#B8A7E5]/80 mb-1">
                        {t.from}
                      </p>
                      <input
                        type="time"
                        value={preferredStartTime}
                        onChange={(e) => setPreferredStartTime(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-[#B8A7E5]/80 mb-1">
                        {t.to}
                      </p>
                      <input
                        type="time"
                        value={preferredEndTime}
                        onChange={(e) => setPreferredEndTime(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Free Days multi-select */}
                <div className={isRTL ? "text-right" : ""}>
                  <label className="text-sm  text-[#B8A7E5] mb-3 block font-medium">
                    {t.freeDays}
                  </label>
                  <div
                    className={`flex flex-wrap gap-2  ${isRTL ? "justify-end" : ""}`}
                  >
                    {dayOptions.map((d) => {
                      const selected = freeDays.includes(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => toggleFreeDay(d.value)}
                          className={`px-3 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            selected
                              ? "bg-primary-dark border-primary-dark/40 text-white"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#B8A7E5]/70 mt-2 mb-3">
                    {t.freeDaysHint}
                  </p>
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
                    label: t.weeklyGoalHours,
                    val: weeklyGoalHours,
                    set: setWeeklyGoalHours,
                    min: 1,
                  },
                ].map((input, i) => (
                  <div key={i} className={isRTL ? "text-right" : ""}>
                    <label className="text-sm text-[#B8A7E5] mb-1.5 block font-medium">
                      {input.label}
                    </label>
                    <input
                      type="number"
                      value={input.val}
                      onChange={(e) => input.set(e.target.value)}
                      onBlur={() => {
                        const parsed = parseInt(input.val, 10);
                        if (!Number.isFinite(parsed) || parsed < input.min) {
                          input.set(String(input.min));
                        }
                      }}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9B7EDE]/60 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-3xl p-6">
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
              className="w-full py-3.5 bg-linear-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-2xl font-semibold text-sm transition-all cursor-pointer disabled:opacity-70"
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

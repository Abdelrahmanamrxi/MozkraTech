
// ─────────────────────────────────────────────────────────────────────────────
// i18n LABELS
// ─────────────────────────────────────────────────────────────────────────────
export const labelsMap = {
  en: {
    pageTitle:      "My Schedule",
    pageSubtitle:   "Plan and manage your study sessions",
    filterButton:   "Filter",
    editSchedule:   "Edit",
    confirmSchedule:"Confirm",
    addSession:     "Add Task",
    weeklySchedule: "Weekly Schedule",
    noSessions:     "No sessions",
    proTip:         "Pro Tip",
    proTipText:     "Schedule your most challenging subjects during your peak productivity hours. Most students perform best in the morning (8–11 AM) or late afternoon (3–5 PM).",
    all:            "All",
    editSession:    "Edit Session",
    subject:        "Subject",
    time:           "Time",
    duration:       "Duration",
    cancel:         "Cancel",
    confirm:        "Confirm",
    editHint:       "Click Edit to start editing your sessions.",
    overlapError:   "That time slot overlaps another session.",
    today:          "Today",
    sessions:       "sessions",
  },
  ar: {
    pageTitle:      "جدولي",
    pageSubtitle:   "نظم جلسات مذاكرتك وخطط ليها",
    editHint: "اضغط على تعديل علشان تبدأ تعدل جلساتك",
    filterButton:   "فلتر",
    editSchedule:   "تعديل",
    confirmSchedule:"تأكيد",
    addSession:     "ضيف مهمة",
    weeklySchedule: "جدول الأسبوع",
    noSessions:     "مفيش جلسات",
    proTip:         "نصيحة",
    proTipText:     "حاول تحط أصعب المواد في ساعات النشاط بتاعتك.",
    all:            "الكل",
    editSession:    "تعديل الجلسة",
    subject:        "المادة",
    time:           "الوقت",
    duration:       "المدة",
    cancel:         "إلغاء",
    confirm:        "تأكيد",
    overlapError:   "هذا الوقت متداخل مع جلسة تانية.",
    today:          "اليوم",
    sessions:       "جلسات",
  },
};

export const dayLabelsAr = {
  Monday:"الاثنين", Tuesday:"الثلاثاء", Wednesday:"الأربعاء",
  Thursday:"الخميس", Friday:"الجمعة", Saturday:"السبت", Sunday:"الأحد",
};

// Day name order (Mon–Sun, matching ISO week layout)
export const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export const DAY_SHORT    = { Monday:"Mon", Tuesday:"Tue", Wednesday:"Wed", Thursday:"Thu", Friday:"Fri", Saturday:"Sat", Sunday:"Sun" };
export const DAY_SHORT_AR = { Monday:"الاثنين", Tuesday:"الثلاثاء", Wednesday:"الأربعاء", Thursday:"الخميس", Friday:"الجمعة", Saturday:"السبت", Sunday:"الأحد" };

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Midnight-normalised Date for today */
export const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();

/** Earliest navigable week — first Monday of Jan 2026 */
export const MIN_WEEK_START = new Date("2026-01-05");

/** Get the Monday of the ISO week containing `date` */
export function getWeekStart(date) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const dow = d.getDay(); // 0=Sun … 6=Sat
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Latest navigable week — 52 weeks ahead from today's week */
export const MAX_WEEK_START = (() => {
  const d = getWeekStart(TODAY);
  d.setDate(d.getDate() + 52 * 7);
  return d;
})();

/** Return an array of 7 Date objects [Mon…Sun] for the given week start */
export function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Date → "YYYY-MM-DD" string used as the session map key */
export function dateKey(date) {
  const y  = date.getFullYear();
  const m  = String(date.getMonth() + 1).padStart(2,"0");
  const dd = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${dd}`;
}

export const TODAY_KEY = dateKey(TODAY);

export function fmtMonthYear(date, locale = "en-US") {
  return date.toLocaleDateString(locale, { month:"long", year:"numeric" });
}

export function fmtFullDate(date, locale = "en-US") {
  return date.toLocaleDateString(locale, { weekday:"long", month:"long", day:"numeric", year:"numeric" });
}
export const SESSION_COLORS = [
  "bg-[#9B7EDE]",
  "bg-[#7C5FBD]",
  "bg-[#52466B]",
  "bg-[#C084FC]",
  "bg-[#818CF8]",
];

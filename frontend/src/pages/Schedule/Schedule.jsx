/* eslint-disable no-unused-vars */
import Body from "../../comp/layout/Body";
import { FilterIcon, TipBackgroundIcon } from "../../comp/ui/Icons";
import { PlusIcon,Bot } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ScheduleSummary from "./sections/ScheduleSummary";
import { useState } from "react";
import SessionForm from "./sections/SessionForm";
import { useTranslation } from "react-i18next";
import DayColumn from "./DayColumn";
import TimeRuler from "./TimeRuler";
import EditSessionModal from "./EditSessionModal";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton"

// ─────────────────────────────────────────────────────────────────────────────
// GRID CONFIG
// These three constants control the entire time grid layout.
//
//   TIME_START_HOUR  – first hour shown on the ruler (7 = 7 AM)
//   TIME_END_HOUR    – last  hour shown on the ruler (22 = 10 PM)
//   HOUR_HEIGHT_PX   – how tall one hour is in pixels.
//                      A 2-hour session will be exactly 2 × HOUR_HEIGHT_PX tall,
//                      so it spans from its start-line to the line 2 rows below it.
//                      (e.g. 8 AM line → 10 AM line = 3 visible lines, 2 rows apart)
//   SNAP_MINUTES     – drag snaps to this interval (30 = snap to :00 or :30)
// ─────────────────────────────────────────────────────────────────────────────
const TIME_START_HOUR = 8; 
const TIME_END_HOUR   = 24;
const HOUR_HEIGHT_PX  = 80;   // 1 hr = 80 px  →  2 hr card = 160 px (spans 3 lines)
const SNAP_MINUTES    = 30;

const TOTAL_HOURS = TIME_END_HOUR - TIME_START_HOUR;      // 15 hours total
const GRID_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT_PX;         // total column height in px

// One tick every 30 minutes for the grid lines inside each column.
const HALF_TICKS = Array.from(
  { length: TOTAL_HOURS * 2 + 1 },
  (_, i) => TIME_START_HOUR + i * 0.5
);
// Subset: whole-hour ticks used by the left ruler labels.
const HOUR_TICKS = HALF_TICKS.filter((h) => Number.isInteger(h));

// Available colours a session can have (shown in the edit modal colour picker).
const SESSION_COLORS = [
  "bg-[#9B7EDE]",
  "bg-[#7C5FBD]",
  "bg-[#52466B]",
  "bg-[#C084FC]",
  "bg-[#818CF8]",
];

// ─────────────────────────────────────────────────────────────────────────────
// TIME UTILITIES
// Pure functions – no side effects, easy to unit-test.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "9:30 AM" or "1:00 PM"  →  fractional 24-hour number (9.5 or 13.0).
 * Used to convert a session's time string into a number we can do maths on.
 */
function parseTimeToHours(str = "") {
  const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return TIME_START_HOUR;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h + min / 60;
}

/**
 * "2h" | "1.5h" | "90m"  →  float number of hours (2, 1.5, 1.5).
 * Accepts any combination of hours and minutes.
 */
function parseDurationToHours(str = "") {
  const h = str.match(/([\d.]+)h/i);
  const m = str.match(/([\d.]+)m/i);
  return (h ? parseFloat(h[1]) : 0) + (m ? parseFloat(m[1]) / 60 : 0) || 1;
}

/**
 * Fractional 24-hour number  →  top-offset in pixels from the top of the grid.
 * Example: hour 9.5 (9:30 AM) with TIME_START_HOUR=7 and HOUR_HEIGHT_PX=80:
 *   (9.5 - 7) × 80 = 200 px from the top.
 */
function hourToPx(hour) {
  return (hour - TIME_START_HOUR) * HOUR_HEIGHT_PX;
}

/**
 * Raw pixel offset from grid top  →  fractional 24-hour, snapped to SNAP_MINUTES.
 * Used during drag-over to compute the preview line and final drop position.
 */
function pxToSnappedHour(px) {
  const raw     = TIME_START_HOUR + px / HOUR_HEIGHT_PX;
  const step    = SNAP_MINUTES / 60;                         // 0.5 for 30-min snap
  const snapped = Math.round(raw / step) * step;
  // clamp so the card can't start after the last hour minus one step
  return Math.max(TIME_START_HOUR, Math.min(TIME_END_HOUR - step, snapped));
}

/**
 * Fractional 24-hour  →  "8:00 AM" label string (used by the ruler).
 */
function fmtHourLabel(h) {
  const h12  = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${h12}:00 ${ampm}`;
}

/**
 * Fractional 24-hour  →  "8:30 AM" card time string.
 * This is the inverse of parseTimeToHours and is used to write the new time
 * back to the session object after a drag.
 */
function hoursToTimeString(h) {
  const hour24 = Math.floor(h);
  const mins   = Math.round((h - hour24) * 60);
  const ampm   = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${String(mins).padStart(2, "0")} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAP DETECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if placing `candidate` in `sessions` would cause a time overlap
 * with any existing session (excluding the session whose id === excludeId,
 * so a card being moved doesn't collide with its own old position).
 *
 * Two sessions overlap when one starts before the other ends:
 *   aStart < bEnd  &&  aEnd > bStart
 */
function wouldOverlap(sessions, candidate, excludeId = null) {
  const cStart = parseTimeToHours(candidate.time);
  const cEnd   = cStart + parseDurationToHours(candidate.duration);

  return sessions
    .filter((s) => s.id !== excludeId)          // ignore the card being moved
    .some((s) => {
      const sStart = parseTimeToHours(s.time);
      const sEnd   = sStart + parseDurationToHours(s.duration);
      // standard interval-overlap test
      return cStart < sEnd && cEnd > sStart;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────

const initialScheduleData = {
  Monday: [
    { id: "monday-1",    time: "8:00 AM",  subject: "Data Structures",     duration: "2h",   color: "bg-[#9B7EDE]" },
    { id: "monday-2",    time: "11:00 AM", subject: "Web Development",      duration: "1.5h", color: "bg-[#7C5FBD]" },
  ],
  Tuesday: [
    { id: "tuesday-1",   time: "9:00 AM",  subject: "Algorithm Design",     duration: "2h",   color: "bg-[#9B7EDE]" },
    { id: "tuesday-2",   time: "1:00 PM",  subject: "Database Systems",     duration: "2h",   color: "bg-[#7C5FBD]" },
  ],
  Wednesday: [
    { id: "wednesday-1", time: "8:00 AM",  subject: "Computer Networks",    duration: "2h",   color: "bg-[#9B7EDE]" },
    { id: "wednesday-2", time: "12:00 PM", subject: "English Literature",   duration: "1h",   color: "bg-[#7C5FBD]" },
    { id: "wednesday-3", time: "3:00 PM",  subject: "Project Work",         duration: "2h",   color: "bg-[#52466B]" },
  ],
  Thursday: [
    { id: "thursday-1",  time: "10:00 AM", subject: "Software Engineering", duration: "2h",   color: "bg-[#9B7EDE]" },
    { id: "thursday-2",  time: "2:00 PM",  subject: "Mathematics",          duration: "1.5h", color: "bg-[#7C5FBD]" },
  ],
  Friday: [
    { id: "friday-1",    time: "9:00 AM",  subject: "Operating Systems",    duration: "2h",   color: "bg-[#9B7EDE]" },
    { id: "friday-2",    time: "1:00 PM",  subject: "Group Study",          duration: "2h",   color: "bg-[#52466B]" },
  ],
  Saturday: [],
  Sunday: [
    { id: "sunday-1",    time: "11:00 AM", subject: "Self Study",           duration: "2h",   color: "bg-[#52466B]" },
  ],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─────────────────────────────────────────────────────────────────────────────
// i18n LABELS
// Add a new key to both "en" and "ar" whenever you need a new translatable string.
// ─────────────────────────────────────────────────────────────────────────────

const labelsMap = {
  en: {
    pageTitle:      "My Schedule",
    pageSubtitle:   "Plan and manage your study sessions",
    filterButton:   "Filter",
    editSchedule:   "Edit",
    confirmSchedule:"Confirm",
    editHint:       "Click Edit to move sessions.",
    filterHeader:   "Filter by Subject",
    addSession:     "Add Task",
    weeklySchedule: "Weekly Schedule",
    noSessions:     "No sessions scheduled",
    proTip:         "Pro Tip",
    proTipText:     "Schedule your most challenging subjects during your peak productivity hours. Most students perform best in the morning (8–11 AM) or late afternoon (3–5 PM).",
    all:            "All",
    editSession:    "Edit Session",
    subject:        "Subject",
    time:           "Time",
    duration:       "Duration",
    cancel:         "Cancel",
    confirm:        "Confirm",
    overlapError:   "That time slot overlaps another session.",
  },
  ar: {
    pageTitle:      "جدولي",
    pageSubtitle:   "نظم جلسات مذاكرتك وخطط ليها",
    filterButton:   "فلتر",
    editSchedule:   "تعديل",
    confirmSchedule:"تأكيد",
    editHint:       "اضغط تعديل لتحريك الجلسات.",
    filterHeader:   "فلتر بالمادة",
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
  },
};

const dayLabelsAr = {
  Monday:"الاثنين", Tuesday:"الثلاثاء", Wednesday:"الأربعاء",
  Thursday:"الخميس", Friday:"الجمعة", Saturday:"السبت", Sunday:"الأحد",
};

// ─────────────────────────────────────────────────────────────────────────────
// EDIT SESSION MODAL
// Opens when the user clicks the pencil icon on any session card.
// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE  (root component)
// Owns all schedule data state and the two callbacks that mutate it:
//   handleDrop    — drag-and-drop (move / retime a session)
//   handleEdit    — confirm edits from EditSessionModal
// Everything else is passed down as props.
// ─────────────────────────────────────────────────────────────────────────────
const Schedule = () => {
  // The full week of sessions, keyed by day name.
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
   console.log(scheduleData)
  // Which day column is currently highlighted during a drag (or null).
  const [dragOverDay, setDragOverDay] = useState(null);

  // { day, session } of the session being edited, or null when no modal is open.
  const [editingSession, setEditingSession] = useState(null);

  const [showFilterPopup,     setShowFilterPopup]     = useState(false);
  const [showAddSessionPopup, setShowAddSessionPopup] = useState(false);
  const [filterSubject,       setFilterSubject]       = useState("All");
  const [isEditMode,          setIsEditMode]          = useState(false);

  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const t    = labelsMap[lang];

  // ── Drop handler ──────────────────────────────────────────────────────────

  /**
   * Called by DayColumn when a card is dropped.
   *
   * @param {DragEvent}  event
   * @param {string}     toDay        — destination day column
   * @param {number|null} targetIndex — index of the card dropped onto (or null)
   * @param {number}     snappedHour  — cursor Y converted to a snapped 24-h float
   */
  const handleDrop = (event, toDay, targetIndex = null, snappedHour = null) => {
   
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/json");
    if (!raw) return;

    try {
      const { fromDay, sourceIndex } = JSON.parse(raw);

      setScheduleData((prev) => {
        const next       = { ...prev };
        const sourceList = [...next[fromDay]];
        const movedItem  = { ...sourceList[sourceIndex] };

        if (fromDay === toDay) {
          // ── SAME-DAY DRAG: update time, keep everything else ─────────────
          // Resolve the new start time from the cursor Y (snappedHour).
          // If the user dropped on top of another card, use that card's start
          // time as the anchor instead of the raw cursor position.
          let newHour = snappedHour ?? parseTimeToHours(movedItem.time);
          if (targetIndex !== null && targetIndex !== sourceIndex) {
            newHour = parseTimeToHours(next[toDay][targetIndex].time);
          }

          const updated = { ...movedItem, time: hoursToTimeString(newHour) };

          // ── Overlap guard ──
          // Don't commit the move if it would collide with another session.
          if (wouldOverlap(next[fromDay], updated, movedItem.id)) return prev;

          const list = [...next[fromDay]];
          list[sourceIndex] = updated;
          next[fromDay] = list;

        } else {
          // ── CROSS-DAY DRAG: move card to a different day ─────────────────
          sourceList.splice(sourceIndex, 1);
          const destList = [...next[toDay]];

          const updated = snappedHour
            ? { ...movedItem, time: hoursToTimeString(snappedHour) }
            : movedItem;

          if (targetIndex !== null) {
            // Swap the dragged card with the card it was dropped on.
            const [targetItem] = destList.splice(targetIndex, 1, updated);
            sourceList.splice(sourceIndex, 0, targetItem);
          } else {
            // ── Overlap guard ──
            if (wouldOverlap(destList, updated)) return prev;
            destList.push(updated);
          }

          next[fromDay] = sourceList;
          next[toDay]   = destList;
        }

        return next;
      });
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  // ── Edit handler ──────────────────────────────────────────────────────────

  /**
   * Called when the user confirms an edit in EditSessionModal.
   * Replaces the old session object with the updated one in-place.
   */
  const handleEdit = (updatedSession) => {
    const { day } = editingSession;
    setScheduleData((prev) => ({
      ...prev,
      [day]: prev[day].map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
    }));
    setEditingSession(null);
  };
  
  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="min-h-screen p-7 lg:p-14 pt-12 lg:pt-20">

      {/* ── Page header ── */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col font-Inter gap-2">
          <p className="text-3xl font-semibold text-white">{t.pageTitle}</p>
          <p className="text-xs text-[#B8A7E5]">{t.pageSubtitle}</p>

          <div className="flex flex-row gap-3 items-center mt-3">
            {/* Edit / Confirm */}
            <motion.button
              onClick={() => {
                if (isEditMode) {
                  setEditingSession(null);
                  setDragOverDay(null);
                }
                setIsEditMode((prev) => !prev);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full cursor-pointer gap-2 font-Inter text-sm items-center px-6 py-2 h-10 transition-colors border border-white/10 ${
                isEditMode ? "bg-[#7C5FBD] text-white" : "bg-[#3D3555] text-white"
              }`}
            >
              {isEditMode ? t.confirmSchedule : t.editSchedule}
            </motion.button>

            <LiquidGlassButton
              className="text-white gap-2 text-center px-4 py-2 h-10 flex items-center justify-center"
              icon={Bot}
            >
              Generate Schedule
            </LiquidGlassButton>
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-4 text-white relative">
          {/* Filter */}
          <motion.button
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3D3555] border-t border-[#9B7EDE]/20 rounded-full flex gap-2 font-Inter text-sm items-center px-4 py-2"
          >
            <FilterIcon /> {t.filterButton}
          </motion.button>


          <AnimatePresence>
            {showFilterPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 bg-[#2F2844] border border-white/10 rounded-[16px] p-4 w-48 z-50 shadow-2xl"
              >
                <div className="space-y-1">
                  {["All", "Data Structures", "Web Development", "Mathematics", "Algorithm Design"].map(
                    (subject) => (
                      <button
                        key={subject}
                        onClick={() => { setFilterSubject(subject); setShowFilterPopup(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          filterSubject === subject
                            ? "bg-[#9B7EDE] text-white"
                            : "text-[#B8A7E5] hover:bg-white/5"
                        }`}
                      >
                        {subject === "All" ? t.all : subject}
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add session */}
          <motion.button
            onClick={() => setShowAddSessionPopup(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#9B7EDE] flex gap-2 items-center px-4 py-2 rounded-full text-sm"
          >
            <PlusIcon size={18} /> {t.addSession}
          </motion.button>
        </div>
      </div>

      {/* ── Add session modal (original SessionForm, unchanged) ── */}
      <AnimatePresence>
        {showAddSessionPopup && (
          <SessionForm setShowAddSessionPopup={setShowAddSessionPopup} />
        )}
      </AnimatePresence>

      {/* ── Edit session modal ── */}
      <AnimatePresence>
        {editingSession && (
          <EditSessionModal
            session={editingSession.session}
            // Pass ALL sessions in that day (not just filtered) so the overlap
            // check works correctly regardless of the active filter.
            daysessions={scheduleData[editingSession.day]}
            onConfirm={handleEdit}
            onCancel={() => setEditingSession(null)}
            t={t}
            sessionColors={SESSION_COLORS}
            wouldOverlap={wouldOverlap}
          />
        )}
      </AnimatePresence>

      <ScheduleSummary />

      {/* ── Weekly grid ── */}
      <div className="bg-[#3D3555]/60 p-6 lg:p-8 w-full rounded-[24px] text-white font-Inter border-t border-[#9B7EDE]/20 mt-12 overflow-x-auto">
        <p className="text-2xl font-semibold mb-8">{t.weeklySchedule}</p>

        <div className="flex gap-2 min-w-[1000px] lg:min-w-0">
          {/* Time ruler — fixed width on the left */}
          <TimeRuler
            HOUR_TICKS={HOUR_TICKS}
            GRID_HEIGHT={GRID_HEIGHT}
            hourToPx={hourToPx}
            fmtHourLabel={fmtHourLabel}
          />

          <LayoutGroup>
            <div className="grid grid-cols-7 gap-3 flex-1">
              {days.map((day) => {
                // Apply subject filter for display only.
                // We still pass allSessions for overlap checking.
                const daySessions = scheduleData[day].filter(
                  (s) => filterSubject === "All" || s.subject === filterSubject
                );

                return (
                  <DayColumn
                    key={day}
                    day={day}
                    lang={lang}
                    t={t}
                    sessions={daySessions}
                    isEditMode={isEditMode}
                    dragOverDay={dragOverDay}
                    setDragOverDay={setDragOverDay}
                    onDrop={handleDrop}
                    onEditSession={(day, session) => setEditingSession({ day, session })}
                    dayLabelsAr={dayLabelsAr}
                    parseTimeToHours={parseTimeToHours}
                    parseDurationToHours={parseDurationToHours}
                    hourToPx={hourToPx}
                    pxToSnappedHour={pxToSnappedHour}
                    GRID_HEIGHT={GRID_HEIGHT}
                    HALF_TICKS={HALF_TICKS}
                    HOUR_HEIGHT_PX={HOUR_HEIGHT_PX}
                  />
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* ── Pro Tip ── */}
      <div className="border-t flex flex-col lg:flex-row font-Inter text-white items-center gap-4 rounded-[24px] p-6 border-[#9B7EDE]/30 mt-8 mb-16 bg-gradient-to-br from-[#9B7EDE]/10 to-transparent">
        <TipBackgroundIcon />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">{t.proTip}</p>
          <p className="text-xs leading-relaxed text-[#B8A7E5]">{t.proTipText}</p>
        </div>
      </div>

    </section>
  );
};

export default Schedule;
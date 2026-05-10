/* eslint-disable no-unused-vars */
import { FilterIcon, TipBackgroundIcon } from "../../comp/ui/Icons";
import { PlusIcon, Bot, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ScheduleSummary from "./sections/ScheduleSummary";
import { useState, useMemo, useCallback } from "react";
import SessionForm from "./sections/SessionForm/SessionForm";
import { useTranslation } from "react-i18next";
import DayColumn from "./DayColumn";
import TimeRuler from "./TimeRuler";
import EditSessionModal from "./EditSessionModal";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton";
import { dayLabelsAr,labelsMap,DAY_NAMES,DAY_SHORT,DAY_SHORT_AR
  ,TODAY,MIN_WEEK_START,getWeekStart,MAX_WEEK_START,getWeekDates,
  dateKey,TODAY_KEY,fmtFullDate,fmtMonthYear,SESSION_COLORS
 } from "./utils/utility";

import { TIME_START_HOUR,TIME_END_HOUR,parseTimeToHours,parseDurationToHours
  ,hoursToTimeString,HOUR_TICKS,HALF_TICKS,GRID_HEIGHT,pxToSnappedHour,hourToPx,HOUR_HEIGHT_PX
  ,fmtHourLabel
 } from "./utils/timeUtility";

// 
// ─────────────────────────────────────────────────────────────────────────────
// OVERLAP DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function wouldOverlap(sessions, candidate, excludeId = null) {
  const cStart = parseTimeToHours(candidate.time);
  const cEnd   = cStart + parseDurationToHours(candidate.duration);
  return sessions
    .filter((s) => s.id !== excludeId)
    .some((s) => {
      const sStart = parseTimeToHours(s.time);
      const sEnd   = sStart + parseDurationToHours(s.duration);
      return cStart < sEnd && cEnd > sStart;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — places sample sessions on the current week's actual dates
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialData() {
  const ws = getWeekStart(TODAY);
  const perDay = {
    Monday:    [
      { id:"monday-1",    time:"8:00 AM",  subject:"Data Structures",     duration:"2h",   color:"bg-[#9B7EDE]" },
      { id:"monday-2",    time:"11:00 AM", subject:"Web Development",      duration:"1.5h", color:"bg-[#7C5FBD]" },
    ],
    Tuesday:   [
      { id:"tuesday-1",   time:"9:00 AM",  subject:"Algorithm Design",     duration:"2h",   color:"bg-[#9B7EDE]" },
      { id:"tuesday-2",   time:"1:00 PM",  subject:"Database Systems",     duration:"2h",   color:"bg-[#7C5FBD]" },
    ],
    Wednesday: [
      { id:"wednesday-1", time:"8:00 AM",  subject:"Computer Networks",    duration:"2h",   color:"bg-[#9B7EDE]" },
      { id:"wednesday-2", time:"12:00 PM", subject:"English Literature",   duration:"1h",   color:"bg-[#7C5FBD]" },
      { id:"wednesday-3", time:"3:00 PM",  subject:"Project Work",         duration:"2h",   color:"bg-[#52466B]" },
    ],
    Thursday:  [
      { id:"thursday-1",  time:"10:00 AM", subject:"Software Engineering", duration:"2h",   color:"bg-[#9B7EDE]" },
      { id:"thursday-2",  time:"2:00 PM",  subject:"Mathematics",          duration:"1.5h", color:"bg-[#7C5FBD]" },
    ],
    Friday:    [
      { id:"friday-1",    time:"9:00 AM",  subject:"Operating Systems",    duration:"2h",   color:"bg-[#9B7EDE]" },
      { id:"friday-2",    time:"1:00 PM",  subject:"Group Study",          duration:"2h",   color:"bg-[#52466B]" },
    ],
    Saturday:  [],
    Sunday:    [
      { id:"sunday-1",    time:"11:00 AM", subject:"Self Study",           duration:"2h",   color:"bg-[#52466B]" },
    ],
  };
  const out = {};
  DAY_NAMES.forEach((name, i) => {
    const d = new Date(ws);
    d.setDate(d.getDate() + i);
    out[dateKey(d)] = perDay[name] || [];
  });
  return out;
}


// ─────────────────────────────────────────────────────────────────────────────
// TODAY BANNER  — always anchored to real today, shown above the grid
// ─────────────────────────────────────────────────────────────────────────────
const TodayBanner = ({ sessionCount, t, lang, isCurrentWeek }) => {
  const locale  = lang === "ar" ? "ar-EG" : "en-US";
  const dateStr = fmtFullDate(TODAY, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex justify-center  mb-5"
    >
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#9B7EDE]/12 border border-[#9B7EDE]/25 backdrop-blur-sm flex-wrap justify-center">
        {/* Live pulse */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9B7EDE] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C084FC]" />
        </span>

        <span className="text-[#C084FC] text-[10px] font-extrabold uppercase tracking-widest">
          {t.today}
        </span>

        <span className="w-px h-3 bg-white/20 flex-shrink-0 hidden sm:block" />

        <span className="text-white/80 text-xs font-medium">{dateStr}</span>

        {isCurrentWeek && sessionCount > 0 && (
          <>
            <span className="w-px h-3 bg-white/20 flex-shrink-0 hidden sm:block" />
            <span className="text-[#B8A7E5] text-[11px]">{sessionCount} {t.sessions}</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WEEK NAVIGATION BAR  — prev / next week arrows + month label + "Today" jump
// ─────────────────────────────────────────────────────────────────────────────
const WeekNav = ({ weekStart, onPrev, onNext, onToday, canPrev, canNext, isCurrentWeek, t, lang }) => {
  const locale    = lang === "ar" ? "ar-EG" : "en-US";
  const weekDates = getWeekDates(weekStart);

  // Label: "May 2026" or "Apr – May 2026" when week spans two months
  const startLabel = weekDates[0].toLocaleDateString(locale, { month:"short", day:"numeric" });
  const endLabel   = weekDates[6].toLocaleDateString(locale, { month:"short", day:"numeric", year:"numeric" });
  const label      = `${startLabel} – ${endLabel}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Prev week */}
      <motion.button
        onClick={onPrev}
        disabled={!canPrev}
        whileHover={canPrev ? { scale: 1.1 } : {}}
        whileTap={canPrev ? { scale: 0.9 } : {}}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-150 flex-shrink-0 ${
          canPrev
            ? "border-[#9B7EDE]/35 bg-[#3D3555]/60 text-[#B8A7E5] hover:bg-[#9B7EDE]/20 hover:text-white hover:border-[#9B7EDE]/55 cursor-pointer"
            : "border-white/6 text-white/12 cursor-not-allowed"
        }`}
      >
        <ChevronLeft size={14} />
      </motion.button>

      {/* Date range label */}
      <span className="text-white/75 text-xs sm:text-sm font-medium select-none min-w-[150px] text-center">
        {label}
      </span>

      {/* Next week */}
      <motion.button
        onClick={onNext}
        disabled={!canNext}
        whileHover={canNext ? { scale: 1.1 } : {}}
        whileTap={canNext ? { scale: 0.9 } : {}}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-150 flex-shrink-0 ${
          canNext
            ? "border-[#9B7EDE]/35 bg-[#3D3555]/60 text-[#B8A7E5] hover:bg-[#9B7EDE]/20 hover:text-white hover:border-[#9B7EDE]/55 cursor-pointer"
            : "border-white/6 text-white/12 cursor-not-allowed"
        }`}
      >
        <ChevronRight size={14} />
      </motion.button>

      {/* Jump to today — only when viewing a different week */}
      <AnimatePresence>
        {!isCurrentWeek && (
          <motion.button
            key="today-jump"
            initial={{ opacity: 0, scale: 0.85, x: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: -4 }}
            onClick={onToday}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#9B7EDE]/20 border border-[#9B7EDE]/40 text-[#C084FC] hover:bg-[#9B7EDE]/35 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            ↩ {t.today}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DAY COLUMN HEADER  — day abbreviation + date number circle
// ─────────────────────────────────────────────────────────────────────────────
const DayHeader = ({ date, dayName, isToday, lang }) => {
  const shortMap  = lang === "ar" ? DAY_SHORT_AR : DAY_SHORT;
  const dayNum    = date.getDate();
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";

  return (
    <div className={`flex flex-col items-center gap-1 pb-2.5 ${isWeekend ? "opacity-55" : ""}`}>
      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-[#C084FC]" : "text-white/40"}`}>
        {shortMap[dayName]}
      </span>
      <span
        className={`
          flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
          text-xs sm:text-sm font-bold transition-all select-none
          ${isToday
            ? "bg-[#9B7EDE] text-white shadow-lg shadow-[#9B7EDE]/55 ring-2 ring-[#C084FC]/35"
            : "text-white/65 hover:bg-white/8"
          }
        `}
      >
        {dayNum}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WEEK DOT SCRUBBER  — clickable dots showing ±4 weeks around today
// ─────────────────────────────────────────────────────────────────────────────
const WeekScrubber = ({ currentWeekStart, weekStart, setWeekStart }) => {
  const offsets = Array.from({ length: 9 }, (_, i) => i - 4); // -4 … +4

  return (
    <div className="flex justify-center items-center gap-1.5 mt-5 pt-4 border-t border-white/6">
      {offsets.map((offset) => {
        const ws = new Date(currentWeekStart);
        ws.setDate(ws.getDate() + offset * 7);
        if (ws.getTime() < MIN_WEEK_START.getTime()) return null;
        if (ws.getTime() > MAX_WEEK_START.getTime()) return null;

        const isSelected    = ws.getTime() === weekStart.getTime();
        const isThisWeek    = offset === 0;
        const label = ws.toLocaleDateString("en-US", { month:"short", day:"numeric" });

        return (
          <button
            key={offset}
            onClick={() => setWeekStart(new Date(ws))}
            title={label}
            className={`rounded-full transition-all duration-200 cursor-pointer ${
              isSelected
                ? isThisWeek
                  ? "w-5 h-2 bg-[#9B7EDE]"
                  : "w-5 h-2 bg-[#7C5FBD]"
                : isThisWeek
                ? "w-2 h-2 bg-[#9B7EDE]/45 hover:bg-[#9B7EDE]/75 ring-1 ring-[#9B7EDE]/50"
                : "w-2 h-2 bg-white/15 hover:bg-white/35"
            }`}
          />
        );
      }).filter(Boolean)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE  (root component)
// ─────────────────────────────────────────────────────────────────────────────
const Schedule = () => {
  // Sessions keyed by "YYYY-MM-DD"
  const [scheduleData,        setScheduleData]        = useState(() => buildInitialData());
  const [dragOverDay,         setDragOverDay]         = useState(null);
  const [editingSession,      setEditingSession]      = useState(null);
  const [showFilterPopup,     setShowFilterPopup]     = useState(false);
  const [showAddSessionPopup, setShowAddSessionPopup] = useState(false);
  const [filterSubject,       setFilterSubject]       = useState("All");
  const [isEditMode,          setIsEditMode]          = useState(false);

  // Current visible week (Monday of that week)
  const [weekStart, setWeekStart] = useState(() => getWeekStart(TODAY));

  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const t    = labelsMap[lang];

  // Derived values
  const weekDates        = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const currentWeekStart = useMemo(() => getWeekStart(TODAY), []);
  const isCurrentWeek    = weekStart.getTime() === currentWeekStart.getTime();
  const canPrev          = weekStart.getTime() > MIN_WEEK_START.getTime();
  const canNext          = weekStart.getTime() < MAX_WEEK_START.getTime();
  const todaySessionCount = (scheduleData[TODAY_KEY] || []).length;
  const isScheduleEmpty  = Object.values(scheduleData).every((arr) => arr.length === 0);

  // ── Week navigation ───────────────────────────────────────────────────────
  const goToPrevWeek = useCallback(() => {
    if (!canPrev) return;
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d.getTime() < MIN_WEEK_START.getTime() ? new Date(MIN_WEEK_START) : d;
    });
  }, [canPrev]);

  const goToNextWeek = useCallback(() => {
    if (!canNext) return;
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d.getTime() > MAX_WEEK_START.getTime() ? new Date(MAX_WEEK_START) : d;
    });
  }, [canNext]);

  const goToToday = useCallback(() => setWeekStart(getWeekStart(TODAY)), []);

  // ── Drop handler — dateKeys replace day names ─────────────────────────────
  const handleDrop = useCallback((event, toDateKey, targetIndex = null, snappedHour = null) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/json");
    if (!raw) return;
    try {
      const { fromDay: fromDateKey, sourceIndex } = JSON.parse(raw);
      setScheduleData((prev) => {
        const next       = { ...prev };
        const sourceList = [...(next[fromDateKey] || [])];
        const movedItem  = { ...sourceList[sourceIndex] };

        if (fromDateKey === toDateKey) {
          let newHour = snappedHour ?? parseTimeToHours(movedItem.time);
          if (targetIndex !== null && targetIndex !== sourceIndex) {
            newHour = parseTimeToHours((next[toDateKey] || [])[targetIndex]?.time ?? movedItem.time);
          }
          const updated = { ...movedItem, time: hoursToTimeString(newHour) };
          if (wouldOverlap(next[fromDateKey], updated, movedItem.id)) return prev;
          const list = [...(next[fromDateKey] || [])];
          list[sourceIndex] = updated;
          next[fromDateKey] = list;
        } else {
          sourceList.splice(sourceIndex, 1);
          const destList = [...(next[toDateKey] || [])];
          const updated  = snappedHour
            ? { ...movedItem, time: hoursToTimeString(snappedHour) }
            : movedItem;
          if (targetIndex !== null) {
            const [targetItem] = destList.splice(targetIndex, 1, updated);
            sourceList.splice(sourceIndex, 0, targetItem);
          } else {
            if (wouldOverlap(destList, updated)) return prev;
            destList.push(updated);
          }
          next[fromDateKey] = sourceList;
          next[toDateKey]   = destList;
        }
        return next;
      });
    } catch (err) {
      console.error("Drop error:", err);
    }
  }, []);

  // ── Edit handler ──────────────────────────────────────────────────────────
  const handleEdit = useCallback((updatedSession) => {
    const { dateKey: dk } = editingSession;
    setScheduleData((prev) => ({
      ...prev,
      [dk]: (prev[dk] || []).map((s) =>
        s.id === updatedSession.id ? updatedSession : s
      ),
    }));
    setEditingSession(null);
  }, [editingSession]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen p-4 sm:p-7 lg:p-14 pt-10 lg:pt-20">

      {/* ── Page header ── */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col font-Inter gap-2">
          <p className="text-2xl sm:text-3xl font-semibold text-white">{t.pageTitle}</p>
          <p className="text-xs text-[#B8A7E5]">{t.pageSubtitle}</p>
          <div className="flex flex-row gap-3 items-center mt-3 flex-wrap">
            {!isScheduleEmpty && (
              <motion.button
                onClick={() => {
                  if (isEditMode) { setEditingSession(null); setDragOverDay(null); }
                  setIsEditMode((p) => !p);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full cursor-pointer font-Inter text-sm px-5 py-2 h-9 transition-colors border border-white/10 ${
                  isEditMode ? "bg-[#7C5FBD] text-white" : "bg-[#3D3555] text-white"
                }`}
              >
                {isEditMode ? t.confirmSchedule : t.editSchedule}
              </motion.button>
            )}
            <LiquidGlassButton
              className="text-white gap-2 px-4 py-2 h-9 flex items-center justify-center text-sm"
              icon={Bot}
            >
              Generate Schedule
            </LiquidGlassButton>
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-3 text-white relative flex-wrap">
          {!isScheduleEmpty && (
            <motion.button
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3D3555] border-t border-[#9B7EDE]/20 rounded-full flex gap-2 font-Inter text-sm items-center px-4 py-2"
            >
              <FilterIcon /> {t.filterButton}
            </motion.button>
          )}

          <AnimatePresence>
            {showFilterPopup && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-12 right-0 sm:right-auto sm:left-0 bg-[#2F2844] border border-white/10 rounded-[16px] p-4 w-48 z-50 shadow-2xl"
              >
                <div className="space-y-1">
                  {["All","Data Structures","Web Development","Mathematics","Algorithm Design"].map((subj) => (
                    <button
                      key={subj}
                      onClick={() => { setFilterSubject(subj); setShowFilterPopup(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterSubject === subj ? "bg-[#9B7EDE] text-white" : "text-[#B8A7E5] hover:bg-white/5"
                      }`}
                    >
                      {subj === "All" ? t.all : subj}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setShowAddSessionPopup(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#9B7EDE] flex gap-2 items-center px-4 py-2 rounded-full text-sm"
          >
            <PlusIcon size={16} /> {t.addSession}
          </motion.button>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showAddSessionPopup && (
          <SessionForm setShowAddSessionPopup={setShowAddSessionPopup} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editingSession && (
          <EditSessionModal
            session={editingSession.session}
            daysessions={scheduleData[editingSession.dateKey] || []}
            onConfirm={handleEdit}
            onCancel={() => setEditingSession(null)}
            t={t}
            sessionColors={SESSION_COLORS}
            wouldOverlap={wouldOverlap}
          />
        )}
      </AnimatePresence>

      <ScheduleSummary />

      {/* ── Empty state ── */}
      {isScheduleEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[32px] border border-white/10 bg-[#1F1737]/80 p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#9B7EDE]/20 to-[#52466B]/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#7C5FBD] text-white shadow-lg shadow-[#7C5FBD]/30">
                <CalendarDays size={22} />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-white">Your schedule is empty</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#B8A7E5]">
                  Add sessions to visualize your week or use smart schedule generation to bootstrap a study plan automatically.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => setShowAddSessionPopup(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-[#9B7EDE] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#9B7EDE]/20"
                >
                  Add First Task
                </motion.button>
                <LiquidGlassButton className="h-10 px-5 text-white gap-2 text-sm" icon={Bot}>
                  Generate Schedule
                </LiquidGlassButton>
              </div>
            </div>
          </div>
        </motion.div>

      ) : (
        /* ── Schedule grid ── */
        <div className="bg-[#3D3555]/60 relative p-4 sm:p-6 lg:p-8 w-full rounded-[24px] text-white font-Inter border-t border-[#9B7EDE]/20 mt-10">

          {/* Header: "Weekly Schedule" + week nav arrows */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <p className="text-xl sm:text-2xl font-semibold">{t.weeklySchedule}</p>
            <WeekNav
              weekStart={weekStart}
              onPrev={goToPrevWeek}
              onNext={goToNextWeek}
              onToday={goToToday}
              canPrev={canPrev}
              canNext={canNext}
              isCurrentWeek={isCurrentWeek}
              t={t}
              lang={lang}
            />
          </div>

          {/* Today banner — always shows real today */}
          <TodayBanner
            sessionCount={todaySessionCount}
            t={t}
            lang={lang}
            isCurrentWeek={isCurrentWeek}
          />

          {/* Grid — horizontal scroll on narrow viewports */}
          <div className="overflow-x-auto -mx-1 px-1 pb-1">
            <div className="flex gap-2" style={{ minWidth: "760px" }}>

              <TimeRuler
                HOUR_TICKS={HOUR_TICKS}
                GRID_HEIGHT={GRID_HEIGHT}
                hourToPx={hourToPx}
                fmtHourLabel={fmtHourLabel}
              />

              <LayoutGroup>
                <div className="grid grid-cols-7 gap-2 flex-1">
                  {weekDates.map((date, i) => {
                    const dk        = dateKey(date);
                    const dayName   = DAY_NAMES[i];
                    const isToday   = dk === TODAY_KEY;
                    

                    const daySessions = (scheduleData[dk] || []).filter(
                      (s) => filterSubject === "All" || s.subject === filterSubject
                    );

                    return (
                      <div
                        key={dk}
                        className={`
                          relative rounded-[16px] pt-1 transition-all duration-300
                          ${isToday
                            ? "ring-2 ring-[#9B7EDE]/50 ring-offset-2 ring-offset-[#3D3555]/60"
                            : ""
                          }
                         
                        `}
                      >
                        {/* Floating "Today" pill above the column */}
                        {isToday && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-[3px] rounded-full bg-[#9B7EDE] text-white shadow-lg shadow-[#9B7EDE]/50 whitespace-nowrap">
                              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                              {t.today}
                            </span>
                          </div>
                        )}

                        {/* Day header: abbr + date number */}
                        <DayHeader
                          date={date}
                          dayName={dayName}
                          isToday={isToday}
                          lang={lang}
                        />

                        {/* Time grid column — "day" prop now carries the dateKey */}
                        <DayColumn
                          day={dk}
                          displayDay={dayName}
                          lang={lang}
                          t={t}
                          sessions={daySessions}
                          isEditMode={isEditMode}
                          dragOverDay={dragOverDay}
                          setDragOverDay={setDragOverDay}
                          onDrop={handleDrop}
                          onEditSession={(dk, session) =>
                            setEditingSession({ dateKey: dk, session })
                          }
                          dayLabelsAr={dayLabelsAr}
                          parseTimeToHours={parseTimeToHours}
                          parseDurationToHours={parseDurationToHours}
                          hourToPx={hourToPx}
                          pxToSnappedHour={pxToSnappedHour}
                          GRID_HEIGHT={GRID_HEIGHT}
                          HALF_TICKS={HALF_TICKS}
                          HOUR_HEIGHT_PX={HOUR_HEIGHT_PX}
                          isToday={isToday}
                        />
                      </div>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>
          </div>

          {/* Dot scrubber — shows ±4 weeks around today */}
          <WeekScrubber
            currentWeekStart={currentWeekStart}
            weekStart={weekStart}
            setWeekStart={setWeekStart}
          />
        </div>
      )}

      {/* ── Pro tip ── */}
      <div className="border-t flex flex-col lg:flex-row font-Inter text-white items-start lg:items-center gap-4 rounded-[24px] p-5 sm:p-6 border-[#9B7EDE]/30 mt-8 mb-16 bg-gradient-to-br from-[#9B7EDE]/10 to-transparent">
        <TipBackgroundIcon />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base sm:text-lg">{t.proTip}</p>
          <p className="text-xs leading-relaxed text-[#B8A7E5]">{t.proTipText}</p>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
/* eslint-disable no-unused-vars */
import { FilterIcon, TipBackgroundIcon } from "@/comp/ui/Icons";
import {
  PlusIcon,
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ScheduleSummary from "./sections/ScheduleSummary";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import SessionForm from "./sections/SessionForm/SessionForm";
import { useTranslation } from "react-i18next";
import DayColumn from "./sections/DayColumn";
import { useQuery } from "@tanstack/react-query";
import TimeRuler from "./sections/TimeRuler";
import EditSessionModal from "./sections/EditSessionModal";
import DropConfirmationModal from "./sections/DropConfirmationModal";
import LiquidGlassButton from "@/comp/ui/LiquidGlassButton";
import api from "../../middleware/api";
import CreateSessionModal from "./sections/CreateSessionModal";
import TodayBanner from "./sections/TodayBanner";
import WeekNav from "./sections/WeekNav";
import DayHeader from "./sections/DayHeader";
import WeekScrubber from "./sections/WeekScrubber";
import {
  DAY_NAMES,
  TODAY,
  MIN_WEEK_START,
  getWeekStart,
  MAX_WEEK_START,
  getWeekDates,
  dateKey,
  TODAY_KEY,
  SESSION_COLORS,
} from "./utils/utility";
import {
  TIME_START_HOUR,
  TIME_END_HOUR,
  parseTimeToHours,
  parseDurationToHours,
  SNAP_MINUTES,
  HOUR_HEIGHT_PX,
  fmtHourLabel,
} from "./utils/timeUtility";

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAP DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function wouldOverlap(sessions, candidate, excludeId = null) {
  const cStart = parseTimeToHours(candidate.time);
  const cEnd = cStart + parseDurationToHours(candidate.duration);
  return sessions
    .filter((s) => s.id !== excludeId)
    .some((s) => {
      const sStart = parseTimeToHours(s.time);
      const sEnd = sStart + parseDurationToHours(s.duration);
      return cStart < sEnd && cEnd > sStart;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHER
// ─────────────────────────────────────────────────────────────────────────────
async function buildInitialData(date, filter = "All") {
  const response = await api.get(
    `/sessions/schedule?date=${date}&filter=${filter}`,
  );
  return response.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON  — shown while fetching
// ─────────────────────────────────────────────────────────────────────────────
const LoadingSkeleton = ({ label }) => (
  <div className="mt-10 flex justify-center items-center gap-3 h-40 text-[#B8A7E5] text-sm">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9B7EDE] opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C084FC]" />
    </span>
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE  (root component)
// ─────────────────────────────────────────────────────────────────────────────
const Schedule = () => {
  const [scheduleData, setScheduleData] = useState({});
  const [dragOverDay, setDragOverDay] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showAddSessionPopup, setShowAddSessionPopup] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingDrop, setPendingDrop] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [rawApiData, setRawApiData] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(TODAY));
  // FIX: Use 0 as default so the ruler starts flush — measured value replaces it after mount
  const [headerHeight, setHeaderHeight] = useState(0);

  // FIX: callback ref fires reliably on DOM mount, no useEffect needed
  const headerWrapperRef = useCallback((node) => {
    if (node) {
      const h = node.getBoundingClientRect().height;
      setHeaderHeight(h);
    }
  }, []);

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const subjects = subjectsData?.subjects ?? [];

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await api.post("/user/get-profile");
      return response.data?.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["schedule", weekStart, filterSubject],
    queryFn: async () => {
      const response = await buildInitialData(weekStart, filterSubject);
      setRawApiData(response);
      return response;
    },
    retry: 1,
    select: (data) => {
      const sessions = data.sessions || [];
      return sessions.reduce((acc, session, idx) => {
        const startIso =
          typeof session.startTime === "string"
            ? session.startTime
            : new Date(session.startTime).toISOString();
        const endIso =
          typeof session.endTime === "string"
            ? session.endTime
            : new Date(session.endTime).toISOString();

        const dateMatch = startIso.match(/^(\d{4}-\d{2}-\d{2})/);
        const key = dateMatch
          ? dateMatch[1]
          : new Date(startIso).toISOString().split("T")[0];

        const normalized = {
          ...session,
          id: session._id ?? session.id ?? `${key}-${idx}`,
          startTime: startIso,
          endTime: endIso,
          status: session.status ?? "scheduled",
          subjectId: session.subjectId?._id ?? session.subjectId ?? null,
          subjectName: session.subjectId?.name ?? session.subjectName ?? null,
        };

        if (!acc[key]) acc[key] = [];
        acc[key].push(normalized);
        return acc;
      }, {});
    },
  });

  useEffect(() => {
    if (data) setScheduleData(data);
  }, [data]);

  useEffect(() => {
    if (rawApiData?.metrics) {
      setMetrics(rawApiData.metrics);
    }
  }, [rawApiData]);

  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  const preferredStartHour = useMemo(() => {
    const start = userProfile?.preferredTimeRange?.start;
    return start ? parseTimeToHours(start) : TIME_START_HOUR;
  }, [userProfile]);

  const preferredEndHour = useMemo(() => {
    const end = userProfile?.preferredTimeRange?.end;
    return end ? parseTimeToHours(end) : TIME_END_HOUR;
  }, [userProfile]);

  const filterOptions = useMemo(
    () => [
      { id: "All", label: t("labels.all") },
      ...subjects.map((subject) => ({
        id: subject._id,
        label: subject.name,
      })),
    ],
    [subjects, t],
  );

  useEffect(() => {
    if (filterSubject === "All") return;
    const exists = subjects.some(
      (subject) => String(subject._id) === String(filterSubject),
    );
    if (!exists) setFilterSubject("All");
  }, [subjects, filterSubject]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const currentWeekStart = useMemo(() => getWeekStart(TODAY), []);
  const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime();
  const canPrev = weekStart.getTime() > MIN_WEEK_START.getTime();
  const canNext = weekStart.getTime() < MAX_WEEK_START.getTime();

  const todaySessionCount = (scheduleData?.[TODAY_KEY] ?? []).length;

  const isScheduleEmpty =
    !scheduleData ||
    Object.keys(scheduleData).length === 0 ||
    Object.values(scheduleData).every((arr) => arr.length === 0);

  // FIX: compute dynamic grid values — hourTicks and gridHeight replace the
  // static HOUR_TICKS / GRID_HEIGHT imports that were being passed to TimeRuler
  const { gridStartHour, gridEndHour, gridHeight, halfTicks, hourTicks } =
    useMemo(() => {
      const allSessions = Object.values(scheduleData || {}).flat();
      const roundDownHalf = (h) => Math.floor(h * 2) / 2;
      const roundUpHalf = (h) => Math.ceil(h * 2) / 2;

      let minHour = TIME_START_HOUR;
      let maxHour = TIME_END_HOUR;

      minHour = roundDownHalf(minHour);
      maxHour = roundUpHalf(maxHour);

      allSessions.forEach((session) => {
        const startH = parseTimeToHours(session.startTime);
        const endH = parseTimeToHours(session.endTime);
        if (Number.isFinite(startH))
          minHour = Math.min(minHour, roundDownHalf(startH));
        if (Number.isFinite(endH))
          maxHour = Math.max(maxHour, roundUpHalf(endH));
      });

      minHour = Math.max(0, minHour);
      maxHour = Math.min(24, Math.max(minHour + 1, maxHour));

      const totalHours = maxHour - minHour;
      const height = totalHours * HOUR_HEIGHT_PX;
      const half = Array.from(
        { length: totalHours * 2 + 1 },
        (_, i) => minHour + i * 0.5,
      );
      const hours = half.filter((h) => Number.isInteger(h));

      return {
        gridStartHour: minHour,
        gridEndHour: maxHour,
        gridHeight: height,
        halfTicks: half,
        hourTicks: hours, // dynamic — changes based on actual session times
      };
    }, [scheduleData, preferredStartHour, preferredEndHour]);

  const hourToPxDynamic = useCallback(
    (hour) => (hour - gridStartHour) * HOUR_HEIGHT_PX,
    [gridStartHour],
  );

  const pxToSnappedHourDynamic = useCallback(
    (px) => {
      const raw = gridStartHour + px / HOUR_HEIGHT_PX;
      const step = SNAP_MINUTES / 60;
      const snapped = Math.round(raw / step) * step;
      return Math.max(gridStartHour, Math.min(gridEndHour - step, snapped));
    },
    [gridStartHour, gridEndHour],
  );

  // ── Week navigation ───────────────────────────────────────────────────────
  const goToPrevWeek = useCallback(() => {
    if (!canPrev) return;
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d.getTime() < MIN_WEEK_START.getTime()
        ? new Date(MIN_WEEK_START)
        : d;
    });
  }, [canPrev]);

  const goToNextWeek = useCallback(() => {
    if (!canNext) return;
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d.getTime() > MAX_WEEK_START.getTime()
        ? new Date(MAX_WEEK_START)
        : d;
    });
  }, [canNext]);

  const goToToday = useCallback(() => setWeekStart(getWeekStart(TODAY)), []);

  // ── Drop handler with confirmation ────────────────────────────────────────
  const handleDrop = useCallback(
    (event, toDateKey, targetIndex = null, snappedHour = null) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/json");
      if (!raw) return;
      try {
        const { fromDay: fromDateKey, sourceIndex } = JSON.parse(raw);
        const sourceList = [...(scheduleData[fromDateKey] || [])];
        const movedItem = { ...sourceList[sourceIndex] };

        let newHour = snappedHour ?? parseTimeToHours(movedItem.startTime);

        const oldStartDate = new Date(movedItem.startTime);
        const oldEndDate = new Date(movedItem.endTime);
        const durationMs = oldEndDate.getTime() - oldStartDate.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        const dateObj = new Date(toDateKey);
        const newStartDate = new Date(dateObj);
        newStartDate.setHours(
          Math.floor(newHour),
          Math.round((newHour % 1) * 60),
          0,
          0,
        );

        const newEndDate = new Date(newStartDate);
        newEndDate.setTime(newStartDate.getTime() + durationMs);

        setPendingDrop({
          sessionId: movedItem.id,
          sessionName: movedItem.name,
          oldStartTime: movedItem.startTime,
          oldEndTime: movedItem.endTime,
          newStartTime: newStartDate.toISOString(),
          newEndTime: newEndDate.toISOString(),
          duration: `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
          fromDateKey,
          toDateKey,
          sourceIndex,
          targetIndex,
        });
      } catch (err) {
        console.error("Drop error:", err);
      }
    },
    [scheduleData],
  );

  // ── Handle drop confirmation ──────────────────────────────────────────────
  const handleDropConfirmation = useCallback(() => {
    if (!pendingDrop) return;

    const { fromDateKey, toDateKey, sourceIndex, newStartTime, newEndTime } =
      pendingDrop;

    setScheduleData((prev) => {
      const next = { ...prev };
      const sourceList = [...(next[fromDateKey] || [])];
      const movedItem = { ...sourceList[sourceIndex] };

      movedItem.startTime = newStartTime;
      movedItem.endTime = newEndTime;

      sourceList.splice(sourceIndex, 1);

      if (fromDateKey === toDateKey) {
        next[fromDateKey] = sourceList;
        sourceList.splice(sourceIndex, 0, movedItem);
      } else {
        const destList = [...(next[toDateKey] || [])];
        destList.push(movedItem);
        next[fromDateKey] = sourceList;
        next[toDateKey] = destList;
      }

      return next;
    });

    setPendingDrop(null);
  }, [pendingDrop]);

  // ── Edit handler ──────────────────────────────────────────────────────────
  const handleEdit = useCallback(
    (updatedSession) => {
      const { dateKey: dk } = editingSession;
      setScheduleData((prev) => ({
        ...prev,
        [dk]: (prev[dk] || []).map((s) =>
          s.id === updatedSession.id ? updatedSession : s,
        ),
      }));
      setEditingSession(null);
    },
    [editingSession],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen p-4 sm:p-7 lg:p-14 pt-10 lg:pt-20">
      {/* ── Page header ── */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col font-Inter gap-2">
          <p className="text-3xl sm:text-4xl font-semibold text-white">
            {t("page.title")}
          </p>
          <p className="text-xs text-[#B8A7E5]">{t("page.subtitle")}</p>
          <div className="flex flex-row gap-3 items-center mt-3 flex-wrap">
            {!isScheduleEmpty && (
              <motion.button
                onClick={() => {
                  if (isEditMode) {
                    setEditingSession(null);
                    setDragOverDay(null);
                  }
                  setIsEditMode((p) => !p);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full cursor-pointer font-Inter text-sm px-5 py-2 h-9 transition-colors border border-white/10 ${
                  isEditMode
                    ? "bg-[#7C5FBD] text-white"
                    : "bg-[#3D3555] text-white"
                }`}
              >
                {isEditMode ? t("buttons.confirm") : t("buttons.edit")}
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-3 text-white relative flex-wrap">
          {(!isScheduleEmpty ||
            filterSubject !== "All" ||
            subjects.length > 0) && (
            <motion.button
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3D3555] border-t border-[#9B7EDE]/20 rounded-full flex gap-2 font-Inter text-sm items-center px-4 py-2"
            >
              <FilterIcon /> {t("buttons.filter")}
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
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setFilterSubject(option.id);
                        setShowFilterPopup(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        filterSubject === option.id
                          ? "bg-[#9B7EDE] text-white"
                          : "text-[#B8A7E5] hover:bg-white/5"
                      }`}
                    >
                      {option.label}
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
            <PlusIcon size={16} /> {t("buttons.addTask")}
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
        {editingSession && editingSession.session.status != "completed" && (
          <EditSessionModal
            setEditingSession={setEditingSession}
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
      <AnimatePresence>
        {pendingDrop && (
          <DropConfirmationModal
            pendingDrop={pendingDrop}
            onConfirm={handleDropConfirmation}
            onCancel={() => setPendingDrop(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      <ScheduleSummary
        metrics={metrics}
        scheduleData={scheduleData}
        weekStart={weekStart}
      />

      {isLoading ? (
        <LoadingSkeleton label={t("page.loadingSchedule")} />
      ) : (
        <div className="bg-[#3D3555]/60 relative p-4 sm:p-6 lg:p-8 w-full rounded-[24px] text-white font-Inter border-t border-[#9B7EDE]/20 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-3">
              <p className="text-2xl text-center lg:text-start sm:text-3xl font-semibold">
                {t("page.weeklySchedule")}
              </p>
              <div>
                <LiquidGlassButton
                  onClick={() => setAddModal(true)}
                  icon={CirclePlus}
                  className="bg-primary/30 mb-4 lg:mb-0 cursor-pointer flex gap-3 flex-row justify-center items-center text-sm lg:text-base sm:text-xs text-white px-2 lg:px-3 py-1 rounded-full"
                >
                  {t("buttons.addSession")}
                </LiquidGlassButton>
              </div>
            </div>

            <WeekNav
              weekStart={weekStart}
              onPrev={goToPrevWeek}
              onNext={goToNextWeek}
              onToday={goToToday}
              canPrev={canPrev}
              canNext={canNext}
              isCurrentWeek={isCurrentWeek}
            />
          </div>
          <div className="mt-7">
            <TodayBanner
              sessionCount={todaySessionCount}
              isCurrentWeek={isCurrentWeek}
            />
          </div>

          <div className="overflow-x-auto no-scrollbar  -mx-4 sm:-mx-1 px-4 sm:px-1 pb-3">
            <div className="flex gap-4 sm:gap-2" style={{ minWidth: "960px" }}>
              {/* FIX: pass dynamic hourTicks + gridHeight, not the static imports */}
              <TimeRuler
                HOUR_TICKS={hourTicks}
                GRID_HEIGHT={gridHeight}
                hourToPx={hourToPxDynamic}
                fmtHourLabel={(hour) => fmtHourLabel(hour, locale)}
                headerHeight={headerHeight}
              />

              <LayoutGroup>
                <div
                  className="grid gap-4 sm:gap-2 flex-1"
                  style={{
                    gridTemplateColumns: "repeat(7, minmax(110px, 1fr))",
                  }}
                >
                  {weekDates.map((date, i) => {
                    const dk = dateKey(date);
                    const dayName = DAY_NAMES[i];
                    const isToday = dk === TODAY_KEY;

                    const daySessions = (scheduleData[dk] || []).filter((s) => {
                      if (filterSubject === "All") return true;
                      const sessionSubjectId = s.subjectId?._id ?? s.subjectId;
                      return String(sessionSubjectId) === String(filterSubject);
                    });

                    return (
                      <div
                        key={dk}
                        className={`relative rounded-[16px] pt-1 transition-all duration-300 ${
                          isToday
                            ? "ring-2 ring-[#9B7EDE]/50 ring-offset-2 ring-offset-[#3D3555]/60"
                            : ""
                        }`}
                      >
                        {/* FIX: wrapper div with callback ref on first column only —
                            no forwardRef needed on DayHeader, fires reliably on mount */}
                        {i === 0 ? (
                          <div ref={headerWrapperRef}>
                            <DayHeader
                              date={date}
                              dayName={dayName}
                              isToday={isToday}
                            />
                          </div>
                        ) : (
                          <DayHeader
                            date={date}
                            dayName={dayName}
                            isToday={isToday}
                          />
                        )}

                        <DayColumn
                          day={dk}
                          sessions={daySessions}
                          isEditMode={isEditMode}
                          dragOverDay={dragOverDay}
                          setDragOverDay={setDragOverDay}
                          onDrop={handleDrop}
                          onEditSession={(dk, session) =>
                            setEditingSession({ dateKey: dk, session })
                          }
                          parseTimeToHours={parseTimeToHours}
                          parseDurationToHours={parseDurationToHours}
                          hourToPx={hourToPxDynamic}
                          pxToSnappedHour={pxToSnappedHourDynamic}
                          GRID_HEIGHT={gridHeight}
                          HALF_TICKS={halfTicks}
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

          <WeekScrubber
            currentWeekStart={currentWeekStart}
            weekStart={weekStart}
            setWeekStart={setWeekStart}
          />
        </div>
      )}
      {addModal && <CreateSessionModal setAddModal={setAddModal} />}

      <div className="border-t flex flex-col lg:flex-row font-Inter text-white items-start lg:items-center gap-4 rounded-[24px] p-5 sm:p-6 border-[#9B7EDE]/30 mt-8 mb-16 bg-gradient-to-br from-[#9B7EDE]/10 to-transparent">
        <TipBackgroundIcon />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-base sm:text-lg">
            {t("page.proTipTitle")}
          </p>
          <p className="text-xs leading-relaxed text-[#B8A7E5]">
            {t("page.proTipText")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Schedule;

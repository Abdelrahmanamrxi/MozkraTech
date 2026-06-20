import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import TimerDisplay from "./sections/TimerDisplay";
import TimerControls from "./sections/TimerControls";
import TimerModes from "./sections/TimerModes";
import ProgressBar from "./sections/ProgressBar";
import api from "../../middleware/api";
import { useTimerSessions } from "../../hooks/useTimerSessions";

// ─── Inline translations ──────────────────────────────────────────────────────
const translations = {
  en: {
    back: "Back",
    label: "Timer",
    title: "Study session focus",
    activeSession: "Active session",
    noSession: "No scheduled session selected",
    chooseBelow: "Choose a session below",
    focusLength: "Focus length",
    pickSession: "Pick session",
    chooseSession: "Choose a session",
    available: "available",
    minLeft: "min left",
    noScheduledTime: "No scheduled time",
    loading: "Loading study sessions...",
    noSessions: "No scheduled sessions available.",
    scheduled: "scheduled",
    min: "min",
  },
  ar: {
    back: "رجوع",
    label: "المؤقت",
    title: "جلسة دراسية مركّزة",
    activeSession: "الجلسة النشطة",
    noSession: "لا توجد جلسة مجدولة",
    chooseBelow: "اختر جلسة أدناه",
    focusLength: "مدة التركيز",
    pickSession: "اختر جلسة",
    chooseSession: "اختر جلسة",
    available: "متاحة",
    minLeft: "د متبقية",
    noScheduledTime: "لا يوجد وقت مجدول",
    loading: "جاري تحميل الجلسات...",
    noSessions: "لا توجد جلسات مجدولة.",
    scheduled: "مجدولة",
    min: "د",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

export default function Timer() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const tr = translations[lang];
  const isRTL = lang === "ar";

  const [mode, setMode] = useState("focus");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const {
    sessions,
    selectedSession,
    selectedSessionId,
    setSelectedSessionId,
    updateSessionLocally,
    beginFocusRun,
    consumeFocusRun,
    clearFocusRun,
    isLoading: isSessionsLoading,
  } = useTimerSessions();

  const { data: timerPreferences } = useQuery({
    queryKey: ["timer-profile"],
    queryFn: async () => {
      const { data } = await api.get("/user/get-profile");
      return data?.user?.timer ?? null;
    },
    select: (timer) => ({
      focusMinutes: Number(timer?.sessionDuration),
      breakMinutes: Number(timer?.breakDuration),
    }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const breakDurationSeconds = useMemo(() => {
    const breakMinutes = Number(timerPreferences?.breakMinutes);
    return (Number.isFinite(breakMinutes) && breakMinutes > 0 ? breakMinutes : 5) * 60;
  }, [timerPreferences]);

  const focusDurationSeconds = useMemo(() => {
    const focusMinutes = Number(timerPreferences?.focusMinutes);
    return (Number.isFinite(focusMinutes) && focusMinutes > 0 ? focusMinutes : 30) * 60;
  }, [timerPreferences]);

  useEffect(() => {
    if (!selectedSessionId && sessions.length) {
      setSelectedSessionId(String(sessions[0].id));
    }
  }, [sessions, selectedSessionId, setSelectedSessionId]);

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, actualDuration }) => {
      const response = await api.post("/sessions/update-session", {
        sessionId,
        actualDuration,
      });
      return response.data;
    },
    onError: (error) => {
      console.error("[Timer] Session update error:", error?.response?.data || error?.message);
    },
  });

  const persistFocusProgress = useCallback(async () => {
    if (mode !== "focus" || !selectedSession) return null;
    const sessionId = selectedSession.id ?? selectedSession._id;
    const actualDuration = consumeFocusRun();
    if (!sessionId || actualDuration <= 0) return null;
    const response = await updateSessionMutation.mutateAsync({ sessionId, actualDuration });
    const updatedSession = response?.session ?? null;
    if (updatedSession) {
      updateSessionLocally(sessionId, updatedSession);
      return updatedSession;
    }
    return null;
  }, [consumeFocusRun, mode, selectedSession, updateSessionLocally, updateSessionMutation]);

  const handlePlayPause = async () => {
    if (mode === "break") {
      if (!isRunning && time <= 0) setTime(breakDurationSeconds);
      setShowSessionMenu(false);
      setIsRunning((prev) => !prev);
      return;
    }
    if (!selectedSession) return;
    if (!isRunning) {
      if (time <= 0) setTime(focusDurationSeconds);
      setShowSessionMenu(false);
      beginFocusRun();
      setIsRunning(true);
      return;
    }
    setIsRunning(false);
    const updatedSession = await persistFocusProgress();
    if (updatedSession) clearFocusRun();
    setTime(focusDurationSeconds);
  };

  const handleReset = async () => {
    setShowSessionMenu(false);
    if (mode === "focus") {
      setIsRunning(false);
      if (selectedSession && time > 0) {
        await persistFocusProgress();
        setTime(focusDurationSeconds);
      } else {
        clearFocusRun();
        setTime(focusDurationSeconds);
      }
      return;
    }
    setIsRunning(false);
    setTime(breakDurationSeconds);
  };

  const switchMode = async (newMode) => {
    if (newMode === mode) return;
    setShowSessionMenu(false);
    if (mode === "focus" && isRunning) {
      setIsRunning(false);
      await persistFocusProgress();
      setTime(focusDurationSeconds);
    }
    clearFocusRun();
    setMode(newMode);
    setIsRunning(false);
    setTime(newMode === "focus" ? focusDurationSeconds : breakDurationSeconds);
  };

  useEffect(() => {
    if (!isRunning) return undefined;
    const intervalId = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          if (mode === "focus") {
            void persistFocusProgress().finally(() => {
              clearFocusRun();
              setMode("break");
              setTime(breakDurationSeconds);
            });
          } else {
            setMode("focus");
            setTime(focusDurationSeconds);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [breakDurationSeconds, clearFocusRun, focusDurationSeconds, isRunning, mode, persistFocusProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning && mode === "focus") {
        persistFocusProgress().catch((err) =>
          console.error("[Timer] beforeunload persist failed:", err)
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning, mode, persistFocusProgress]);

  const displayTime = useMemo(() => {
    if (time > 0) return time;
    return mode === "focus" ? focusDurationSeconds : breakDurationSeconds;
  }, [breakDurationSeconds, focusDurationSeconds, mode, time]);

  const formatSessionMinutes = (minutes) => {
    const safeMinutes = Number(minutes ?? 0);
    return Number.isFinite(safeMinutes)
      ? `${safeMinutes.toFixed(1).replace(/\.0$/, "")} ${tr.minLeft}`
      : `0 ${tr.minLeft}`;
  };

  const formatSessionDateTime = (value) => {
    if (!value) return tr.noScheduledTime;
    return new Intl.DateTimeFormat(isRTL ? "ar-EG" : undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="main-background min-h-screen px-4 py-8 md:px-8 flex items-center justify-center relative">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-6 z-50 inline-flex items-center gap-2 text-violet-200/70 hover:text-white transition-colors duration-200 hover:scale-105 active:scale-95 ${isRTL ? "right-6" : "left-6"}`}
      >
        <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isRTL
              ? <path d="M5 12h14M12 5l7 7-7 7" />
              : <path d="M19 12H5M12 19l-7-7 7-7" />
            }
          </svg>
        </div>
        <span className="text-sm font-medium hidden sm:inline">{tr.back}</span>
      </button>

      <div className="w-full max-w-3xl rounded-4xl border border-[#9B7EDE33] bg-[#2E2643]/95 shadow-2xl shadow-black/40 backdrop-blur-md p-6 sm:p-8 md:p-10 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20">
        <div className={`mb-6 flex flex-col gap-4 ${isRTL ? "text-right" : "text-left"} md:flex-row md:items-end md:justify-between`}>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">{tr.label}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">{tr.title}</h2>
          </div>

          <div className={`w-full rounded-3xl border border-white/8 bg-linear-to-br from-white/8 to-white/3 p-4 ${isRTL ? "text-right" : "text-left"} hover:border-white/12 transition-all duration-300`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/70">
                  {tr.activeSession}
                </span>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedSession?.name ?? tr.noSession}
                </p>
                <p className="text-sm text-violet-200/80">
                  {selectedSession ? formatSessionMinutes(selectedSession.duration) : tr.chooseBelow}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-violet-200/55">
                  {selectedSession ? formatSessionDateTime(selectedSession.startTime) : ""}
                </p>
              </div>

              <div className={`rounded-2xl border border-white/10 bg-linear-to-br from-white/8 to-black/20 px-4 py-3 ${isRTL ? "text-right" : "text-right"} hover:border-white/15 transition-all duration-300`}>
                <div className="text-[10px] uppercase tracking-[0.24em] text-violet-200/70">
                  {tr.focusLength}
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {Math.round(focusDurationSeconds / 60)} {tr.min}
                </div>
              </div>
            </div>

            <div className="mt-4 relative">
              <button
                type="button"
                onClick={() => setShowSessionMenu((prev) => !prev)}
                disabled={isRunning || isSessionsLoading || sessions.length === 0}
                className={`flex w-full items-center justify-between rounded-2xl border transition-all duration-300 ${
                  isRunning || isSessionsLoading || sessions.length === 0
                    ? "cursor-not-allowed opacity-60 border-white/5 bg-white/3"
                    : "border-white/12 bg-linear-to-r from-white/8 to-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-md hover:shadow-purple-900/20"
                } px-4 py-3 ${isRTL ? "text-right" : "text-left"} text-sm text-violet-100/90`}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-violet-200/60">
                    {tr.pickSession}
                  </div>
                  <div className="mt-1 font-semibold text-white">
                    {selectedSession?.name ?? tr.chooseSession}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                    {selectedSession
                      ? formatSessionMinutes(selectedSession.duration)
                      : `${sessions.length} ${tr.available}`}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${showSessionMenu ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              {showSessionMenu && (
                <div className={`absolute ${isRTL ? "right-0" : "left-0"} left-0 right-0 top-[calc(100%+0.75rem)] z-30 max-h-72 overflow-auto rounded-3xl border border-white/10 bg-linear-to-b from-[#241D36] to-[#1A1425] p-2 shadow-2xl shadow-black/50 backdrop-blur-md`}>
                  {isSessionsLoading ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-violet-200/70">
                      {tr.loading}
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-violet-200/70">
                      {tr.noSessions}
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const isSelected = String(session.id) === String(selectedSessionId);
                      return (
                        <button
                          key={session.id}
                          type="button"
                          onClick={() => {
                            setSelectedSessionId(String(session.id));
                            setShowSessionMenu(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 ${isRTL ? "text-right" : "text-left"} transition-all duration-200 ${
                            isSelected
                              ? "bg-linear-to-r from-violet-500/30 to-purple-500/20 border border-violet-400/30 text-white shadow-md shadow-violet-500/20"
                              : "text-violet-100/90 hover:bg-white/10 border border-transparent hover:border-white/10"
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{session.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-violet-200/55">
                              {session.status ?? tr.scheduled} · {formatSessionDateTime(session.startTime)}
                            </p>
                          </div>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                            {formatSessionMinutes(session.duration)}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <TimerModes mode={mode} switchMode={switchMode} />

        <div className="rounded-[1.75rem] border border-white/8 bg-linear-to-br from-white/8 to-white/4 px-5 py-8 sm:px-8 sm:py-10 shadow-lg shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300">
          <TimerDisplay time={displayTime} mode={mode} />
          <ProgressBar
            time={displayTime}
            duration={mode === "focus" ? focusDurationSeconds : breakDurationSeconds}
          />
          <TimerControls
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
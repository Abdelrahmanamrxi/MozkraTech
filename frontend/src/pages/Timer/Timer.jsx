import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import TimerDisplay from "./sections/TimerDisplay";
import TimerControls from "./sections/TimerControls";
import TimerModes from "./sections/TimerModes";
import api from "../../middleware/api";
import { useTimerSessions } from "../../hooks/useTimerSessions";
import {
  playStartSound,
  playStopSound,
  playResetSound,
  playCompleteSound,
  startAmbientMusic,
  stopAmbientMusic,
} from "./timerSounds";

// ─── Translations ─────────────────────────────────────────────────────────────
const translations = {
  en: {
    back: "Back", label: "Timer", title: "Study session focus",
    activeSession: "Active session", noSession: "No session selected",
    chooseBelow: "Choose a session below", focusLength: "Focus length",
    pickSession: "Pick session", chooseSession: "Choose a session",
    available: "available", minLeft: "min left",
    noScheduledTime: "No scheduled time", loading: "Loading sessions...",
    noSessions: "No sessions available.", scheduled: "scheduled",
    min: "min", musicOn: "Ambient on", musicOff: "Ambient off",
  },
  ar: {
    back: "رجوع", label: "المؤقت", title: "جلسة دراسية مركّزة",
    activeSession: "الجلسة النشطة", noSession: "لا توجد جلسة محددة",
    chooseBelow: "اختر جلسة أدناه", focusLength: "مدة التركيز",
    pickSession: "اختر جلسة", chooseSession: "اختر جلسة",
    available: "متاحة", minLeft: "د متبقية",
    noScheduledTime: "لا يوجد وقت مجدول", loading: "جاري التحميل...",
    noSessions: "لا توجد جلسات.", scheduled: "مجدولة",
    min: "د", musicOn: "موسيقى تشغيل", musicOff: "موسيقى إيقاف",
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
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isImmersive, setIsImmersive] = useState(false); // Immersive = fullscreen with standby clock

  // Use refs for accurate tracking resistant to browser tab throttling
  const startTimeRef = useRef(null);
  const expectedEndTimeRef = useRef(null);
  const containerRef = useRef(null);

  const {
    sessions, selectedSession, selectedSessionId,
    setSelectedSessionId, updateSessionLocally,
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

  const breakSecs = useMemo(() => {
    const m = Number(timerPreferences?.breakMinutes);
    return (Number.isFinite(m) && m > 0 ? m : 5) * 60;
  }, [timerPreferences]);

  const focusSecs = useMemo(() => {
    const m = Number(timerPreferences?.focusMinutes);
    return (Number.isFinite(m) && m > 0 ? m : 30) * 60;
  }, [timerPreferences]);

  useEffect(() => {
    if (!selectedSessionId && sessions.length) {
      setSelectedSessionId(String(sessions[0].id));
    }
  }, [sessions, selectedSessionId, setSelectedSessionId]);

  useEffect(() => () => stopAmbientMusic(), []);

  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, actualDuration }) => {
      const { data } = await api.post("/sessions/update-session", { sessionId, actualDuration });
      return data;
    },
    onSuccess: (data) => {
      if (data?.session && selectedSession) {
        const id = selectedSession.id ?? selectedSession._id;
        updateSessionLocally(id, data.session);
      }
    },
    onError: (err) => console.error("[Timer] update error:", err?.response?.data || err?.message),
  });

  const persist = async (elapsedSeconds) => {
    if (mode !== "focus" || !selectedSession || elapsedSeconds <= 0) return;
    const sessionId = selectedSession.id ?? selectedSession._id;
    if (!sessionId) return;
    
    const actualDurationMins = Number((elapsedSeconds / 60).toFixed(2));
    
    await updateSessionMutation.mutateAsync({ sessionId, actualDuration: actualDurationMins });
  };

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      const now = Date.now();
      const remaining = Math.round((expectedEndTimeRef.current - now) / 1000);

      if (remaining <= 0) {
        setTime(0);
        setIsRunning(false);
      } else {
        setTime(remaining);
        if (mode === "focus" && startTimeRef.current) {
          setElapsed(Math.floor((now - startTimeRef.current) / 1000));
        }
      }
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, mode]);

  const prevIsRunning = usePrevious(isRunning);
  useEffect(() => {
    if (prevIsRunning === true && isRunning === false && time <= 0) {
      playCompleteSound();
      const elapsedSnap = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
      
      startTimeRef.current = null;
      setElapsed(0);
      
      persist(elapsedSnap).finally(() => {
        if (mode === "focus") {
          setMode("break");
          setTime(breakSecs);
          if (musicEnabled) { stopAmbientMusic(); setTimeout(() => startAmbientMusic("break"), 1700); }
        } else {
          setMode("focus");
          setTime(focusSecs);
          if (musicEnabled) { stopAmbientMusic(); setTimeout(() => startAmbientMusic("focus"), 1700); }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const handlePlay = () => {
    if (mode === "focus" && !selectedSession) return;
    const activeTime = time > 0 ? time : (mode === "focus" ? focusSecs : breakSecs);
    if (time <= 0) setTime(activeTime);
    
    expectedEndTimeRef.current = Date.now() + activeTime * 1000;
    startTimeRef.current = Date.now();
    setElapsed(0);
    
    playStartSound();
    setIsRunning(true);
    if (musicEnabled) startAmbientMusic(mode);
    setShowSessionMenu(false);
  };

  const handlePause = async () => {
    setIsRunning(false);
    playStopSound();
    if (musicEnabled) stopAmbientMusic();
    
    const elapsedSnap = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
    startTimeRef.current = null;
    setElapsed(0);
    
    if (mode === "focus") await persist(elapsedSnap);
  };

  const handleReset = async () => {
    setIsRunning(false);
    playResetSound();
    if (musicEnabled) stopAmbientMusic();
    
    const elapsedSnap = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
    startTimeRef.current = null;
    setElapsed(0);
    
    if (mode === "focus") await persist(elapsedSnap);
    setTime(mode === "focus" ? focusSecs : breakSecs);
    setShowSessionMenu(false);
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    if (isRunning) {
      setIsRunning(false);
      if (musicEnabled) stopAmbientMusic();
      const elapsedSnap = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
      if (mode === "focus") persist(elapsedSnap).catch(console.error);
    }
    setMode(newMode);
    setTime(newMode === "focus" ? focusSecs : breakSecs);
    setElapsed(0);
    startTimeRef.current = null;
    setShowSessionMenu(false);
  };

  const handleBack = async () => {
    if (isRunning) {
      setIsRunning(false);
      if (musicEnabled) stopAmbientMusic();
    }
    const elapsedSnap = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
    startTimeRef.current = null;
    setElapsed(0);
    
    if (mode === "focus") await persist(elapsedSnap);
    navigate(-1);
  };

  const toggleMusic = () => {
    if (musicEnabled) {
      stopAmbientMusic();
      setMusicEnabled(false);
    } else {
      setMusicEnabled(true);
      if (isRunning) startAmbientMusic(mode);
    }
  };

  // ── Toggle Immersive Mode (Fullscreen + Standby Clock) ──────────────────
  const toggleImmersive = async () => {
    try {
      if (!isImmersive) {
        // Enter immersive mode
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
        setIsImmersive(true);
      } else {
        // Exit immersive mode
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
          await document.webkitExitFullscreen();
        }
        setIsImmersive(false);
      }
    } catch (err) {
      console.error("[Timer] Immersive mode error:", err);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isCurrentlyFullscreen && isImmersive) {
        setIsImmersive(false);
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [isImmersive]);

  useEffect(() => {
    const handler = () => {
      if (isRunning && mode === "focus" && startTimeRef.current) {
        const currentElapsedSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const id = selectedSession?.id ?? selectedSession?._id;
        if (id && currentElapsedSecs > 0) {
          const actualDurationMins = Number((currentElapsedSecs / 60).toFixed(2));
          navigator.sendBeacon("/api/sessions/update-session",
            JSON.stringify({ sessionId: id, actualDuration: actualDurationMins }));
        }
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isRunning, mode, selectedSession]);

  const displayTime = time > 0 ? time : (mode === "focus" ? focusSecs : breakSecs);
  const currentDuration = mode === "focus" ? focusSecs : breakSecs;

  const formatMins = (minutes) => {
    const n = Number(minutes ?? 0);
    return Number.isFinite(n)
      ? `${n.toFixed(1).replace(/\.0$/, "")} ${tr.minLeft}`
      : `0 ${tr.minLeft}`;
  };

  const formatDT = (value) => {
    if (!value) return tr.noScheduledTime;
    return new Intl.DateTimeFormat(isRTL ? "ar-EG" : undefined, {
      dateStyle: "medium", timeStyle: "short",
    }).format(new Date(value));
  };

  const bg = isRunning && mode === "focus"
    ? "radial-gradient(ellipse at 50% 40%, #2d1f4e 0%, #0d0a16 65%)"
    : isRunning && mode === "break"
    ? "radial-gradient(ellipse at 50% 40%, #1a2a4a 0%, #080d18 65%)"
    : "radial-gradient(ellipse at 50% 40%, #1c1630 0%, #0d0b14 65%)";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative min-h-screen w-full" ref={containerRef}>
      {/* Standby Clock Mode Background */}
      {isImmersive && (
        <div className="fixed inset-0 z-0 bg-black" />
      )}
      
      <div 
        className={`fixed inset-0 transition-colors duration-1000 z-[-1] ${isImmersive ? "hidden" : ""}`}
        style={{ background: bg }} 
      />
      <div aria-hidden className={`fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] ${isImmersive ? "hidden" : ""}`} />
      <div
        aria-hidden
        className="fixed pointer-events-none rounded-full blur-[160px] opacity-[0.18] transition-colors duration-1000 z-[-1]"
        style={{
          width: 560, height: 560,
          background: mode === "focus" ? "#7c3aed" : "#2563eb",
          top: "30%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Immersive Mode Wrapper (Fullscreen + Standby Clock) ── */}
      <div className={`min-h-screen w-full flex flex-col relative z-10 transition-all duration-500 ${
        isImmersive 
          ? "fixed inset-0 bg-black z-50 flex items-center justify-center p-4" 
          : ""
      }`}>
        
        {/* Top bar (Hidden when immersive) */}
        {!isImmersive && (
          <div className={`flex items-center justify-between px-5 pt-5 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-violet-200/60 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isRTL ? <path d="M5 12h14M12 5l7 7-7 7" /> : <path d="M19 12H5M12 19l-7-7 7-7" />}
                </svg>
              </div>
              <span className="text-sm font-medium hidden sm:inline">{tr.back}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMusic}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  musicEnabled
                    ? "bg-violet-500/20 border-violet-400/30 text-violet-200"
                    : "bg-white/5 border-white/8 text-violet-300/50 hover:text-violet-200 hover:bg-white/8"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span className="hidden sm:inline">{musicEnabled ? tr.musicOff : tr.musicOn}</span>
              </button>
              
              {/* Immersive Mode (Fullscreen + Standby Clock) */}
              <button
                onClick={toggleImmersive}
                title={isImmersive ? "Exit standby clock mode" : "Standby clock mode"}
                className={`p-2 rounded-xl border transition-all ${
                  isImmersive
                    ? "bg-blue-500/20 border-blue-400/30 text-blue-200"
                    : "bg-white/5 border-white/8 text-violet-300/50 hover:text-violet-200 hover:bg-white/8"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isImmersive ? (
                    <>
                      <path d="M8 3v6H2M16 3v6h6M2 16h6v6M18 16h6v6" />
                    </>
                  ) : (
                    <>
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Floating Controls for Immersive Mode */}
        {isImmersive && (
          <div className="absolute top-5 right-5 flex gap-3 z-50">
             <button
                onClick={toggleMusic}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  musicEnabled ? "bg-violet-500/20 border-violet-400/30 text-violet-200" : "bg-white/5 border-white/8 text-violet-300/50"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
            </button>
            <button
              onClick={toggleImmersive}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Main content */}
        <div className={`flex-1 flex flex-col items-center px-4 pb-10 pt-2 ${isImmersive ? "justify-center w-full" : ""}`}>
          <div className={`w-full max-w-2xl flex flex-col gap-5 ${isImmersive ? "items-center" : ""}`}>
            
            {!isImmersive && (
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-[10px] uppercase tracking-[0.35em] text-violet-300/40 mb-1">{tr.label}</p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">{tr.title}</h2>
              </div>
            )}

            {!isImmersive && <TimerModes mode={mode} switchMode={switchMode} />}

            {/* Clock card */}
            <div className={`rounded-3xl border border-white/8 bg-white/4 backdrop-blur-xl shadow-2xl shadow-black/50 p-8 sm:p-10 flex flex-col items-center ${
              isImmersive
                ? "w-full max-w-sm scale-125 border-0 bg-transparent backdrop-blur-none shadow-none"
                : ""
            }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: isImmersive ? 0.1 : 0.25 }}
                  className="w-full flex flex-col items-center"
                >
                  <TimerDisplay 
                    time={displayTime} 
                    duration={currentDuration} 
                    mode={mode} 
                    isRunning={isRunning}
                    isImmersive={isImmersive}
                  />
                </motion.div>
              </AnimatePresence>

              {!isImmersive && (
                <TimerControls
                  isRunning={isRunning}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onReset={handleReset}
                  mode={mode}
                />
              )}
            </div>

            {/* Session card (Hidden in Immersive Mode) */}
            {!isImmersive && (
              <AnimatePresence>
                {!isRunning && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-white/8 bg-white/4 backdrop-blur-xl p-5"
                  >
                    <div className={`flex items-start justify-between gap-4 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-violet-300/40 mb-1">{tr.activeSession}</p>
                        <p className="text-base font-semibold text-white truncate">{selectedSession?.name ?? tr.noSession}</p>
                        <p className="text-xs text-violet-200/50 mt-0.5">
                          {selectedSession ? formatMins(selectedSession.duration) : tr.chooseBelow}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-right">
                        <div className="text-[9px] uppercase tracking-[0.25em] text-violet-200/40">{tr.focusLength}</div>
                        <div className="mt-1 text-sm font-semibold text-white">{Math.round(focusSecs / 60)} {tr.min}</div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSessionMenu((p) => !p)}
                        disabled={isSessionsLoading || sessions.length === 0}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all duration-200 ${
                          isSessionsLoading || sessions.length === 0
                            ? "opacity-50 cursor-not-allowed border-white/5 bg-white/3"
                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/18"
                        } ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.25em] text-violet-200/40 mb-1">{tr.pickSession}</div>
                          <div className="font-medium text-white">{selectedSession?.name ?? tr.chooseSession}</div>
                        </div>
                        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                            {selectedSession ? formatMins(selectedSession.duration) : `${sessions.length} ${tr.available}`}
                          </span>
                          <svg className={`h-4 w-4 text-violet-300/40 transition-transform duration-300 ${showSessionMenu ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>

                      <AnimatePresence>
                        {showSessionMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-[#18122e]/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/60"
                          >
                            {isSessionsLoading ? (
                              <p className="px-4 py-3 text-sm text-violet-200/40">{tr.loading}</p>
                            ) : sessions.length === 0 ? (
                              <p className="px-4 py-3 text-sm text-violet-200/40">{tr.noSessions}</p>
                            ) : sessions.map((session) => {
                              const sel = String(session.id) === String(selectedSessionId);
                              return (
                                <button
                                  key={session.id}
                                  type="button"
                                  onClick={() => { setSelectedSessionId(String(session.id)); setShowSessionMenu(false); }}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-150 ${isRTL ? "flex-row-reverse text-right" : "text-left"} ${
                                    sel
                                      ? "bg-violet-500/20 border border-violet-400/25 text-white"
                                      : "text-violet-100/70 hover:bg-white/8 border border-transparent"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{session.name}</p>
                                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-violet-200/40">
                                      {session.status ?? tr.scheduled} · {formatDT(session.startTime)}
                                    </p>
                                  </div>
                                  <span className="shrink-0 rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-white/60 ml-2">
                                    {formatMins(session.duration)}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function usePrevious(value) {
  const [prev, setPrev] = useState(value);
  const [cur, setCur] = useState(value);
  if (cur !== value) { setPrev(cur); setCur(value); }
  return prev;
}
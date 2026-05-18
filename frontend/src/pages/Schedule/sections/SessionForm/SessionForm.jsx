/* eslint-disable no-unused-vars */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Check, Clock, Trash2, Plus, Loader } from "lucide-react";
import api from "../../../../middleware/api";
import { useQuery } from "@tanstack/react-query";
import AddSessionModal from "./sections/AddSessionModal";
import SessionRow from "./sections/SessionRow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  daysOfWeek,
  calculateDuration,
  formatTimeFrom24,
  getDayFromISO,
  generateId,
  toLocalDateTimeInputValue,
  localDateTimeInputToUtcIso,
} from "../../../../utils/formatTime";

// Helper function to convert ISO time to 12-hour format

async function getUserSubjects() {
  try {
    const response = await api.get("/subjects");
    return response.data;
  } catch (err) {
    return err.response?.data.message;
  }
}

/* ── Main Form ── */
function SessionForm({ setShowAddSessionPopup }) {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const validators = useMemo(
    () => ({
      name: (v) => !v.trim() && t("errors.taskNameRequired"),
      dueDate: (v) => {
        if (!v) return t("errors.dueDateRequired");
        const selectedDate = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return t("errors.dueDatePast");
        return false;
      },
      subjectId: (v) => !v && t("errors.subjectRequired"),
      totalHours: (v) => !v && t("errors.totalHoursRequired"),
      studyHours: (v) => !v && t("errors.studyHoursRequired"),
      priority: (v) => !v && t("errors.priorityRequired"),
    }),
    [t],
  );
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["subjects"],
    queryFn: getUserSubjects,
    retry: 1,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    keepPreviousData: true,
  });

  const minDateTime = toLocalDateTimeInputValue();

  const subjects = data?.subjects ?? [];

  const [form, setForm] = useState({
    name: "",
    subjectId: "",
    dueDate: "",
    totalHours: "",
    priority: "",
    studyHours: "",
  });
  const [Error, setError] = useState({});
  const [sessions, setSessions] = useState([]);
  const [scheduleCreatedMessage, setMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  function validateForm(form, type) {
    let errors = {};
    for (const key in validators) {
      const error = validators[key](form[key]);
      if (error) {
        errors[key] = error;
      }
    }
    if (sessions.length <= 0 && type === "createSchedule") {
      errors["sessions"] = t("errors.addSessionRequired");
    }

    // Additional validation for totalHours against selectedSubject
    if (form.totalHours && selectedSubject) {
      const hours = Number(form.totalHours);
      if (hours > selectedSubject.hoursPerWeek) {
        errors.totalHours = t("errors.maxHoursPerWeek", {
          max: numberFormatter.format(selectedSubject.hoursPerWeek),
        });
      }
    }

    return errors;
  }

  useEffect(() => {
    if (!form.subjectId && subjects.length > 0) {
      setForm((prev) => ({ ...prev, subjectId: subjects[0]._id }));
    }
  }, [subjects, form.subjectId]);

  const selectedSubject =
    subjects.find((s) => s._id === form.subjectId) || subjects[0] || null;

  // Save sessions to localStorage when they change

  const totalHoursValue = Number(form.totalHours) || 6;
  const breakdownText = t("form.breakdownText", {
    hours: numberFormatter.format(totalHoursValue),
    sessions: numberFormatter.format(sessions.length),
  });

  const updateField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setError((prev) => ({ ...prev, [key]: "" }));
  };

  // Session CRUD operations
  const updateSession = (updatedSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
    );
  };

  const deleteSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const addSession = (newSession) => {
    setSessions((prev) => [...prev, newSession]);
  };
  console.log(selectedSubject);
  console.log(sessions);

  async function generateSessions() {
    setError({});
    const errors = validateForm(form);
    setError(errors);
    if (Object.keys(errors).length > 0) return;

    const tzOffsetMinutes = new Date().getTimezoneOffset();
    const dueDateUtc = localDateTimeInputToUtcIso(form.dueDate);
    const response = await api.get(
      `/sessions/availability?dueDate=${encodeURIComponent(dueDateUtc)}&totalHours=${form.totalHours}&studyHours=${form.studyHours}&subjectId=${form.subjectId}&tzOffsetMinutes=${tzOffsetMinutes}`,
    );
    return response.data;
  }

  async function createSchedule() {
    const taskPayload = {
      ...form,
      dueDate: localDateTimeInputToUtcIso(form.dueDate),
    };
    const normalizedSessions = sessions.map((session) => ({
      ...session,
      startTime: session.startTime
        ? new Date(session.startTime).toISOString()
        : session.startTime,
      endTime: session.endTime
        ? new Date(session.endTime).toISOString()
        : session.endTime,
    }));
    const response = await api.post("/sessions/schedule", {
      task: taskPayload,
      sessions: normalizedSessions,
    });
    return response.data;
  }

  function handleCreateSchedule() {
    setError({});
    const errors = validateForm(form, "createSchedule");
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    scheduleMutation.mutate();
  }

  const mutation = useMutation({
    mutationFn: generateSessions,
    onSuccess: (data) => {
      console.log(data);
      const recommendedSessions = data?.recommendedSessions?.sessions || [];
      const transformedSessions = recommendedSessions.map((session) => {
        const startIso = session.startTime
          ? new Date(session.startTime).toISOString()
          : "";
        const endIso = session.endTime
          ? new Date(session.endTime).toISOString()
          : "";
        return {
          id: generateId(),
          name: session.name || "",
          day: getDayFromISO(startIso),
          start: formatTimeFrom24(startIso),
          end: formatTimeFrom24(endIso),
          duration: calculateDuration(startIso, endIso),
          startTime: startIso,
          endTime: endIso,
          subjectId: session.subjectId,
        };
      });
      setSessions(transformedSessions);
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate sessions";
      setError((prev) => ({ ...prev, server: errorMsg }));
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      console.log(data);
      setMessage(data?.message || "Schedule created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["schedule"],
      });
      setShowAddSessionPopup(false);
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create schedule";
      setError((prev) => ({ ...prev, server: errorMsg }));
    },
  });
  function handleCreationSchedule() {
    setError({});
    const errors = validateForm(form, "createSchedule");
    setError(errors);
    if (Object.keys(errors).length > 0) return;
    scheduleMutation.mutate();
  }

  /* ── Shared input classes ── */
  const inputCls =
    "w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20 transition";

  return (
    <>
      {/* ── Scoped styles injected once ── */}
      <style>{`
        .sf-scroll::-webkit-scrollbar { width: 4px; }
        .sf-scroll::-webkit-scrollbar-track { background: transparent; }
        .sf-scroll::-webkit-scrollbar-thumb {
          background: rgba(155,126,222,0.35);
          border-radius: 99px;
        }
        .sf-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(155,126,222,0.6);
        }
        .sf-scroll { scrollbar-width: thin; scrollbar-color: rgba(155,126,222,0.35) transparent; }

        .sf-select {
          -webkit-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B7EDE' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px !important;
          cursor: pointer;
        }
        .sf-select option { background: #1B142D; color: #fff; }

        .sf-date { cursor: pointer; }
        .sf-date::-webkit-calendar-picker-indicator {
          filter: invert(70%) sepia(30%) saturate(400%) hue-rotate(220deg);
          cursor: pointer;
          opacity: 0.7;
        }
        .sf-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        .sf-date[type="date"] { color-scheme: dark; }

        input[type="time"] { color-scheme: dark; }
        input[type="time"]::-webkit-calendar-picker-indicator {
          display: none;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowAddSessionPopup(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="sf-scroll bg-gradient-to-br from-[#1B142D] via-[#1A1530] to-[#141022] font-poppins border border-white/10 rounded-[24px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[85vh] overflow-y-auto space-y-6"
        >
          {!scheduleCreatedMessage ? (
            <>
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                    Create Task
                  </h3>
                  <p className="text-xs text-[#B8A7E5] mt-1.5">
                    Sessions are generated automatically based on your inputs.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddSessionPopup(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#B8A7E5] hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* FORM */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 sm:p-5 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">
                  Task Input
                </p>
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Task Name"
                    className={inputCls}
                  />
                  {Error.name && (
                    <p className="text-red-600 text-xs mt-2 font-Inter">
                      {Error.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">
                      Subject
                    </label>
                    {isLoading ? (
                      <p className="text-xs text-[#B8A7E5]">
                        Loading subjects...
                      </p>
                    ) : error ? (
                      <p className="text-xs text-red-300">
                        Failed to load subjects
                      </p>
                    ) : null}
                    <select
                      value={form.subjectId}
                      onChange={(e) => updateField("subjectId", e.target.value)}
                      className={`${inputCls} sf-select`}
                      disabled={
                        isLoading || isFetching || subjects.length === 0
                      }
                    >
                      <option disabled={true} value="">
                        Choose subject
                      </option>
                      {isLoading ? (
                        <option>Loading subjects...</option>
                      ) : error ? (
                        <option>Error loading subjects</option>
                      ) : (
                        subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        ))
                      )}
                    </select>
                    {Error.subjectId && (
                      <p className="text-red-600 text-xs  font-Inter">
                        {Error.subjectId}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={form.dueDate}
                      min={minDateTime}
                      onChange={(e) => updateField("dueDate", e.target.value)}
                      className={`${inputCls} sf-datetime"`}
                    />
                    {Error.dueDate && (
                      <p className="text-red-600 text-xs  font-Inter">
                        {Error.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">
                      Total Hours{" "}
                      {selectedSubject &&
                        `(Max: ${selectedSubject.hoursPerWeek}h/week)`}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedSubject?.hoursPerWeek || 168}
                      step="0.5"
                      value={form.totalHours}
                      onChange={(e) =>
                        updateField("totalHours", e.target.value)
                      }
                      placeholder="Total Hours"
                      className={inputCls}
                    />
                    {Error.totalHours && (
                      <p className="text-red-600 text-xs font-Inter">
                        {Error.totalHours}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">
                      Priority
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => updateField("priority", e.target.value)}
                      className={`${inputCls} sf-select`}
                    >
                      <option value="" disabled>
                        Select priority
                      </option>
                      {["Low", "Medium", "High"].map((l) => (
                        <option key={l} value={l.toLocaleLowerCase()}>
                          {l}
                        </option>
                      ))}
                    </select>
                    {Error.priority && (
                      <p className="text-red-600 text-xs font-Inter">
                        {Error.priority}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={form.studyHours}
                    onChange={(e) => updateField("studyHours", e.target.value)}
                    placeholder="Your Maximum Study Hours in a day."
                    className={inputCls}
                  />
                  {Error.studyHours && (
                    <p className="text-red-600 text-xs font-Inter">
                      {Error.studyHours}
                    </p>
                  )}
                </div>
              </div>

              {/* GLOBAL ERROR */}
              {Error.server && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-[12px] border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-3"
                >
                  <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs text-red-300">{Error.server}</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setError((prev) => ({ ...prev, server: "" }))
                    }
                    className="ml-auto text-red-400 hover:text-red-300 transition"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              )}

              {/* SESSIONS */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">
                    Generated Sessions ({sessions.length})
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-1 px-2 py-1 rounded-[8px] bg-[#9B7EDE]/20 text-[#B8A7E5] text-xs hover:bg-[#9B7EDE]/30 transition"
                    >
                      <Plus className="w-3 h-3" /> Add Session
                    </motion.button>
                  </div>
                </div>

                {mutation.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader className="w-8 h-8 text-[#9B7EDE]" />
                    </motion.div>
                    <p className="text-sm text-[#B8A7E5]">
                      Generating sessions...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.length === 0 ? (
                      <p className="text-center text-white/40 text-sm py-6">
                        No sessions added. Click "Add Session" to create one.
                      </p>
                    ) : (
                      sessions.map((session) => (
                        <SessionRow
                          key={session.id}
                          session={session}
                          onUpdate={updateSession}
                          onDelete={deleteSession}
                        />
                      ))
                    )}
                  </div>
                )}
                {Error.sessions && (
                  <p className="text-center font-Inter text-red-700">
                    {Error.sessions}
                  </p>
                )}
              </div>

              {/* BREAKDOWN */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">
                  Breakdown
                </p>
                <p className="mt-2 text-sm text-[#B8A7E5]">{breakdownText}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleCreateSchedule}
                  disabled={scheduleMutation.isPending}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 px-4 py-3 rounded-[12px] bg-[#9B7EDE] text-white text-sm font-semibold hover:bg-[#8B6ECE] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scheduleMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader className="w-4 h-4" />
                      </motion.div>
                      Creating...
                    </span>
                  ) : (
                    "Create Task & Schedule"
                  )}
                </motion.button>
                <motion.button
                  onClick={() => {
                    mutation.mutate();
                  }}
                  disabled={mutation.isPending}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 px-4 py-3 rounded-[12px] border border-white/10 bg-white/5 text-sm text-[#B8A7E5] hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Sessions
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddSessionPopup(false)}
                  disabled={scheduleMutation.isPending || mutation.isPending}
                  className="flex-1 px-4 py-3 rounded-[12px] border border-white/10 text-sm text-white/60 hover:text-white/90 transition disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-green-400" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">
                  {scheduleCreatedMessage}
                </h3>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddSessionPopup(false)}
                className="px-6 py-2 rounded-[12px] bg-[#9B7EDE] text-white text-sm font-semibold hover:bg-[#8B6ECE] transition"
              >
                Close
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addSession}
        selectedSubject={selectedSubject}
        defaultDay={
          sessions.length > 0 ? sessions[sessions.length - 1].day : "Mon"
        }
      />
    </>
  );
}

export default SessionForm;

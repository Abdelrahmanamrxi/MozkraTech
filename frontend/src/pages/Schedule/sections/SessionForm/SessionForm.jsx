/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Check, Clock, Trash2, Plus } from "lucide-react";
import api from "../../../../middleware/api";
import { useQuery } from "@tanstack/react-query";
import AddSessionModal from "./sections/AddSessionModal";
import SessionRow from "./sections/SessionRow";


function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

async function getUserSubjects(){
  try{
    const response=await api.get('/subjects')
    return response.data
  }
  catch(err){
    return err.response?.data.message
  }
}



/* ── Main Form ── */
function SessionForm({ setShowAddSessionPopup }) {
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

  const subjects = data?.subjects ?? [];
  
  const [form, setForm] = useState({
    taskName: "",
    subjectId: subjects[0]._id,
    dueDate: "",
    totalHours: "",
    priority: "",
  });
  console.log(form)
  const [sessions, setSessions] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!form.subjectId && subjects.length > 0) {
      setForm((prev) => ({ ...prev, subjectId: subjects[0].id }));
    }
  }, [subjects, form.subjectId]);

  const selectedSubject =
    subjects.find((s) => s.id === form.subjectId) || subjects[0] || null;

  // Save sessions to localStorage when they change

  const totalHoursValue = Number(form.totalHours) || 6;
  const breakdownText = `${totalHoursValue} hours split into ${sessions.length} sessions`;

  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // Session CRUD operations
  const updateSession = (updatedSession) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const deleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const addSession = (newSession) => {
    setSessions(prev => [...prev, newSession]);
  };

 console.log(subjects)
  

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
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white">Create Task</h3>
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">Task Input</p>

            <input
              type="text"
              value={form.taskName}
              onChange={(e) => updateField("taskName", e.target.value)}
              placeholder="Task Name"
              className={inputCls}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">Subject</label>
                {isLoading ? (
                  <p className="text-xs text-[#B8A7E5]">Loading subjects...</p>
                ) : error ? (
                  <p className="text-xs text-red-300">Failed to load subjects</p>
                ) : null}
                <select
                  value={form.subjectId}
                  onChange={(e) => updateField("subjectId", e.target.value)}
                  className={`${inputCls} sf-select`}
                  disabled={isLoading || isFetching || subjects.length === 0}
                >
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
              </div>
               
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#B8A7E5]">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  className={`${inputCls} sf-date`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                min="1"
                step="0.5"
                value={form.totalHours}
                onChange={(e) => updateField("totalHours", e.target.value)}
                placeholder="Total Hours"
                className={inputCls}
              />
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className={`${inputCls} sf-select`}
              >
                <option value="" disabled>
                  Priority
                </option>
                {["Low", "Medium", "High"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SESSIONS */}
          <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">
                Generated Sessions ({sessions.length})
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                 
                />
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
          </div>

          {/* BREAKDOWN */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8A7E5]">Breakdown</p>
            <p className="mt-2 text-sm text-[#B8A7E5]">{breakdownText}</p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-4 py-3 rounded-[12px] bg-[#9B7EDE] text-white text-sm font-semibold hover:bg-[#8B6ECE] transition"
            >
              Create Task & Schedule
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-4 py-3 rounded-[12px] border border-white/10 bg-white/5 text-sm text-[#B8A7E5] hover:bg-white/10 transition"
            >
              Regenerate Sessions
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddSessionPopup(false)}
              className="flex-1 px-4 py-3 rounded-[12px] border border-white/10 text-sm text-white/60 hover:text-white/90 transition"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addSession}
        
        defaultDay={sessions.length > 0 ? sessions[sessions.length - 1].day : "Mon"}
      />
    </>
  );
}

export default SessionForm;
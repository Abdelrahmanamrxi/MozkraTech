import { useState } from "react";
import { to24, to12, calcDuration, isoToLocalDateInputValue, isoToLocalTimeInputValue, localDateTimeToUtcIso, toLocalDateInputValue } from "@/utils/formatTime";
import { Pencil,Trash2,Clock,Edit,Check } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion,AnimatePresence } from "framer-motion";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getFormattedDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

function getDateFromISO(isoString) {
  if (!isoString) return toLocalDateInputValue();
  return isoToLocalDateInputValue(isoString);
}

function getDayNameFromDateString(dateString) {
  if (!dateString) return "Mon";
  // Parse the date string (YYYY-MM-DD format) as local date, not UTC
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, parseInt(month) - 1, parseInt(day));
  return daysOfWeek[date.getDay()];
}

function SessionRow({ session, subjectColor, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: session.name,
    day: session.day,
    date: getDateFromISO(session.startTime),
    start: session.start ? to24(session.start) : isoToLocalTimeInputValue(session.startTime),
    end: session.end ? to24(session.end) : isoToLocalTimeInputValue(session.endTime),
  });

  const save = () => {
    const dur = calcDuration(draft.start, draft.end);
    const startDateTime = localDateTimeToUtcIso(draft.date, draft.start);
    const endDateTime = localDateTimeToUtcIso(draft.date, draft.end);
    
    // Recalculate day from the new date
    const newDay = getDayNameFromDateString(draft.date);
    
    const updatedSession = {
      ...session,
      name: draft.name,
      day: newDay,
      start: to12(draft.start),
      end: to12(draft.end),
      duration: dur,
      startTime: startDateTime,
      endTime: endDateTime,
    };
    onUpdate(updatedSession);
    setEditing(false);
  };

  const cancel = () => {
    setDraft({
      name: session.name,
      day: session.day,
      date: getDateFromISO(session.startTime),
      start: session.start ? to24(session.start) : isoToLocalTimeInputValue(session.startTime),
      end: session.end ? to24(session.end) : isoToLocalTimeInputValue(session.endTime),
    });
    setEditing(false);
  };

  return (
    <div className="rounded-[14px] border border-white/10 bg-[#141026]/70 px-4 py-3 space-y-3">
      {/* top row: day + time + color dot + edit/delete */}
      <div className="flex justify-between items-center">
        <div className="text-white text-sm">
          <span className="font-semibold">{session.day}</span>
          <span className="mx-2 text-white/30">·</span>
          <span className="text-white/80 text-xs">
            {getFormattedDate(session.startTime)}
          </span>
          <span className="mx-2 text-white/30">·</span>
          <span className="text-white/80">
            {session.start} → {session.end}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#B8A7E5]">{session.duration}</span>
          <span className={`h-2.5 w-2.5 rounded-full ${subjectColor}`} />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditing((v) => !v)}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#B8A7E5] hover:bg-[#9B7EDE]/20 hover:border-[#9B7EDE]/40 hover:text-[#C9B5FF] transition-all"
          >
            <Pencil className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(session.id)}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-400/70 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Committed name (shown when not editing) */}
      {!editing && session.name && (
        <p className="text-xs text-[#9B7EDE] pl-0.5">📌 {session.name}</p>
      )}

      {/* Edit panel */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-3 border-t border-white/10">
              {/* Session Name */}
              <div className="relative">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Session name "
                  className="w-full mt-3 rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20 transition"
                />
              </div>

              {/* Date picker */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30">Date</p>
                <input
                  type="date"
                  value={draft.date}
                  min={toLocalDateInputValue()}
                  onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))}
                  className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20 transition [color-scheme:dark]"
                />
              </div>

              {/* Time pickers */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Start", key: "start" },
                  { label: "End",   key: "end"   },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B7EDE]/60 pointer-events-none" />
                      <input
                        type="time"
                        value={draft[key]}
                        onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full rounded-[10px] border border-white/10 bg-white/5 pl-8 pr-3 py-2 text-sm text-white focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20 transition [color-scheme:dark]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <p className="text-[11px] text-white/30">
                Duration preview:{" "}
                <span className="text-[#B8A7E5]">{calcDuration(draft.start, draft.end)}</span>
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-0.5">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={save}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#9B7EDE] text-white text-xs font-semibold"
                >
                  <Check className="w-3 h-3" /> Save
                </motion.button>
                <button
                  onClick={cancel}
                  className="px-3 py-1.5 rounded-[8px] border border-white/10 text-xs text-white/50 hover:text-white/80 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default SessionRow

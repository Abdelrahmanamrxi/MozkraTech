import { useState } from "react";
import { calcDuration,to12 } from "../../../../../utils/formatTime";
import { motion } from "framer-motion";
import { X } from "lucide-react";
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


function AddSessionModal({ isOpen, onClose, onAdd, defaultDay }) {
  const [newSession, setNewSession] = useState({
    name: "",
    day: defaultDay || "Mon",
    start: "18:00",
    end: "20:00",
  });

  const handleAdd = () => {
    const dur = calcDuration(newSession.start, newSession.end);
    const session = {
      name: newSession.name,
      day: newSession.day,
      start: to12(newSession.start),
      end: to12(newSession.end),
      duration: dur,
    };
    onAdd(session);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1B142D] border border-white/10 rounded-[20px] p-5 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-white font-semibold">Add New Session</h4>
          <button onClick={onClose} className="text-white/50 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={newSession.name}
            onChange={(e) => setNewSession(p => ({ ...p, name: e.target.value }))}
            placeholder="Session name (optional)"
            className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20"
          />

          <select
            value={newSession.day}
            onChange={(e) => setNewSession(p => ({ ...p, day: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#9B7EDE]/50 focus:outline-none"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">Start</p>
              <input
                type="time"
                value={newSession.start}
                onChange={(e) => setNewSession(p => ({ ...p, start: e.target.value }))}
                className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">End</p>
              <input
                type="time"
                value={newSession.end}
                onChange={(e) => setNewSession(p => ({ ...p, end: e.target.value }))}
                className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />
            </div>
          </div>

          <p className="text-[11px] text-white/30">
            Duration: <span className="text-[#B8A7E5]">{calcDuration(newSession.start, newSession.end)}</span>
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-[10px] bg-[#9B7EDE] text-white text-sm font-semibold"
            >
              Add Session
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-[10px] border border-white/10 text-white/60 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default AddSessionModal




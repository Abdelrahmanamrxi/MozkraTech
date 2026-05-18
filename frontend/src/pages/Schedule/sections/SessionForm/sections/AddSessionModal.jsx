/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { calcDuration, to12, toLocalDateInputValue, localDateTimeToUtcIso } from "@/utils/formatTime";
import { motion } from "framer-motion";
import { X,Edit } from "lucide-react";
import { generateId } from "@/utils/formatTime";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


function AddSessionModal({ isOpen, onClose, onAdd, defaultDay, selectedSubject }) {
  const { t } = useTranslation("schedule");
  const today = toLocalDateInputValue();
  
  // Helper to get day name from date string
  const getDayNameFromDate = (dateString) => {
    if (!dateString) return "Mon";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, parseInt(month) - 1, parseInt(day));
    return daysOfWeek[date.getDay()];
  };
  
  const [newSession, setNewSession] = useState({
    name: "",
    date: today,
    start: "18:00",
    end: "20:00",
  });

  const handleAdd = () => {
    const dur = calcDuration(newSession.start, newSession.end);
    
    // Create ISO datetime strings
    const startDateTime = localDateTimeToUtcIso(newSession.date, newSession.start);
    const endDateTime = localDateTimeToUtcIso(newSession.date, newSession.end);
    // Get day name from date
    const dayName = getDayNameFromDate(newSession.date);
    
    const session = {
      subjectId:selectedSubject._id,
      id:generateId(),
      name: newSession.name,
      day: dayName,
      start: to12(newSession.start),
      end: to12(newSession.end),
      duration: dur,
      startTime: startDateTime,
      endTime: endDateTime,
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
          <h4 className="text-white font-semibold">{t("addSessionModal.title")}</h4>
          <button onClick={onClose} className="text-white/50 hover:text-white/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={newSession.name}
            onChange={(e) => setNewSession(p => ({ ...p, name: e.target.value }))}
            placeholder={t("placeholders.sessionName")}
            className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 focus:border-[#9B7EDE]/50 focus:outline-none focus:ring-1 focus:ring-[#9B7EDE]/20"
          />

          <input
            type="date"
            value={newSession.date}
            min={toLocalDateInputValue()}
            onChange={(e) => setNewSession(p => ({ ...p, date: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#9B7EDE]/50 focus:outline-none [color-scheme:dark]"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">{t("labels.start")}</p>
              <input
                type="time"
                value={newSession.start}
                onChange={(e) => setNewSession(p => ({ ...p, start: e.target.value }))}
                className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/30 mb-1">{t("labels.end")}</p>
              <input
                type="time"
                value={newSession.end}
                onChange={(e) => setNewSession(p => ({ ...p, end: e.target.value }))}
                className="w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark]"
              />
            </div>
          </div>

          <p className="text-[11px] text-white/30">
            {t("addSessionModal.durationLabel")}: <span className="text-[#B8A7E5]">{calcDuration(newSession.start, newSession.end)}</span>
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-[10px] bg-[#9B7EDE] text-white text-sm font-semibold"
            >
              {t("addSessionModal.addButton")}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-[10px] border border-white/10 text-white/60 text-sm"
            >
              {t("addSessionModal.cancelButton")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default AddSessionModal




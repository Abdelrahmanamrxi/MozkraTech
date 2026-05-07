import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EditSessionModal = ({
  session,
  daysessions,
  onConfirm,
  onCancel,
  t,
  sessionColors,
  wouldOverlap,
}) => {
  const [form, setForm] = useState({
    subject: session.subject,
    time: session.time,
    duration: session.duration,
    color: session.color,
  });
  console.log(form)
  const [overlapError, setOverlapError] = useState(false);

  const handleConfirm = () => {
    const candidate = { ...session, ...form };
    if (wouldOverlap(daysessions, candidate, session.id)) {
      setOverlapError(true);
      return;
    }
    setOverlapError(false);
    onConfirm(candidate);
  };

  const update = (key, value) => {
    setOverlapError(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2F2844] border border-white/10 rounded-[20px] p-6 w-full max-w-sm shadow-2xl"
      >
        <p className="text-white font-semibold text-lg mb-5">{t.editSession}</p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">{t.subject}</span>
            <input
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">{t.time}</span>
            <input
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              placeholder="e.g. 9:00 AM"
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60 placeholder-white/30"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#B8A7E5] uppercase tracking-wide">{t.duration}</span>
            <input
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              placeholder="e.g. 1.5h"
              className="bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#9B7EDE]/60 placeholder-white/30"
            />
          </label>

          <div className="flex gap-2 mt-1">
            {sessionColors.map((c) => (
              <button
                key={c}
                onClick={() => update("color", c)}
                className={`${c} w-6 h-6 rounded-full transition-transform ${
                  form.color === c ? "scale-125 ring-2 ring-white/50" : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <AnimatePresence>
            {overlapError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs mt-1"
              >
                {t.overlapError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-[10px] text-sm text-[#B8A7E5] bg-white/5 hover:bg-white/10 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-[10px] text-sm text-white bg-[#9B7EDE] hover:bg-[#8B6ECC] transition-colors"
          >
            {t.confirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditSessionModal;

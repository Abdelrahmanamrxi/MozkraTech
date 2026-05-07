/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const parseDurationToHours = (str = "") => {
  const h = str.match(/([\d.]+)h/i);
  const m = str.match(/([\d.]+)m/i);
  return (h ? parseFloat(h[1]) : 0) + (m ? parseFloat(m[1]) / 60 : 0) || 1;
};

const SessionCard = ({ session, index, day, onDragStart, onDropOnCard, isEditMode }) => {
  const handleDragStart = (event) => {
    if (!isEditMode) return;
    const target = event.currentTarget;
    const clone = target.cloneNode(true);

    // تحسين شكل الـ Ghost Image أثناء السحب
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.opacity = "0.8";
    clone.style.transform = "scale(0.9)";
    clone.style.borderRadius = "16px";
    clone.style.width = `${target.offsetWidth}px`;
    clone.style.height = `${target.offsetHeight}px`;

    document.body.appendChild(clone);

    const rect = target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    event.dataTransfer?.setDragImage(clone, offsetX, offsetY);

    window.requestAnimationFrame(() => {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
    });

    if (onDragStart) onDragStart(event, day, index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // ضروري للسماح بالـ Drop
  };

  const durationHours = parseDurationToHours(session.duration);
  const isCompact = durationHours <= 1;
  const isTall = durationHours >= 1.5;
  const timeClass = isCompact ? "text-[10px]" : "text-xs";
  const subjectClass = isCompact ? "text-xs" : "text-sm";
  const durationClass = isCompact ? "text-[10px]" : "text-xs";

  return (
    <motion.div
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.stopPropagation(); // لمنع تداخل الحدث مع الـ container الأصلي
        onDropOnCard(e, day, index);
      }}
      layout // خاصية من Framer Motion لعمل Transition ناعم عند تبديل الأماكن
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileDrag={{ scale: 1.05, rotate: "2deg", zIndex: 50 }}
      className={`${session.color} h-full ${
        isCompact ? "p-3" : "p-4"
      } rounded-[16px] text-white ${
        isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      } shadow-lg transition-shadow hover:shadow-2xl flex flex-col ${
        isTall ? "justify-between" : "gap-2"
      }`}
    >
      <p className={`${timeClass} font-Inter opacity-90`}>{session.time}</p>
      <p className={`${subjectClass} font-semibold`}>{session.subject}</p>
      <p className={`${durationClass} opacity-80 ${isTall ? "mt-auto" : ""}`}>
        {session.duration}
      </p>
    </motion.div>
  );
};

export default SessionCard;

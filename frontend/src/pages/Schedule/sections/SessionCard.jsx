/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const SessionCard = ({ session, index, day, onDragStart, onDropOnCard }) => {
  const handleDragStart = (event) => {
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

  return (
    <motion.div
      draggable
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
      className={`${session.color} p-4 rounded-[16px] text-white cursor-grab active:cursor-grabbing shadow-lg transition-shadow hover:shadow-2xl`}
    >
      <p className="text-xs font-Inter opacity-90">{session.time}</p>
      <p className="font-semibold text-sm mt-2">{session.subject}</p>
      <p className="text-xs opacity-80 mt-1">{session.duration}</p>
    </motion.div>
  );
};

export default SessionCard;

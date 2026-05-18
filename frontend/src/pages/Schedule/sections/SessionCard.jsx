//* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { formatDuration, formatIsoTimeLabel } from "../utils/timeUtility";
import { Info } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const parseDurationToHours = (startTime, endTime) => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutes = (end - start) / (1000 * 60);
    const hours = minutes / 60;
    return hours;
  } catch {
    return 1;
  }
};

const SessionCard = ({
  session,
  index,
  day,
  onDragStart,
  onDropOnCard,
  isEditMode,
  onShowDetails,
}) => {
  const { t, i18n } = useTranslation("schedule");
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale);
  const [showDetailBtn, setShowDetailBtn] = useState(false);

  const handleDragStart = (event) => {
    if (!isEditMode) return;
    const target = event.currentTarget;
    const clone = target.cloneNode(true);

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
    e.preventDefault();
  };

  const durationHours = parseDurationToHours(
    session.startTime,
    session.endTime,
  );
  const isCompact = durationHours <= 1;
  const isTall = durationHours >= 1.5;
  const timeClass = isCompact ? "text-[10px]" : "text-xs";
  const subjectClass = isCompact ? "text-xs" : "text-sm";
  const durationClass = isCompact ? "text-[10px]" : "text-xs";
  const statusBg =
    session.status === "scheduled"
      ? "bg-yellow-500/20 text-yellow-400"
      : session.status === "missed"
        ? "bg-red-500/20 text-red-400"
        : session.status === "completed"
          ? "bg-green-500/20 text-green-400"
          : "bg-gray-500/20 text-gray-400";
  const statusKey = session.status || "scheduled";
  const statusLabel = isCompact
    ? t(`statusShort.${statusKey}`)
    : t(`status.${statusKey}`);
  const durationLabel = formatDuration(session.startTime, session.endTime, {
    hourLabel: t("time.hourShort"),
    minuteLabel: t("time.minuteShort"),
    formatNumber: (value) => numberFormatter.format(value),
  });
  const minutesLeft = Math.round(session.duration);
  const timeLeftLabel = t("timeLeft", {
    minutes: numberFormatter.format(minutesLeft),
  });

  return (
    <motion.div
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.stopPropagation();
        onDropOnCard(e, day, index);
      }}
      onMouseEnter={() => setShowDetailBtn(true)}
      onMouseLeave={() => setShowDetailBtn(false)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileDrag={{ scale: 1.05, rotate: "2deg", zIndex: 50 }}
      className={`bg-primary/75 h-full ${
        isCompact ? "p-2 sm:p-3" : "p-3 sm:p-4"
      } rounded-[16px] text-white ${
        isEditMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      } shadow-lg transition-all hover:shadow-xl flex flex-col ${
        isTall ? "justify-between" : "gap-2"
      } relative group overflow-hidden border border-white/10 hover:border-[#9B7EDE]/30`}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9B7EDE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[16px]" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col h-full">
        <p className={`${timeClass} font-Inter opacity-90 leading-tight`}>
          {formatIsoTimeLabel(session.startTime, locale)}
        </p>

        <p
          className={`${subjectClass} font-semibold truncate lg:whitespace-normal lg:overflow-visible lg:text-clip`}
        >
          {session.name}
        </p>

        <div className={`flex flex-col ${isTall ? "mt-auto" : "gap-1"}`}>
          {/* Hide duration on compact cards */}
          {!isCompact && (
            <p className={`${durationClass} opacity-80 leading-tight`}>
              {durationLabel}
            </p>
          )}

          {/* Time left — only show if timer has started and session not completed */}
          {session.duration > 0 &&
            session.status !== "completed" &&
            session.totalDuration !== session.duration && (
              <p
                className={`${timeClass} opacity-60 mb-1 leading-tight tabular-nums`}
              >
                ⏱ {timeLeftLabel}
              </p>
            )}

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`${isCompact ? "text-[8px] px-1.5 py-0.5" : "text-[9px] px-2 py-1"} rounded-full font-medium ${statusBg}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Info button - appears on hover */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={
          showDetailBtn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={(e) => {
          e.stopPropagation();
          if (onShowDetails) onShowDetails(session);
        }}
        className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#9B7EDE]/40 hover:bg-[#9B7EDE]/70 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-lg"
        aria-label={t("aria.viewDetails")}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Info size={14} />
      </motion.button>
    </motion.div>
  );
};

export default SessionCard;

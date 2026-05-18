import { getWeekDates } from "../utils/utility";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const WeekNav = ({
  weekStart,
  onPrev,
  onNext,
  onToday,
  canPrev,
  canNext,
  isCurrentWeek,
}) => {
  const { t, i18n } = useTranslation("schedule");
  const isRtl = i18n.language === "ar";
  const locale = isRtl ? "ar-EG" : "en-US";
  const weekDates = getWeekDates(weekStart);
  const startLabel = weekDates[0].toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
  const endLabel = weekDates[6].toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const label = `${startLabel} – ${endLabel}`;
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const slideX = isRtl ? 4 : -4;
  const todayArrow = isRtl ? "↪" : "↩";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <motion.button
        onClick={onPrev}
        disabled={!canPrev}
        whileHover={canPrev ? { scale: 1.1 } : {}}
        whileTap={canPrev ? { scale: 0.9 } : {}}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-150 flex-shrink-0 ${
          canPrev
            ? "border-[#9B7EDE]/35 bg-[#3D3555]/60 text-[#B8A7E5] hover:bg-[#9B7EDE]/20 hover:text-white hover:border-[#9B7EDE]/55 cursor-pointer"
            : "border-white/6 text-white/12 cursor-not-allowed"
        }`}
      >
        <PrevIcon size={14} />
      </motion.button>

      <span className="text-white/75 text-xs sm:text-sm font-medium select-none min-w-[150px] text-center">
        {label}
      </span>

      <motion.button
        onClick={onNext}
        disabled={!canNext}
        whileHover={canNext ? { scale: 1.1 } : {}}
        whileTap={canNext ? { scale: 0.9 } : {}}
        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-150 flex-shrink-0 ${
          canNext
            ? "border-[#9B7EDE]/35 bg-[#3D3555]/60 text-[#B8A7E5] hover:bg-[#9B7EDE]/20 hover:text-white hover:border-[#9B7EDE]/55 cursor-pointer"
            : "border-white/6 text-white/12 cursor-not-allowed"
        }`}
      >
        <NextIcon size={14} />
      </motion.button>

      <AnimatePresence>
        {!isCurrentWeek && (
          <motion.button
            key="today-jump"
            initial={{ opacity: 0, scale: 0.85, x: slideX }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: slideX }}
            onClick={onToday}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#9B7EDE]/20 border border-[#9B7EDE]/40 text-[#C084FC] hover:bg-[#9B7EDE]/35 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {todayArrow} {t("labels.today")}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
export default WeekNav;

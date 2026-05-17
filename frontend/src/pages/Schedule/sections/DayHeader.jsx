/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { DAY_SHORT_AR,DAY_SHORT } from "../utils/utility";

const DayHeader = ({ date, dayName, isToday, lang, todayLabel },ref) => {
  const shortMap  = lang === "ar" ? DAY_SHORT_AR : DAY_SHORT;
  const dayNum    = date.getDate();
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";

  return (
    <div ref={ref} className={`relative flex flex-col items-center gap-1 pb-2.5 pt-5 ${isWeekend ? "opacity-55" : ""}`}>
      {isToday && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-[3px] rounded-full bg-[#C084FC] text-white shadow-lg shadow-[#C084FC]/60 ring-1 ring-white/30 pointer-events-none whitespace-nowrap">
          {todayLabel}
        </span>
      )}
      <span
        className={`text-[9px] sm:text-[10px] mt-2 font-bold uppercase tracking-wider ${
          isToday ? "text-[#C084FC]" : "text-white/40"
        }`}
      >
        {shortMap[dayName]}
      </span>
      <span
        className={`
          flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
          text-xs sm:text-sm font-bold transition-all select-none
          ${isToday
            ? "bg-[#9B7EDE] text-white shadow-lg shadow-[#9B7EDE]/55 ring-2 ring-[#C084FC]/35"
            : "text-white/65 hover:bg-white/8"
          }
        `}
      >
        {dayNum}
      </span>
    </div>
  );
};
export default DayHeader
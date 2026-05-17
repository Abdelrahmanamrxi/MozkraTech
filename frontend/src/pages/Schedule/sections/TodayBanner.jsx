/* eslint-disable no-unused-vars */
import { fmtFullDate,TODAY } from "../utils/utility";
import { motion } from "framer-motion";
 const TodayBanner = ({ sessionCount, t, lang, isCurrentWeek }) => {
  const locale  = lang === "ar" ? "ar-EG" : "en-US";
  const dateStr = fmtFullDate(TODAY, locale);
 

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex justify-center mb-5 relative"
    >
         
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#9B7EDE]/12 border border-[#9B7EDE]/25 backdrop-blur-sm flex-wrap justify-center">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9B7EDE] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C084FC]" />
        </span>
        <span className="text-[#C084FC] text-[10px] font-extrabold uppercase tracking-widest">
          {t.today}
        </span>
        <span className="w-px h-3 bg-white/20 flex-shrink-0 hidden sm:block" />
        <span className="text-white/80 text-xs font-medium">{dateStr}</span>
        {isCurrentWeek && sessionCount > 0 && (
          <>
            <span className="w-px h-3 bg-white/20 flex-shrink-0 hidden sm:block" />
            <span className="text-[#B8A7E5] text-[11px]">
              {sessionCount} {t.sessions}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
};
export default TodayBanner
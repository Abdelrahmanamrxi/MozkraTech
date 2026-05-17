/* eslint-disable no-unused-vars */
import { MIN_WEEK_START,MAX_WEEK_START } from "../utils/utility";
import { motion } from "framer-motion";

const WeekScrubber = ({ currentWeekStart, weekStart, setWeekStart }) => {
  const offsets = Array.from({ length: 9 }, (_, i) => i - 4);

  return (
    <div className="flex justify-center items-center gap-1.5 mt-5 pt-4 border-t border-white/6">
      {offsets
        .map((offset) => {
          const ws = new Date(currentWeekStart);
          ws.setDate(ws.getDate() + offset * 7);
          if (ws.getTime() < MIN_WEEK_START.getTime()) return null;
          if (ws.getTime() > MAX_WEEK_START.getTime()) return null;

          const isSelected = ws.getTime() === weekStart.getTime();
          const isThisWeek = offset === 0;
          const label      = ws.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <button
              key={offset}
              onClick={() => setWeekStart(new Date(ws))}
              title={label}
              className={`rounded-full transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isThisWeek
                    ? "w-5 h-2 bg-[#9B7EDE]"
                    : "w-5 h-2 bg-[#7C5FBD]"
                  : isThisWeek
                  ? "w-2 h-2 bg-[#9B7EDE]/45 hover:bg-[#9B7EDE]/75 ring-1 ring-[#9B7EDE]/50"
                  : "w-2 h-2 bg-white/15 hover:bg-white/35"
              }`}
            />
          );
        })
        .filter(Boolean)}
    </div>
  );
};


export default WeekScrubber
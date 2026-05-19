import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

const ONGOING_COLORS = {
  low: "bg-blue-500/20 border-blue-400/30 text-blue-300",
  medium: "bg-yellow-500/20 border-yellow-400/30 text-yellow-300",
  high: "bg-red-500/20 border-red-400/30 text-red-300"
};

const COMPLETED_COLORS = "bg-green-500/20 border-green-400/30 text-green-300";

const ONGOING_DOTS = {
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-red-400"
};

const COMPLETED_DOT = "bg-green-400";

const TaskBadge = ({ task, onEdit }) => {
  const { t } = useTranslation("schedule");
  const [isHovered, setIsHovered] = useState(false);

  const isCompleted = task.status === "completed";
  const badgeColor = isCompleted ? COMPLETED_COLORS : ONGOING_COLORS[task.priority];
  const dotColor = isCompleted ? COMPLETED_DOT : ONGOING_DOTS[task.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-2 py-1 rounded-md border text-[11px] sm:text-xs
        flex items-center justify-between gap-1 mb-1
        transition-colors duration-200
        ${badgeColor}
        ${isCompleted ? "opacity-75" : ""}
        ${isHovered ? "brightness-110" : ""}
        cursor-pointer group
      `}
    >
      {/* Completed Indicator or Priority Dot */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {isCompleted ? (
          <Check className="w-3.5 h-3.5 flex-shrink-0 text-green-400" />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
        )}
        <span className={`truncate font-medium ${isCompleted ? "line-through" : ""}`}>
          {task.name}
        </span>
      </div>

      {/* Edit Button */}
      <AnimatePresence>
        <motion.button
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          onClick={() => onEdit(task)}
          className="
            flex-shrink-0 p-0.5 rounded hover:bg-white/10
            transition-colors duration-150
            text-current hover:text-white/80
          "
          title={t("taskActions.edit")}
        >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
        </motion.button>
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskBadge;

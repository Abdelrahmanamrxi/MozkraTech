/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

const SubjectRow = ({ subject, index }) => {
  const { t } = useTranslation("friends");

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col gap-2 pb-5 border-b border-[#9B7EDE]/10 last:border-b-0 last:pb-0"
    >
      {/* Subject title */}
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold text-sm">{subject.name}</p>
        <div className="flex items-center gap-3 text-xs text-purple-300/50"></div>
      </div>

      {/* You bar */}
      <div className="flex items-center gap-3">
        <span className="text-purple-300/50 text-xs w-8 flex-shrink-0">
          {t("progress.you").split(" ")[0]}
        </span>
        <div className="flex-1 h-2 bg-[#2A2440] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${subject.youScore}%` }}
            transition={{
              duration: 0.8,
              delay: 0.2 + index * 0.1,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)]"
          />
        </div>
        <span className="text-white font-semibold text-xs w-8 text-right flex-shrink-0">
          {subject.youScore}%
        </span>
      </div>

      {/* Friend bar */}
      <div className="flex items-center gap-3">
        <span className="text-purple-300/50 text-xs w-8 flex-shrink-0">
          Sarah
        </span>
        <div className="flex-1 h-2 bg-[#2A2440] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${subject.friendScore}%` }}
            transition={{
              duration: 0.8,
              delay: 0.3 + index * 0.1,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-[linear-gradient(90deg,#9B7EDE_0%,#7C5FBD_100%)] opacity-60"
          />
        </div>
        <span className="text-white font-semibold text-xs w-8 text-right flex-shrink-0">
          {subject.friendScore}%
        </span>
      </div>

      <p className="text-white font-semibold text-sm">
        {subject.friendSubject}
      </p>

      {/* Diff */}
      <div className="flex items-center gap-1.5">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className="text-red-400 text-xs font-semibold">
          {Math.abs(subject.diff)}%
        </span>
        <span className="text-purple-300/40 text-xs">{t("behind")}</span>
      </div>
    </motion.div>
  );
};

export default SubjectRow;

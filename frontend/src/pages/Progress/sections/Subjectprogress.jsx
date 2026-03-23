/* eslint-disable no-unused-vars */
import React from "react";
import { Card } from "@/comp/ui/TopCard";
import { motion } from "framer-motion";

function SubjectRow({ subject, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          {/* Dot */}
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background:
                subject.progress >= 85 ? "#9067c6" : "rgba(255,255,255,0.4)",
            }}
          />
          <p className="font-blinker text-base text-white">{subject.name}</p>
        </div>

        <div className="flex flex-row items-center gap-3">
          <span className="font-blinker text-sm text-white/60">
            {subject.hoursStudied}/{subject.totalHours}h
          </span>
          {/* Grade badge */}
          <span
            className="font-blinker text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(144, 103, 198, 0.25)",
              color: "#c4b5fd",
              border: "1px solid rgba(144, 103, 198, 0.3)",
            }}
          >
            {subject.grade}
          </span>
          <span className="font-blinker text-sm text-white font-semibold w-10 text-right">
            {subject.progress}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${subject.progress}%` }}
          transition={{
            delay: 0.2 + 0.1 * index,
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="h-full rounded-full"
          style={{
            background:
              subject.progress >= 85
                ? "linear-gradient(90deg, #9067c6, #c4b5fd)"
                : "linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.5))",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function SubjectProgress({ mockProgressData }) {
  return (
    <Card variant="dark" className="p-6">
      <p className="font-poppins text-lg font-semibold mb-5">
        Subject Progress
      </p>
      <div className="flex flex-col gap-5">
        {mockProgressData.subjects.map((subject, index) => (
          <SubjectRow key={subject.name} subject={subject} index={index} />
        ))}
      </div>
    </Card>
  );
}

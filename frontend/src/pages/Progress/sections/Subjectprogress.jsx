import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function SubjectRow({ subject, index }) {
  const { i18n } = useTranslation();
  const labels = {
    en: { hourUnit: "h" },
    ar: { hourUnit: "س" },
  };
  const lang = i18n.language === "ar" ? "ar" : "en";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex min-w-0 flex-row items-center gap-3">
          <div
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{
              background:
                subject.progress >= 85 ? "#9067c6" : "rgba(255,255,255,0.4)",
            }}
          />
          <p className="truncate font-blinker text-base text-white">
            {subject.name}
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-row items-center gap-3">
          <span className="inline-flex items-center gap-1 font-blinker text-sm text-white/60">
            <span>
              {subject.hoursStudied}/{subject.totalHours}
            </span>
            <span>{labels[lang].hourUnit}</span>
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-blinker text-xs font-semibold"
            style={{
              background: "rgba(144, 103, 198, 0.25)",
              color: "#c4b5fd",
              border: "1px solid rgba(144, 103, 198, 0.3)",
            }}
          >
            {subject.grade}
          </span>
          <span className="w-10 text-right font-blinker text-sm font-semibold text-white">
            {subject.progress}%
          </span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
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

export default function SubjectProgress({ progressData }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const labels = {
    en: { title: "Subject Progress", empty: "No subjects have progress yet." },
    ar: { title: "تقدم المواد", empty: "لا يوجد تقدم في المواد بعد." },
  };
  const subjects = progressData?.subjects ?? [];

  return (
    <div className="rounded-[24px] border border-[#9B7EDE]/20 bg-[#3d3555] p-6">
      <p className="mb-5 font-poppins text-lg font-semibold">
        {labels[lang].title}
      </p>
      <div className="flex flex-col gap-5">
        {subjects.length === 0 && (
          <p className="font-blinker text-sm text-white/50">
            {labels[lang].empty}
          </p>
        )}
        {subjects.map((subject, index) => (
          <SubjectRow key={subject.name} subject={subject} index={index} />
        ))}
      </div>
    </div>
  );
}

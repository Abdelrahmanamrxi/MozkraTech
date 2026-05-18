/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Clock, BookOpen, Award, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
function StatsRow({ metrics, streak }) {
  const { t } = useTranslation("profile");

  const statConfig = [
    {
      type: "studyHours",
      labelKey: "statsLabels.studyHours",
      value: metrics?.studyHours ?? 0,
      icon: Clock,
      accent: "border-[#9B7EDE]/30",
    },
    {
      type: "subjects",
      labelKey: "statsLabels.courses",
      value: metrics?.subjectCount ?? 0,
      icon: BookOpen,
      accent: "border-[#7C5FBD]/30",
    },
    {
      type: "achievements",
      labelKey: "statsLabels.achievements",
      value: metrics?.achievementCount ?? 0,
      icon: Award,
      accent: "border-[#9B7EDE]/20",
    },
    {
      type: "streak",
      labelKey: "statsLabels.streakDays",
      value: streak ?? 0,
      icon: Flame,
      accent: "border-[#7C5FBD]/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6">
      {statConfig.map(({ type, labelKey, value, icon: Icon, accent }, idx) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.07 }}
          className={`flex flex-col items-start bg-[#3D3555]/60 border-t ${accent} rounded-[24px] font-Inter p-6`}
        >
          <Icon size={20} className="text-[#B8A7E5]" />
          <p className="text-sm text-[#B8A7E5] mt-3">{t(labelKey)}</p>
          <p className="font-bold text-white mt-2 text-2xl lg:text-3xl">
            {value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsRow;

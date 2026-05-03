/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Clock, BookOpen, Award, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap = {
  hours: { icon: Clock, accent: "border-[#9B7EDE]/30" },
  courses: { icon: BookOpen, accent: "border-[#7C5FBD]/30" },
  achievements: { icon: Award, accent: "border-[#9B7EDE]/20" },
  streak: { icon: Flame, accent: "border-[#7C5FBD]/20" },
};

function StatsRow({ mockProfileData }) {
  const { stats } = mockProfileData;
  const { t } = useTranslation("profile");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6">
      {stats.map((stat, idx) => {
        const { icon: Icon, accent } = iconMap[stat.type] || iconMap.courses;
        return (
          <motion.div
            key={stat.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            className={`flex flex-col items-start bg-[#3D3555]/60 border-t ${accent} rounded-[24px] font-Inter p-6`}
          >
            <Icon size={20} className="text-[#B8A7E5]" />
            <p className="text-sm text-[#B8A7E5] mt-3">{t(stat.labelKey)}</p>
            <p className="font-bold text-white mt-2 text-2xl lg:text-3xl">
              {stat.value}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default StatsRow;

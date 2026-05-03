/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CheckCircle, PlayCircle, Award, BookMarked } from "lucide-react";
import { useTranslation } from "react-i18next";

const activityIconMap = {
  quiz: {
    icon: CheckCircle,
    color: "bg-[#9B7EDE]/20 border-[#9B7EDE]/40",
    iconColor: "text-[#9B7EDE]",
  },
  module: {
    icon: PlayCircle,
    color: "bg-[#7C5FBD]/20 border-[#7C5FBD]/40",
    iconColor: "text-[#7C5FBD]",
  },
  streak: {
    icon: Award,
    color: "bg-[#9B7EDE]/20 border-[#9B7EDE]/40",
    iconColor: "text-[#9B7EDE]",
  },
  project: {
    icon: BookMarked,
    color: "bg-[#7C5FBD]/20 border-[#7C5FBD]/40",
    iconColor: "text-[#7C5FBD]",
  },
};

function RecentActivity({ mockProfileData }) {
  const { activities } = mockProfileData;
  const { t } = useTranslation("profile");

  return (
    <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter">
      <p className="text-lg font-semibold text-white mb-5">
        {t("recentActivity.title")}
      </p>

      <div className="flex flex-col gap-3">
        {activities.map((activity, idx) => {
          const {
            icon: Icon,
            color,
            iconColor,
          } = activityIconMap[activity.type] || activityIconMap.module;
          const dayLabel = t(activity.dayKey);
          const timeLabel = t("recentActivity.timeLabel", {
            day: dayLabel,
            time: activity.time,
          });
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="flex items-center gap-4 bg-[#2F2844]/80 border border-white/10 rounded-[16px] px-4 py-3.5"
            >
              <div
                className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${color}`}
              >
                <Icon size={15} className={iconColor} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {t(activity.titleKey)}
                </p>
                <p className="text-[10px] text-[#B8A7E5]/60 mt-0.5">
                  {timeLabel}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;

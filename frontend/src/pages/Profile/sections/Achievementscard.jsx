/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AchievementsCard({ achievements }) {
  console.log(achievements);
  const navigate = useNavigate();
  const total = 12;
  const percentage = Math.round((achievements / total) * 100);
  const { t } = useTranslation("profile");

  return (
    <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#9B7EDE]/20 border border-[#9B7EDE]/30 flex items-center justify-center">
          <Trophy size={18} className="text-[#9B7EDE]" />
        </div>
        <p className="text-lg font-semibold text-white">
          {t("achievements.title")}
        </p>
      </div>

      <p className="text-xs text-[#B8A7E5] leading-relaxed">
        {t("achievements.description", { unlocked: achievements, total })}
      </p>

      <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] rounded-full"
        />
      </div>
      <p className="text-[10px] text-[#B8A7E5]/50 mt-1 text-right">
        {achievements}/{total}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard/achievements")}
        className="mt-3 flex items-center gap-1 text-xs text-[#B8A7E5] hover:text-white transition-colors cursor-pointer"
      >
        {t("achievements.viewAll")} <ChevronRight size={12} />
      </motion.button>
    </div>
  );
}

export default AchievementsCard;

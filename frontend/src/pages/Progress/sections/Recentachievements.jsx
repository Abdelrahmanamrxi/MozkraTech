import React from "react";
import { Card } from "@/comp/ui/TopCard";
import GlassySection from "@/comp/ui/GlassySection";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

const formatDate = (date, locale) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function RecentAchievements({ progressData }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  const labels = {
    en: {
      title: "Recent Achievements",
      empty: "No achievements unlocked yet.",
    },
    ar: {
      title: "أحدث الإنجازات",
      empty: "لم يتم فتح أي إنجازات بعد.",
    },
  };
  const achievements = progressData?.recentAchievements ?? [];

  return (
    <Card variant="dark" className="p-6">
      <p className="mb-5 font-poppins text-lg font-semibold">
        {labels[lang].title}
      </p>
      <div className="flex flex-col gap-3">
        {achievements.length === 0 && (
          <GlassySection classname="flex w-full flex-row items-center gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
              <Trophy size={18} className="text-white/70" />
            </div>
            <p className="font-blinker text-sm text-white/50">
              {labels[lang].empty}
            </p>
          </GlassySection>
        )}

        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.code ?? achievement.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.4 }}
          >
            <GlassySection classname="flex w-full flex-row items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#9067c6]/25 text-xl">
                {achievement.icon || <Trophy size={18} />}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-blinker text-sm font-semibold text-white">
                    {achievement.name}
                  </p>
                  {achievement.badge && (
                    <span className="rounded-full bg-[#9B7EDE]/20 px-2 py-0.5 font-blinker text-xs font-semibold text-[#c4b5fd]">
                      {achievement.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-blinker text-sm leading-relaxed text-white/60">
                  {achievement.description}
                </p>
                {achievement.unlockedAt && (
                  <p className="mt-2 font-blinker text-xs text-white/40">
                    {formatDate(achievement.unlockedAt, locale)}
                  </p>
                )}
              </div>
            </GlassySection>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

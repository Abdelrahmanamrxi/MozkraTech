import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import useCountUp from "@/hooks/useCountUp";
import { FireIcon, AchievementIcon, CompletedIcon } from "@/comp/ui/Icons";
import { useTranslation } from "react-i18next";

function StatCard({
  value,
  label,
  icon,
  className,
  accentColor,
  cardVariants,
  iconVariants,
  numberVariants,
}) {
  const animatedValue = useCountUp(value, 0);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      className={`group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-[24px] p-6 font-Inter transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor}22, transparent)`,
        }}
      />

      <motion.div
        variants={iconVariants}
        initial="idle"
        whileHover="hover"
        className="relative z-10"
      >
        {icon}
      </motion.div>

      <motion.p
        variants={numberVariants}
        initial="idle"
        whileHover="hover"
        className="relative z-10 mt-2 text-2xl font-bold text-white"
      >
        {animatedValue}
      </motion.p>
      <p className="relative z-10 text-[#B8A7E5]">{label}</p>

      <div
        className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
}

export default function StatsOverview({ progressData }) {
  const { t } = useTranslation(["progress"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.15,
      rotate: 8,
      transition: { duration: 0.3 },
    },
  };

  const numberVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: { duration: 0.2 },
    },
  };

  const cards = [
    {
      value: progressData.subjectCount,
      label: t("stats.subjects"),
      icon: <BookOpen size={38} strokeWidth={1.7} />,
      className:
        "border-2 border-[#9B7EDE]/60 bg-[#9B7EDE]/10 hover:border-[#9B7EDE]/80",
      accentColor: "#9B7EDE",
    },
    {
      value: progressData.goalsAchieved,
      label: t("stats.goalsAchieved"),
      icon: <CompletedIcon />,
      className:
        "border border-[#9B7EDE]/50 bg-[#7C5FBD]/20 hover:border-[#7C5FBD]/80",
      accentColor: "#7C5FBD",
    },
    {
      value: progressData.dayStreak,
      label: t("stats.dayStreak"),
      icon: <FireIcon />,
      className:
        "border border-[#FF8904] bg-gradient-to-b from-[rgba(0,201,80,0.2)] to-[rgba(0,201,80,0.1)] hover:border-[#00C950]/80",
      accentColor: "#00C950",
    },
    {
      value: progressData.achievements,
      label: t("stats.achievements"),
      icon: <AchievementIcon />,
      className:
        "border-t-2 border-[#F0B100]/40 bg-gradient-to-br from-[#F0B100]/20 via-white/5 to-transparent backdrop-blur-md hover:border-[#F0B100]/60",
      accentColor: "#F0B100",
    },
  ];

  return (
    <section className="mt-8">
      <motion.div
        className="grid grid-cols-2 gap-5 font-blinker lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
            cardVariants={cardVariants}
            iconVariants={iconVariants}
            numberVariants={numberVariants}
          />
        ))}
      </motion.div>
    </section>
  );
}

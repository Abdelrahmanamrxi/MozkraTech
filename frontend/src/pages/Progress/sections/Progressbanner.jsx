/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function ProgressBanner({ mockProgressData }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const labels = {
    en: {
      title: "Your Progress",
      subtitle: "Track your learning journey and celebrate achievements",
    },
    ar: {
      title: "تقدمك",
      subtitle: "تابع رحلة تعلمك واحتفل بالإنجازات",
    },
  };

  return (
    <section className="relative flex flex-col gap-2 mb-2">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="lg:text-4xl text-3xl font-semibold text-white font-poppins"
      >
        {labels[lang].title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="font-blinker text-white/60 text-base"
      >
        {labels[lang].subtitle}
      </motion.p>
    </section>
  );
}

export default ProgressBanner;

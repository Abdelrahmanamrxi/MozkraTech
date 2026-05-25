/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FEATURE_ICONS = [
  (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
];
function Features() {
  const { t } = useTranslation("chatbot");
  const items = t("features.items", { returnObjects: true });
  const features = Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        icon: FEATURE_ICONS[index] || FEATURE_ICONS[0],
      }))
    : [];

  return (
     <>
   {features.map((f, i) => (
       <motion.div
       key={`${f.title}-${i}`}
       initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  style={{
                    background: '#9B7EDE1A',
                  }}
                  className="flex-1 border-t border-[#9B7EDE4D] opacity-80 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="text-violet-400">{f.icon}</div>
                  <p className="text-sm font-Inter font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-[#B8A7E5] leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
                  </>
  )
}

export default Features

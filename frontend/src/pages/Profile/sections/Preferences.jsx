/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

const Toggle = ({ enabled, onToggle }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <motion.button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${
        enabled ? "bg-[#9B7EDE]" : "bg-white/20"
      }`}
    >
      <motion.div
        // Logic: In LTR, move from 2 to 20. In RTL, move from -2 to -20
        // Or more simply, use left/right positioning:
        animate={{
          x: enabled ? (isRtl ? -20 : 20) : isRtl ? -2 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm ${
          isRtl ? "right-0" : "left-0"
        }`}
      />
    </motion.button>
  );
};

function Preferences({ mockProfileData }) {
  return(
    <div>
      </div>
  )
}

export default Preferences;

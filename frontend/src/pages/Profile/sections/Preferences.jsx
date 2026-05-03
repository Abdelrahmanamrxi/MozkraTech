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
  const [prefs, setPrefs] = useState(mockProfileData.preferences);
  const { t, i18n } = useTranslation("profile");
  const isRtl = i18n.dir() === "rtl";

  const handleToggle = (key) => {
    setPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  return (
    // Added dir attribute and text alignment logic
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter"
    >
      <div
        className={`flex items-center gap-2 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <Settings size={18} className="text-[#B8A7E5]" />
        <p className="text-lg font-semibold text-white">
          {t("preferences.title")}
        </p>
      </div>

      <div className="flex flex-col">
        {prefs.map((pref, idx) => (
          <div
            key={pref.key}
            className={`flex items-center justify-between py-3 ${
              idx !== prefs.length - 1 ? "border-b border-white/10" : ""
            }`}
          >
            <p className="text-sm text-white font-medium">{t(pref.labelKey)}</p>
            <Toggle
              enabled={pref.enabled}
              onToggle={() => handleToggle(pref.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Preferences;

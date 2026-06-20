import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const translations = {
  en: { pause: "Pause", start: "Start", reset: "Reset" },
  ar: { pause: "إيقاف", start: "ابدأ", reset: "إعادة" },
};

export default function TimerControls({ isRunning, onPlay, onPause, onReset, mode }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const tr = translations[lang];

  const accent = mode === "focus"
    ? "bg-violet-600 hover:bg-violet-500 shadow-violet-900/50"
    : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/50";

  const pulseColor = mode === "focus" ? "rgba(167,139,250,0.4)" : "rgba(96,165,250,0.4)";

  return (
    <div className="flex justify-center items-center gap-6 mt-6">
      {/* Reset */}
      <button
        onClick={onReset}
        title={tr.reset}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-violet-200/50 hover:text-white hover:bg-white/10 hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.1 6.7C13.3 6.4 14.5 6.2 16 6.2C22.4 6.2 27.5 11.3 27.5 17.7C27.5 24.1 22.4 29.3 16 29.3C9.6 29.3 4.4 24.1 4.4 17.7C4.4 15.3 5.1 13.1 6.3 11.3" />
          <path d="M10.5 7.1L14.3 2.7M10.5 7.1L15 10.3" />
        </svg>
      </button>

      {/* Play / Pause */}
      <div className="relative flex items-center justify-center">
        {isRunning && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ border: `1.5px solid ${pulseColor}`, inset: -12 }}
            animate={{ scale: [1, 1.55], opacity: [0.8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <button
          onClick={isRunning ? onPause : onPlay}
          title={isRunning ? tr.pause : tr.start}
          className={`w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg ${accent} hover:scale-110 active:scale-95 transition-all duration-200`}
        >
          {isRunning ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M8 5V19M16 5V19" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.3 16V11.25C5.3 5.36 9.5 2.94 14.6 5.9L22.8 10.64C27.96 13.58 27.96 18.41 22.8 21.36L14.6 26.1C9.5 29.05 5.3 26.64 5.3 20.74V16Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Balance spacer */}
      <div className="w-12 h-12" />
    </div>
  );
}
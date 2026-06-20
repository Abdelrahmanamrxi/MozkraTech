import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// ─── Inline translations ──────────────────────────────────────────────────────
const translations = {
  en: { stayFocused: "Stay Focused", timeToRelax: "Time to Relax" },
  ar: { stayFocused: "حافظ على تركيزك", timeToRelax: "حان وقت الراحة" },
};
// ─────────────────────────────────────────────────────────────────────────────

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function TimerDisplay({ time, duration, mode, isRunning, isImmersive }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const tr = translations[lang];

  const safeDuration = Math.max(duration || 1, 1);
  const progress = Math.min(1, Math.max(0, time / safeDuration));

  const radius = 110;
  const strokeWidth = 5;
  const svgSize = (radius + strokeWidth + 4) * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const arcColor = mode === "focus" ? "#a78bfa" : "#60a5fa";
  const glowColor = mode === "focus" ? "#7c3aed" : "#2563eb";
  const labelColor = mode === "focus" ? "text-violet-300/60" : "text-blue-300/60";

  // Immersive mode: elegant wall-clock display with subtle ambient effects
  if (isImmersive) {
    const clockRadius = 160;
    const clockSize = (clockRadius + 20) * 2;
    const clockCx = clockSize / 2;
    const clockCy = clockSize / 2;
    const clockCircumference = 2 * Math.PI * clockRadius;

    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* Subtle ambient glow - light and efficient */}
        <motion.div
          animate={{
            opacity: isRunning ? [0.12, 0.18, 0.12] : 0.08,
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{
            width: 420,
            height: 420,
            background: glowColor,
          }}
        />

        {/* Main clock display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Clock face */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer ambient circle */}
            <motion.div
              animate={{
                opacity: isRunning ? [0.12, 0.18, 0.12] : 0.08,
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: clockSize + 50,
                height: clockSize + 50,
                border: `1px solid ${arcColor}`,
              }}
            />

            {/* Main SVG clock */}
            <svg width={clockSize} height={clockSize} viewBox={`0 0 ${clockSize} ${clockSize}`} className="relative">
              {/* Background circle */}
              <circle
                cx={clockCx}
                cy={clockCy}
                r={clockRadius}
                fill="rgba(255,255,255,0.01)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />

              {/* Minute track (thin circles) */}
              {[...Array(60)].map((_, i) => {
                const angle = (i * 6) * (Math.PI / 180);
                const isHour = i % 5 === 0;
                const length = isHour ? 12 : 5;
                const x1 = clockCx + (clockRadius - 8) * Math.cos(angle);
                const y1 = clockCy + (clockRadius - 8) * Math.sin(angle);
                const x2 = clockCx + (clockRadius - 8 - length) * Math.cos(angle);
                const y2 = clockCy + (clockRadius - 8 - length) * Math.sin(angle);
                return (
                  <line
                    key={`marker-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isHour ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}
                    strokeWidth={isHour ? "2" : "1"}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Inner decoration ring */}
              <circle
                cx={clockCx}
                cy={clockCy}
                r={clockRadius - 30}
                fill="none"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
              />

              {/* Progress ring */}
              <circle
                cx={clockCx}
                cy={clockCy}
                r={clockRadius - 10}
                fill="none"
                stroke={arcColor}
                strokeWidth="7"
                strokeDasharray={clockCircumference}
                strokeDashoffset={clockCircumference * (1 - progress)}
                strokeLinecap="round"
                opacity="0.55"
                style={{
                  transition: "stroke-dashoffset 1s linear",
                }}
              />

              {/* Center dot */}
              <circle cx={clockCx} cy={clockCy} r="5" fill={arcColor} opacity="0.65" />
            </svg>

            {/* Time display - overlaid on clock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.h1
                  key={time}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-[130px] font-light tracking-tighter text-white/75 font-mono leading-none"
                >
                  {formatTime(time)}
                </motion.h1>
              </div>
            </div>
          </div>

          {/* Mode label */}
          <motion.div
            animate={{
              opacity: isRunning ? [0.5, 0.65, 0.5] : 0.45,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12 text-center"
          >
            <p className={`text-base font-light tracking-widest uppercase ${labelColor}`}>
              {mode === "focus" ? tr.stayFocused : tr.timeToRelax}
            </p>

            {/* Ambient status line */}
            <motion.div
              animate={{
                opacity: isRunning ? [0.25, 0.4, 0.25] : 0.15,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mt-3 h-px mx-auto w-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${arcColor}, transparent)`,
              }}
            />
          </motion.div>

          {/* Status indicator */}
          <motion.div
            animate={{
              opacity: isRunning ? [0.4, 0.6, 0.4] : 0.35,
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8 flex items-center gap-2 text-xs text-white/40 font-light tracking-wider"
          >
            <motion.div
              animate={{
                boxShadow: isRunning ? [
                  `0 0 6px ${arcColor}88`,
                  `0 0 12px ${arcColor}cc`,
                  `0 0 6px ${arcColor}88`,
                ] : "none",
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: isRunning ? arcColor : "rgba(255,255,255,0.15)",
                opacity: isRunning ? 0.8 : 0.4,
              }}
            />
            <span className="uppercase tracking-widest">
              {isRunning ? (mode === "focus" ? "FOCUSING" : "RELAXING") : "STANDBY"}
            </span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Normal mode: original circular display
  return (
    <div className="relative flex items-center justify-center mb-6" style={{ width: svgSize, height: svgSize, maxWidth: "100%" }}>
      {/* Ambient glow */}
      <div
        className="absolute rounded-full blur-3xl transition-all duration-1000"
        style={{
          width: radius * 1.4,
          height: radius * 1.4,
          background: glowColor,
          opacity: isRunning ? 0.22 : 0.08,
        }}
      />

      {/* SVG ring */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="white"
          strokeOpacity="0.06"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.8s ease" }}
          filter="url(#arcGlow)"
        />
        <defs>
          <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl sm:text-7xl font-light tracking-tight text-white font-mono">
          {formatTime(time)}
        </h1>
        <p className={`mt-2 text-[10px] font-medium tracking-[0.32em] uppercase ${labelColor}`}>
          {mode === "focus" ? tr.stayFocused : tr.timeToRelax}
        </p>
      </div>
    </div>
  );
}
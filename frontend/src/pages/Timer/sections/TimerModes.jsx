import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

export default function TimerModes({ mode, switchMode }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative flex gap-2 bg-white/8 border border-white/10 rounded-2xl p-1.5 shadow-lg shadow-purple-900/20 backdrop-blur">
        {/* Focus */}
        <button
          onClick={() => switchMode("focus")}
          className={`relative z-10 px-5 py-2.5 flex items-center gap-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
            mode === "focus"
              ? "text-white"
              : "text-violet-300/70 hover:text-violet-300"
          }`}
        >
          {mode === "focus" && (
            <motion.div
              layoutId="modeBackground"
              className="absolute inset-0 bg-linear-to-r from-purple-500/30 to-purple-600/20 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z" />
            <path d="M12 8V13" />
            <path d="M9 2H15" />
          </svg>
          <span>Focus</span>
        </button>

        {/* Break */}
        <button
          onClick={() => switchMode("break")}
          className={`relative z-10 px-5 py-2.5 flex items-center gap-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
            mode === "break"
              ? "text-white"
              : "text-violet-300/70 hover:text-violet-300"
          }`}
        >
          {mode === "break" && (
            <motion.div
              layoutId="modeBackground"
              className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-blue-600/20 rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M17.79 10.47V17.79C17.79 20.12 15.9 22 13.58 22H6.21C3.89 22 2 20.11 2 17.79V10.47C2 8.14 3.89 6.26 6.21 6.26H13.58C15.9 6.26 17.79 8.15 17.79 10.47Z" />
            <path d="M5.5 4V2.25" />
            <path d="M9.5 4V2.25" />
            <path d="M13.5 4V2.25" />
            <path d="M22 13.16C22 15.48 20.11 17.37 17.79 17.37V8.95C20.11 8.95 22 10.83 22 13.16Z" />
            <path d="M2 12H17.51" />
          </svg>
          <span>Break</span>
        </button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

export default function TimerModes({ mode, switchMode }) {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative flex bg-[#9B7EDE33] rounded-full p-1">
        {/* Sliding Background */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute top-1 bottom-1 w-1/2 rounded-full ${
            mode === "focus" ? "left-1 bg-primary-dark" : "left-1/2 bg-white"
          }`}
        />

        {/* Focus */}
        <button
          onClick={() => switchMode("focus")}
          className="relative z-10 px-6 py-2 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke={mode === "focus" ? "#fff" : "#D1D5DB"}
            strokeWidth="1.5"
          >
            <path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z" />
            <path d="M12 8V13" />
            <path d="M9 2H15" />
          </svg>

          <span className={mode === "focus" ? "text-white" : "text-gray-300"}>
            Focus
          </span>
        </button>

        {/* Break */}
        <button
          onClick={() => switchMode("break")}
          className="relative z-10 px-6 py-2 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke={mode === "break" ? "#000" : "#D1D5DB"}
            strokeWidth="1.5"
          >
            <path d="M17.79 10.47V17.79C17.79 20.12 15.9 22 13.58 22H6.21C3.89 22 2 20.11 2 17.79V10.47C2 8.14 3.89 6.26 6.21 6.26H13.58C15.9 6.26 17.79 8.15 17.79 10.47Z" />
            <path d="M5.5 4V2.25" />
            <path d="M9.5 4V2.25" />
            <path d="M13.5 4V2.25" />
            <path d="M22 13.16C22 15.48 20.11 17.37 17.79 17.37V8.95C20.11 8.95 22 10.83 22 13.16Z" />
            <path d="M2 12H17.51" />
          </svg>

          <span className={mode === "break" ? "text-black" : "text-gray-300"}>
            Break
          </span>
        </button>
      </div>
    </div>
  );
}

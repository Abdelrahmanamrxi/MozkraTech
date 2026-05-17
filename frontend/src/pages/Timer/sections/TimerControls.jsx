export default function TimerControls({
  isRunning,
  onPlayPause,
  onReset,
}) {
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6">
      {/* Play / Pause */}
      <button
        onClick={onPlayPause}
        className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/50 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        {isRunning ? (
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 5V19M16 5V19" />
          </svg>
        ) : (
          <svg
            className="w-7 h-7"
            viewBox="0 0 32 32"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.3 16V11.25C5.3 5.36 9.5 2.94 14.6 5.9L22.8 10.64C27.96 13.58 27.96 18.41 22.8 21.36L14.6 26.1C9.5 29.05 5.3 26.64 5.3 20.74V16Z" />
          </svg>
        )}
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-[#52466B] text-white shadow-lg shadow-black/30 hover:shadow-lg hover:shadow-purple-700/40 hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 transition-all duration-200"
      >
        <svg
          className="w-7 h-7"
          viewBox="0 0 32 32"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.1 6.7C13.3 6.4 14.5 6.2 16 6.2C22.4 6.2 27.5 11.3 27.5 17.7C27.5 24.1 22.4 29.3 16 29.3C9.6 29.3 4.4 24.1 4.4 17.7C4.4 15.3 5.1 13.1 6.3 11.3" />
          <path d="M10.5 7.1L14.3 2.7" />
          <path d="M10.5 7.1L15 10.3" />
        </svg>
      </button>
    </div>
  );
}

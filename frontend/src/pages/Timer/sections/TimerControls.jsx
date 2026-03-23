export default function TimerControls({
  isRunning,
  setIsRunning,
  setTime,
  duration,
}) {
  return (
    <div className="flex justify-center items-center gap-6 mt-4">
      {/* Play / Pause */}
      <button
        onClick={() => setIsRunning((prev) => !prev)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-105 transition"
      >
        {isRunning ? (
          <svg
            className="w-6 h-6"
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
            className="w-6 h-6"
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
        onClick={() => {
          setIsRunning(false);
          setTime(duration);
        }}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-[#52466B] text-white shadow-lg hover:scale-105 transition"
      >
        <svg
          className="w-6 h-6"
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

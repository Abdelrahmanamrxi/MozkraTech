function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function TimerDisplay({ time, mode }) {
  return (
    <div className="mb-8">
      <h1 className="text-7xl sm:text-8xl font-light tracking-tight text-white mb-4 font-mono">{formatTime(time)}</h1>
      <p className={`text-sm font-light tracking-wide uppercase ${mode === "focus" ? "text-emerald-300/80" : "text-blue-300/80"}`}>
        {mode === "focus" ? "Stay Focused" : "Time to Relax"}
      </p>
    </div>
  );
}

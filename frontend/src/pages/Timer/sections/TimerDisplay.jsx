function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function TimerDisplay({ time, mode }) {
  return (
    <div className="mb-6">
      <h1 className="text-6xl font-bold text-white">{formatTime(time)}</h1>
      <p className="text-violet-300 mt-2">
        {mode === "focus" ? "Time To Focus" : "Time To Relax"}
      </p>
    </div>
  );
}

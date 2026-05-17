export default function ProgressBar({ time, duration }) {
  const safeDuration = Math.max(duration || 0, 1);
  const progress = Math.min(100, Math.max(0, ((safeDuration - time) / safeDuration) * 100));

  return (
    <div className="w-full mb-6">
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div
          className="h-2 bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-purple-500/40"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

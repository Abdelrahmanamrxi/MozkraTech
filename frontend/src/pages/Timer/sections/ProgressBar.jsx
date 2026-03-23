export default function ProgressBar({ time, duration }) {
  const progress = ((duration - time) / duration) * 100;

  return (
    <div className="w-full h-2 bg-primary rounded-full mb-6">
      <div
        className="h-2 bg-primary-dark rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

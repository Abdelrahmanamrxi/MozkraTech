

const Diff = ({ value }) => {
  if (!value) return null;
  const isPos = value > 0;
  return (
    <span
      className={`text-xs font-medium flex items-center gap-0.5 ${isPos ? "text-green-400" : "text-red-400"}`}
    >
      {isPos ? "↑" : "↓"} {Math.abs(value)}%
    </span>
  );
};


const StatCard = ({ icon, value, label, diff }) => (
  <div className="flex flex-col bg-[#3D3555]/50 p-3 rounded-[16px] gap-1">
    <div className="flex items-center justify-between">
      <span className="text-purple-300/60">{icon}</span>
      {diff !== undefined && <Diff value={diff} />}
    </div>
    <p className="text-white font-bold text-2xl leading-tight">{value}</p>
    <p className="text-purple-300/50 text-sm">{label}</p>
  </div>
);

export default StatCard

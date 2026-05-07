const TimeRuler = ({ HOUR_TICKS, GRID_HEIGHT, hourToPx, fmtHourLabel }) => {
  return (
    <div
      className="relative flex-shrink-0 w-16 mt-[54px] pointer-events-none"
      style={{ height: GRID_HEIGHT }}
    >
      {HOUR_TICKS.map((h) => (
        <div
          key={h}
          style={{ top: hourToPx(h) - 8 }}
          className="absolute right-2 text-[9px] leading-none text-[#B8A7E5]/60 select-none whitespace-nowrap"
        >
          {fmtHourLabel(h)}
        </div>
      ))}
    </div>
  );
};

export default TimeRuler;

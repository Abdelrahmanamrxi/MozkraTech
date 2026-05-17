const TimeRuler = ({ HOUR_TICKS, GRID_HEIGHT, hourToPx, fmtHourLabel,headerHeight }) => {
  return (
    <div className="flex-shrink-0 w-16 pointer-events-none flex flex-col">
      {/* This spacer must match DayHeader's exact height */}
      <div style={{ height: headerHeight }}/>

      <div className="relative" style={{ height: GRID_HEIGHT }}>
        {HOUR_TICKS.map((h) => (
          <div
            key={h}
            style={{
              top: hourToPx(h),
              transform: "translateY(-50%)",
            }}
            className="absolute right-2 text-[9px] leading-none text-[#B8A7E5]/60 select-none whitespace-nowrap"
          >
            {fmtHourLabel(h)}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TimeRuler

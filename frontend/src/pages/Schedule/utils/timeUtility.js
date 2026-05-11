
// GRID CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const TIME_START_HOUR = 8;
export const TIME_END_HOUR   = 24;
export const HOUR_HEIGHT_PX  = 80;
export const SNAP_MINUTES    = 30;

export const TOTAL_HOURS = TIME_END_HOUR - TIME_START_HOUR;
export const GRID_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT_PX;

export const HALF_TICKS = Array.from(
  { length: TOTAL_HOURS * 2 + 1 },
  (_, i) => TIME_START_HOUR + i * 0.5
);
export const HOUR_TICKS = HALF_TICKS.filter((h) => Number.isInteger(h));




// ─────────────────────────────────────────────────────────────────────────────
// TIME UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
export function parseTimeToHours(str = "") {
  const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return TIME_START_HOUR;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h + min / 60;
}

export function parseDurationToHours(str = "") {
  const h = str.match(/([\d.]+)h/i);
  const m = str.match(/([\d.]+)m/i);
  return (h ? parseFloat(h[1]) : 0) + (m ? parseFloat(m[1]) / 60 : 0) || 1;
}

export function hourToPx(hour)     { return (hour - TIME_START_HOUR) * HOUR_HEIGHT_PX; }

export function pxToSnappedHour(px) {
  const raw     = TIME_START_HOUR + px / HOUR_HEIGHT_PX;
  const step    = SNAP_MINUTES / 60;
  const snapped = Math.round(raw / step) * step;
  return Math.max(TIME_START_HOUR, Math.min(TIME_END_HOUR - step, snapped));
}

export function fmtHourLabel(h) {
  const h12  = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${h12}:00 ${ampm}`;
}

export function hoursToTimeString(h) {
  const hour24 = Math.floor(h);
  const mins   = Math.round((h - hour24) * 60);
  const ampm   = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${String(mins).padStart(2,"0")} ${ampm}`;
}

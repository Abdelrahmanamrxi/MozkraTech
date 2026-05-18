import {differenceInMinutes} from "date-fns"
// GRID CONFIG
// ─────────────────────────────────────────────────────────────────────────────
export const TIME_START_HOUR = 0;
export const TIME_END_HOUR   = 23;
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
  // Handle ISO date strings as local time for display
  if (str && (str.includes("T") || str.includes("-"))) {
    const date = new Date(str);
    if (!Number.isNaN(date.getTime())) {
      return date.getHours() + date.getMinutes() / 60;
    }
  }
  // Handle 24h "HH:MM" format
  const hhmm = str.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (hhmm) {
    const h = parseInt(hhmm[1], 10);
    const m = parseInt(hhmm[2], 10);
    return h + m / 60;
  }
  // Handle "HH:MM AM/PM" format
  const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return TIME_START_HOUR;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h + min / 60;
}

export function formatIsoTimeLabel(str = "", locale = "en-US") {
  if (!str) return str;
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return str;
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatIsoDateLabel(str = "", locale = "en-US") {
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return str;
  return date.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

export function fmtHourLabel(h, locale = "en-US") {
  const date = new Date();
  date.setHours(h, 0, 0, 0);
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function hoursToTimeString(h, locale = "en-US") {
  const hour24 = Math.floor(h);
  const mins = Math.round((h - hour24) * 60);
  const date = new Date();
  date.setHours(hour24, mins, 0, 0);
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const formatDuration = (startTime, endTime, options = {}) => {
  const {
    hourLabel = "h",
    minuteLabel = "m",
    formatNumber = (value) => value,
  } = options;
  const minutes = differenceInMinutes(
    new Date(endTime),
    new Date(startTime)
  );

  const hours = minutes / 60;

  // exact hour
  if (minutes % 60 === 0) {
    return `${formatNumber(hours)}${hourLabel}`;
  }

  // less than 1 hour
  if (hours < 1) {
    return `${formatNumber(minutes)}${minuteLabel}`;
  }

  // decimal hours
  return `${formatNumber(Number(hours.toFixed(1)))}${hourLabel}`;
};

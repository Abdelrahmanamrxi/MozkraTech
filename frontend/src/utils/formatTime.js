export function formatRelativeTime(timestamp, t, language = 'en') {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = Math.max(0, now - date);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  // If no translation function provided, use default English
  if (!t) {
    if (diffSeconds < 30) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 2) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    if (diffHours < 2) return '1 hr ago';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  // Use translation function
  if (diffSeconds < 30) return t('time.justNow');
  if (diffSeconds < 60) return t('time.secondsAgo', { count: diffSeconds });
  if (diffMinutes < 2) return t('time.oneMinuteAgo');
  if (diffMinutes < 60) return t('time.minutesAgo', { count: diffMinutes });
  if (diffHours < 2) return t('time.oneHourAgo');
  if (diffHours < 24) return t('time.hoursAgo', { count: diffHours });
  if (diffDays === 1) return t('time.oneDayAgo');
  if (diffDays <= 7) return t('time.daysAgo', { count: diffDays });
  
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

/* ── helpers ── */
export function to24(time12) {
  const [time, period] = time12.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function to12(time24) {
  let [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${period}`;
}

export function calcDuration(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) return "—";
  const h = Math.floor(diff / 60);
  const min = diff % 60;
  return h > 0 ? (min > 0 ? `${h}h ${min}m` : `${h}h`) : `${min}m`;
}

const pad2 = (value) => String(value).padStart(2, "0");

export function toLocalDateInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function toLocalDateTimeInputValue(date = new Date()) {
  return `${toLocalDateInputValue(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function isoToLocalDateInputValue(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return toLocalDateInputValue(date);
}

export function isoToLocalTimeInputValue(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function localDateTimeToUtcIso(dateString, timeString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = (timeString || "00:00").split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  return date.toISOString();
}

export function localDateTimeInputToUtcIso(value) {
  if (!value) return "";
  const [dateString, timeString] = value.split("T");
  return localDateTimeToUtcIso(dateString, timeString);
}

{/** This Utlity is for SessionForm */}
export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function formatTimeFrom24(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });
}

// Helper function to get day name from ISO string
export function getDayFromISO(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return daysOfWeek[date.getDay()];
}

// Helper function to calculate duration in hours
export function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "";
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  return `${diffHours.toFixed(1)}h`;
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
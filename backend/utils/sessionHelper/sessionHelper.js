import HttpException from "../HttpException.js";


export const hasSessionConflict = (existingSessions, newSession, excludeId = null) => {
  // Guard: make sure the incoming session has valid times
  const newStart = new Date(newSession.startTime).getTime();
  const newEnd   = new Date(newSession.endTime).getTime();

  if (isNaN(newStart) || isNaN(newEnd)) {
    throw new HttpException("Invalid session: startTime or endTime is missing or malformed.",400);
  }

  if (newEnd <= newStart) {
    throw new HttpException("Invalid session: endTime must be after startTime.",400);
  }

  const conflicting = existingSessions.find((session) => {
    // Skip the session being edited (so it doesn't conflict with itself)
    if (excludeId && session.id === excludeId) return false;

    const start = new Date(session.startTime).getTime();
    const end   = new Date(session.endTime).getTime();

    if (isNaN(start) || isNaN(end)) return false; // skip corrupt existing entries

    // Two sessions overlap when neither one fully ends before the other starts
    return newStart < end && newEnd > start;
  });

  if (conflicting) {
    const fmt = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // false for 24hr
    });
    throw new HttpException(
      `Schedule conflict: this session overlaps with "${conflicting.name || "another session"}" ` +
      `(${fmt(conflicting.startTime)} – ${fmt(conflicting.endTime)}).`,400
    );
  }
};
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(0, 0, 0, 0);
  d.setSeconds(0, 0, 0, 0);
  d.setMilliseconds(0);
  return d;
};

export const getDayDifference = (dateA, dateB) => {
  const diffMs = getStartOfDay(dateA) - getStartOfDay(dateB);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const checkUserStreak = async (user) => {
  const now = new Date();
  const today = getStartOfDay(now);
  const lastActivity = user.lastActivityDate ? getStartOfDay(user.lastActivityDate) : null;

  if (lastActivity && getDayDifference(today, lastActivity) === 1) {
    user.currentStreak = (user.currentStreak || 0) + 1;
    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  } else if (lastActivity && getDayDifference(today, lastActivity) === 0) {
    // already updated today; keep the current streak as is
  } else {
    user.currentStreak = 0;
  }

  user.lastActivityDate = now;
  await user.save();
};

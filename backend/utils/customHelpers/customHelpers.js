export const getStartOfDay = (date) => {
  const d = new Date(date);
  // This one line sets hours, mins, secs, and ms to 0
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getDayDifference = (dateA, dateB) => {
  const diffMs = getStartOfDay(dateA).getTime() - getStartOfDay(dateB).getTime();
  // Using Math.abs to ensure positive integers, though order usually matters here
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const checkUserStreak = async (user) => {
  const now = new Date();
  const today = getStartOfDay(now);
  
  if (!user.lastActivityDate) {
    // Brand new user or first activity ever
    user.currentStreak = 1;
  } else {
    const lastActivity = getStartOfDay(user.lastActivityDate);
    const diff = getDayDifference(today, lastActivity);

    if (diff === 1) {
      // It was yesterday, increment!
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else if (diff === 0) {
      // Already active today, do nothing
      return; 
    } else {
      // They missed at least one day
      user.currentStreak = 1;
    }
  }

  // Update records
  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  user.lastActivityDate = now;
  await user.save();
};
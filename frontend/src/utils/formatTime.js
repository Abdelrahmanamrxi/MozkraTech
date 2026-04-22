export function formatRelativeTime(timestamp, t) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = Math.max(0, now - date);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
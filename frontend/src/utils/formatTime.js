export function formatRelativeTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = Math.max(0, now - date)
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 30) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffMinutes < 2) return '1 min ago'
  if (diffMinutes < 60) return `${diffMinutes} mins ago`
  if (diffHours < 2) return '1 hr ago'
  if (diffHours < 24) return `${diffHours} hrs ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays <= 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
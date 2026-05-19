import { UserPlus, Bell,Medal,Flame,Eye,MessageCircleMore } from 'lucide-react'

export const eventStyles = {
  friend_request_received: {
    icon: UserPlus,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  friend_request_acceptance: {
    icon: UserPlus,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  system_announcement: {
    icon: Bell,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  streak_milestone_reached: {
    icon: Flame,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  achievement_unlocked: {
    icon: Medal,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  view_profile: {
    icon: Eye,
    color: 'text-slate-400',
    bg: 'bg-slate-900/20',
    border: 'border-slate-300',
  },
  message_received: {
    icon: MessageCircleMore,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
}

export const filterTypes = [
  { key: 'all', labelKey: 'navbar.notifications.filters.all', color: 'text-white', bg: 'bg-white/10' },
  { key: 'requests', labelKey: 'navbar.notifications.filters.requests', color: 'text-sky-400', bg: 'bg-sky-500/15' },
  { key: 'streak_milestone_reached', labelKey: 'navbar.notifications.filters.streaks', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { key: 'achievement_unlocked', labelKey: 'navbar.notifications.filters.achievements', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { key: 'view_profile', labelKey: 'navbar.notifications.filters.viewProfile', color: 'text-slate-500', bg: 'bg-slate-900' },
]

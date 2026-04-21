import { UserPlus, MessageCircle, Bell, Check, X, Clock } from 'lucide-react'


export const eventStyles = {
  friend_request_received: {
    title: 'Friend request',
    icon: UserPlus,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  friend_request_acceptance: {
    title: 'Friend request accepted',
    icon: UserPlus,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
  },
  system_announcement: {
    title: 'System',
    icon: Bell,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
  streak_milestone_reached: {
    title: 'Streak',
    icon: Bell,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  achievement_unlocked: {
    title: 'Achievement',
    icon: Bell,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  view_profile:{
    title:'View',
    icon:UserPlus,
    color:"text-slate-900",
    bg:"bg-slate-900/20",
    border:'border-slate-300'
  }
}

export const filterGroups = {
  requests: ['friend_request_received', 'friend_request_acceptance'],
  streak_milestone_reached: ['streak_milestone_reached'],
  achievement_unlocked: ['achievement_unlocked'],
  view_profile: ['view_profile'],
}

export const filterTypes = [
  { key: 'all', label: 'All', color: 'text-white', bg: 'bg-white/10' },
  { key: 'requests', label: 'Requests', color: 'text-sky-400', bg: 'bg-sky-500/15' },
  { key: 'streak_milestone_reached', label: 'Streaks', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  { key: 'achievement_unlocked', label: 'Achievements', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { key:'view_profile', label:'Viewed Profile', color:'text-slate-500', bg:'bg-slate-900' }
]


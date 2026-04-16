import React, { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { UserPlus, X } from 'lucide-react'

const eventStyles = {
  friend_request_received: {
    title: 'Friend request received',
    accent: 'from-sky-500/30 to-blue-500/30',
    badge: 'bg-sky-500/15 text-sky-100 border border-sky-300/20',
    card: 'bg-slate-950/80 border-sky-500/20',
    hover: 'hover:bg-slate-900/95',
  },
  message_received: {
    title: 'Message received',
    accent: 'from-cyan-500/20 to-sky-500/20',
    badge: 'bg-cyan-400/15 text-cyan-100 border border-cyan-300/20',
    card: 'bg-slate-950/80 border-cyan-500/20',
    hover: 'hover:bg-slate-900/95',
  },
  system_announcement: {
    title: 'System announcement',
    accent: 'from-violet-500/20 to-indigo-500/20',
    badge: 'bg-violet-400/15 text-violet-100 border border-violet-300/20',
    card: 'bg-slate-950/80 border-violet-500/20',
    hover: 'hover:bg-slate-900/95',
  },
  streak_milestone_reached: {
    title: 'Streak milestone reached',
    accent: 'from-emerald-500/20 to-lime-500/20',
    badge: 'bg-emerald-400/15 text-emerald-100 border border-emerald-300/20',
    card: 'bg-slate-950/80 border-emerald-500/20',
    hover: 'hover:bg-slate-900/95',
  },
  achievement_unlocked: {
    title: 'Achievement unlocked',
    accent: 'from-yellow-400/20 to-amber-500/20',
    badge: 'bg-amber-400/15 text-amber-100 border border-amber-300/20',
    card: 'bg-slate-950/80 border-amber-500/20',
    hover: 'hover:bg-slate-900/95',
  },
}

const sampleNotifications = [
  {
    id: '1',
    eventType: 'friend_request_received',
    message: 'Yara wants to join your study group.',
    time: 'Just now',
    user: 'Yara',
  },
  {
    id: '2',
    eventType: 'message_received',
    message: 'Ali sent you a new message about today’s session.',
    time: '12m ago',
  },
  {
    id: '3',
    eventType: 'system_announcement',
    message: 'Maintenance is scheduled for tonight at 11 PM.',
    time: '1h ago',
  },
  {
    id: '4',
    eventType: 'streak_milestone_reached',
    message: 'You just hit a 7-day learning streak. Keep it going!',
    time: 'Yesterday',
  },
  {
    id: '5',
    eventType: 'achievement_unlocked',
    message: 'You unlocked the “Early Bird” achievement.',
    time: '2d ago',
  },
  {
    id: '6',
    eventType: 'message_received',
    message: 'Nora replied to your note in the group chat.',
    time: '3h ago',
  },
  {
    id: '7',
    eventType: 'friend_request_received',
    message: 'Omar sent a friend request to see your progress.',
    time: '4h ago',
    user: 'Omar',
  },
  {
    id: '8',
    eventType: 'streak_milestone_reached',
    message: 'You reached a 10-day practice streak. Amazing work!',
    time: '1d ago',
  },
  {
    id: '9',
    eventType: 'system_announcement',
    message: 'New study packs are now available in the dashboard.',
    time: '2d ago',
  },
  {
    id: '10',
    eventType: 'message_received',
    message: 'Sara checked in on your weekly goals.',
    time: '2d ago',
  },
  {
    id: '11',
    eventType: 'achievement_unlocked',
    message: 'You unlocked the “Focused Learner” badge for 3 sessions today.',
    time: '3d ago',
  },
  {
    id: '12',
    eventType: 'friend_request_received',
    message: 'Khalid wants to follow your progress updates.',
    time: '3d ago',
    user: 'Khalid',
  },
]

function Notifications({ setNotifications }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const notifications = useMemo(() => sampleNotifications, [])

  const overlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 backdrop-blur-3xl p-4"
      onClick={() => setNotifications(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.28, ease: 'easeInOut' } }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-2xl h-[85vh] overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 shadow-[0_48px_140px_rgba(8,10,31,0.85)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#1b1532]/95 via-[#2f2361]/70 to-[#090b18]/95" />
        <div className="relative flex h-full flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-slate-950/80 px-6 py-6 backdrop-blur-3xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/80">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.35)]" />
                  <span className="rounded-full bg-slate-900/75 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    {notifications.length}
                  </span>
                  Notifications
                </div>
                <h2 className="text-3xl font-semibold text-white">Latest activity</h2>
                <p className="max-w-2xl text-sm text-slate-300/80">
                  Recent alerts and updates from your study journey, all in one polished glassy panel.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setNotifications(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 h-full overflow-y-scroll p-6 pr-4 custom-scrollbar">
            <div className="space-y-4">
              {notifications.map((item, index) => {
                const style = eventStyles[item.eventType] || eventStyles.system_announcement
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.04 }}
                    className={`group relative overflow-hidden rounded-[28px] border p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${style.card} ${style.hover}`}
                  >
                    <div className={`pointer-events-none absolute inset-0 bg-linear-to-r ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-60`} />
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-white/40 via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${style.badge}`}>
                            {item.eventType === 'friend_request_received' && (
                              <UserPlus className="h-4 w-4 text-sky-100" />
                            )}
                            {style.title}
                          </span>
                          <span className="text-xs text-slate-300/70">{item.time}</span>
                        </div>
                        <p className="text-base leading-6 text-slate-100">{item.message}</p>
                      </div>

                      {item.eventType === 'friend_request_received' ? (
                        <div className="flex flex-wrap gap-3 sm:justify-end">
                          <button
                            type="button"
                            className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-500/30"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 shadow-sm shadow-red-500/20 transition hover:bg-red-500/25"
                          >
                            Decline
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return document.body ? createPortal(overlay, document.body) : overlay
}

export default Notifications

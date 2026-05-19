import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Clock, X } from 'lucide-react'
import { eventStyles, filterTypes } from './notifications.constants'
import { formatRelativeTime } from '../../../../utils/formatTime'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useNotificationsList,
  useNotificationUnreadCount,
  useMarkNotificationsReadOnOpen,
} from '../../../../hooks/useNotifications'
import { getNotificationMessage } from './notificationMessage'

const DROPDOWN_WIDTH = 384

function Notifications({ setNotifications, bellRef, mobile = false, isOpen = true }) {
  const dropdownRef = useRef(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [anchorStyle, setAnchorStyle] = useState(null)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation(['common', 'friends', 'achievements'])
  const tAchievements = (key, opts) => t(key, { ...opts, ns: 'achievements' })
  const isRtl = i18n.dir() === 'rtl'
  const itemsPerPage = 5

  useMarkNotificationsReadOnOpen(isOpen)

  const unreadCount = useNotificationUnreadCount(true)
  const { data } = useNotificationsList({
    filter: selectedFilter,
    page: currentPage,
    isOpen,
  })

  const timeT = (key, opts) => t(key, { ...opts, ns: 'friends' })

  function notificationAction(payload, eventType) {
    if (eventType === 'view_profile') {
      navigate(`/dashboard/profile/${payload.viewerId}`)
    }
    if (eventType === 'friend_request_received') {
      navigate(`/dashboard/profile/${payload.senderId}`)
    }
  }

  useLayoutEffect(() => {
    if (mobile || !isOpen) {
      setAnchorStyle(null)
      return undefined
    }

    const updatePosition = () => {
      const anchor = bellRef?.current
      if (!anchor) return

      const rect = anchor.getBoundingClientRect()
      const rtl = document.documentElement.dir === 'rtl'

      let left = rtl
        ? rect.left
        : rect.right - DROPDOWN_WIDTH

      left = Math.max(12, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 12))

      setAnchorStyle({
        top: rect.bottom + 12,
        left,
        width: DROPDOWN_WIDTH,
      })
    }

    updatePosition()
    const raf = requestAnimationFrame(updatePosition)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [mobile, isOpen, bellRef, i18n.language])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!bellRef?.current || !bellRef.current.contains(event.target)) {
          setNotifications(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setNotifications, bellRef])

  const notifications = useMemo(
    () => data?.notifications ?? [],
    [data],
  )

  const totalPages = data?.totalPages ?? 1
  const totalDocs = data?.totalDocs ?? notifications.length
  const paginatedNotifications = notifications

  const filterOptions = filterTypes.map((filterType) => ({
    ...filterType,
    label: t(filterType.labelKey),
    count: filterType.key === 'all' ? totalDocs : undefined,
  }))

  const containerClasses = mobile
    ? 'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(82vw,340px)] max-h-[84vh]'
    : 'max-h-[600px]'

  const paginationFrom = (currentPage - 1) * itemsPerPage + 1
  const paginationTo = Math.min(currentPage * itemsPerPage, totalDocs)

  const panelInner = (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${containerClasses} overflow-hidden rounded-2xl border border-white/10 bg-primary-dark shadow-2xl shadow-black/50 backdrop-blur-xl`}
    >
      <motion.div className="sticky top-0 border-b border-white/10 bg-primary-dark/50 backdrop-blur-xl px-4 py-3 z-20">
        <motion.div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
          <motion.div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Bell className="h-5 w-5 text-white shrink-0" />
            <h3 className="text-sm font-semibold text-white">
              {t('navbar.notifications.title')}
            </h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-500/80 text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.div>
          <button
            onClick={() => setNotifications(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-200"
            aria-label={t('navbar.notifications.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>

      <div
        className="sticky top-12 border-b border-white/10 bg-primary-dark/30 backdrop-blur-xl px-3 py-2 overflow-x-auto scroll-smooth z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.filter-scroll::-webkit-scrollbar { display: none; }`}</style>
        <motion.div className={`flex gap-2 min-w-min filter-scroll ${isRtl ? 'flex-row-reverse' : ''}`}>
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => {
                setSelectedFilter(filter.key)
                setCurrentPage(1)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border
              ${selectedFilter === filter.key
                ? `${filter.bg} ${filter.color} border-current/50`
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
            >
              {filter.label} {filter.count > 0 && <span className="ms-1">({filter.count})</span>}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="max-h-95 overflow-y-auto custom-scrollbar">
        {paginatedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-12 w-12 text-white/20 mb-3" />
            <p className="text-sm text-white/50">{t('navbar.notifications.empty')}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {paginatedNotifications.map((notification, index) => {
                const style = eventStyles[notification.eventType] || eventStyles.system_announcement
                const Icon = style.icon
                const displayMessage = getNotificationMessage(notification, t, tAchievements)

                return (
                  <motion.div
                    onClick={() => notificationAction(notification.payload, notification.eventType)}
                    key={notification._id}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                    className={`group relative px-4 py-3 transition-all duration-200 hover:bg-white/5 cursor-pointer ${!notification.isRead ? 'bg-white/2' : ''}`}
                  >
                    <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <motion.div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} border ${style.border}`}>
                        <Icon className={`h-5 w-5 ${style.color}`} />
                      </motion.div>

                      <motion.div className="flex-1 min-w-0">
                        <motion.div className={`flex items-start justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <p className="text-sm text-white leading-5 wrap-break-word text-start flex-1">
                            {displayMessage}
                          </p>
                          {!notification.isRead && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                            />
                          )}
                        </motion.div>
                        <span className={`mt-1 inline-flex items-center gap-1 text-xs text-white/50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatRelativeTime(notification.createdAt, timeT, i18n.language)}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 bg-primary-dark/30 backdrop-blur-xl px-4 py-3 space-y-2"
        >
          <motion.div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-white/50">
              {t('navbar.notifications.pagination', {
                from: paginationFrom,
                to: paginationTo,
                total: totalDocs,
              })}
            </span>
            <motion.div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded text-xs font-semibold text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isRtl ? `${t('navbar.notifications.prev')} →` : `← ${t('navbar.notifications.prev')}`}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded text-xs font-semibold text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isRtl ? `← ${t('navbar.notifications.next')}` : `${t('navbar.notifications.next')} →`}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )

  if (mobile) return panelInner

  if (!anchorStyle) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: anchorStyle.top,
        left: anchorStyle.left,
        width: anchorStyle.width,
        zIndex: 9999,
      }}
    >
      {panelInner}
    </div>,
    document.body,
  )
}

export default Notifications

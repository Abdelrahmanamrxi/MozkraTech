import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, MessageCircle, Bell, Check, X, Clock } from 'lucide-react'
import { eventStyles } from './notifications.constants'
import api from '../../../../middleware/api'
import {useQuery} from "@tanstack/react-query"
import { filterTypes } from './notifications.constants'
import { formatRelativeTime } from '../../../../utils/formatTime'
import {useNavigate} from 'react-router-dom'
// Event styles with icon, color, and background for each notification type

// Sample notifications - limited to 5






async function getNotifications(selectedFilter,currentPage){
  const response = await api.get(`/notifications`, {
    params: {
      filter: selectedFilter,
      page: currentPage
    }
  })
  return response.data
}

/**
 * Notifications Component
 * Facebook-style dropdown notification popup
 * 
 * Props:
 * - setNotifications: Function to toggle notification visibility
 * - bellRef: Reference to bell icon element for positioning
 */
function Notifications({ setNotifications, bellRef, mobile = false }) {
  const dropdownRef = useRef(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate=useNavigate()
  const itemsPerPage = 5

  const {data} = useQuery({
    queryKey:['notifications',selectedFilter,currentPage],
    queryFn:()=>getNotifications(selectedFilter,currentPage),
    retry:1
  })

 console.log(data)
  function notificationAction(payload,eventType){
    if(eventType==="view_profile"){
      navigate(`/dashboard/profile/${payload.viewerId}`)
    }
    if(eventType==="friend_request_received"){
      navigate(`/dashboard/profile/${payload.senderId}`)
    }
  }

  // Close dropdown when clicking outside
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

  // Use API notifications when available
  const notifications = useMemo(
    () => data?.notifications ?? [],
    [data]
  )
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  // API already applies filtering and paging
  const totalPages = data?.totalPages ?? 1
  const totalDocs = data?.totalDocs ?? notifications.length
  const paginatedNotifications = notifications

  // Get filter options with counts based on API totalDocs only for All
  const filterOptions = filterTypes.map(t => ({
    ...t,
    count: t.key === 'all' ? totalDocs : undefined
  }))

  const containerClasses = mobile
    ? 'fixed left-[34%] top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(82vw,340px)] max-h-[84vh]'
    : 'absolute right-0 top-full mt-3 w-96 max-h-[600px]'

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${containerClasses} overflow-hidden rounded-2xl border border-white/10 bg-primary-dark shadow-2xl shadow-black/50 backdrop-blur-xl`}
    >
      {/* Header with bell icon, title, count and close button */}
      <div className="sticky top-0 border-b border-white/10 bg-primary-dark/50 backdrop-blur-xl px-4 py-3 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-white" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full 
              bg-red-500/80 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setNotifications(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg 
            border border-white/10 bg-white/5 text-white/60 
            hover:bg-white/10 hover:text-white transition-colors duration-200"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter buttons - scrollable with hidden scrollbar */}
      <div className="sticky top-12 border-b border-white/10 bg-primary-dark/30 backdrop-blur-xl px-3 py-2 overflow-x-auto scroll-smooth z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .filter-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex gap-2 min-w-min filter-scroll">
          {filterOptions.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => {
                setSelectedFilter(filter.key)
                setCurrentPage(1)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap 
              transition-all duration-200 border
              ${selectedFilter === filter.key 
                ? `${filter.bg} ${filter.color} border-current/50` 
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
            >
              {filter.label} {filter.count > 0 && <span className="ml-1">({filter.count})</span>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notifications List with smooth animations */}
      <div className="max-h-95 overflow-y-auto custom-scrollbar">
        {paginatedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-12 w-12 text-white/20 mb-3" />
            <p className="text-sm text-white/50">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {paginatedNotifications.map((notification, index) => {
              const style = eventStyles[notification.eventType] || eventStyles.system_announcement
              const Icon = style.icon
              return (
                <motion.div
                  onClick={()=>{notificationAction(notification.payload,notification.eventType)}}
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                  className={`group relative   px-4 py-3 transition-all duration-200 hover:bg-white/5
                  cursor-pointer ${!notification.read ? 'bg-white/2' : ''}`}
                >
                  <div className="flex gap-3">
                    {/* Icon with background */}
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center 
                      rounded-full ${style.bg} border ${style.border}`}>
                      <Icon className={`h-5 w-5 ${style.color}`} />
                    </div>

                    {/* Content section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-white leading-5 wrap-break-word">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                          />
                        )}
                      </div>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-white/50">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>

             
                 
                  </div>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer with pagination controls */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 bg-primary-dark/30 backdrop-blur-xl px-4 py-3 space-y-2"
        >
          {/* Pagination info and controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalDocs)} of {totalDocs}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded text-xs font-semibold text-white/60 bg-white/5 
                border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed 
                transition-all duration-200"
              >
                ← Prev
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded text-xs font-semibold text-white/60 bg-white/5 
                border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed 
                transition-all duration-200"
              >
                Next →
              </motion.button>
            </div>
          </div>

          {/* View all link */}
   
        </motion.div>
      )}
    </motion.div>
  )
}

export default Notifications

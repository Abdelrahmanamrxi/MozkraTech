/* eslint-disable no-unused-vars */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function SessionForm({setShowAddSessionPopup}) {
      const { t } = useTranslation('schedule');
      const dayMap = { 
        'Monday': 'monday', 
        'Tuesday': 'tuesday', 
        'Wednesday': 'wednesday', 
        'Thursday': 'thursday', 
        'Friday': 'friday', 
        'Saturday': 'saturday', 
        'Sunday': 'sunday' 
      };
      const [subject, setSubject] = useState("")
      const [hour, setHour] = useState("09")
      const [minute, setMinute] = useState("00")
      const [duration, setDuration] = useState("")
      const [amPm, setAmPm] = useState('AM');
      const [day, setDay] = useState('Monday');
    const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  return (
    <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSessionPopup(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-primary-dark/60 font-Inter backdrop-blur-2xl border border-white/20 rounded-[24px] p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">{t('title')}</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddSessionPopup(false)}
                    className="p-2 hover:bg-white/10 cursor-pointer rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-[#B8A7E5]" />
                  </motion.button>
                </div>
<div>
  <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">{t('subjectLabel')}</label>
  <input
    type="text"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    placeholder={t('subjectPlaceholder')}
    className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all"
  />
</div>

{/* Time Picker */}
<div className="mt-6">
  <label className="text-sm text-[#B8A7E5] mb-3 block font-medium">{t('time')}</label>
  <div className="flex gap-3 items-center">
    <div className="flex-1 relative">
      <input
        type="number"
        value={hour}
        onChange={(e) => setHour(String(Math.max(1, Math.min(12, parseInt(e.target.value) || 1))).padStart(2, '0'))}
        onWheel={(e) => e.preventDefault()}
        min="1"
        max="12"
        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-3 py-3 text-white text-center font-semibold focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all [appearance:textfield]"
      />
      <span className="absolute -bottom-5 left-0 right-0 text-center text-xs text-[#B8A7E5]/60">{t('hour')}</span>
      
    </div>

    <div className="text-2xl text-[#B8A7E5]/50 font-light">:</div>

    <div className="flex-1 relative">
      <input
        type="number"
        value={minute}
        onChange={(e) => setMinute(String(Math.max(0, Math.min(59, parseInt(e.target.value) || 0))).padStart(2, '0'))}
        onWheel={(e) => e.preventDefault()}
        min="0"
        max="59"
        step="5"
        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-3 py-3 text-white text-center font-semibold focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all [appearance:textfield]"
      />
      <span className="absolute -bottom-5 left-0 right-0 text-center text-xs text-[#B8A7E5]/60">{t('minute')}</span>
    </div>

    {/* AM/PM Toggle */}
    <div className="flex gap-1 bg-white/5 rounded-[12px] p-1 border border-white/10">
      <button
        onClick={() => setAmPm('AM')}
        className={`px-3 py-2 rounded-[8px] text-sm font-semibold transition-all ${
          amPm === 'AM'
            ? 'bg-[#B8A7E5]/30 text-[#B8A7E5] border border-[#B8A7E5]/50'
            : 'text-white/50 hover:text-white/70'
        }`}
      >
        AM
      </button>
      <button
        onClick={() => setAmPm('PM')}
        className={`px-3 py-2 rounded-[8px] text-sm font-semibold transition-all ${
          amPm === 'PM'
            ? 'bg-[#B8A7E5]/30 text-[#B8A7E5] border border-[#B8A7E5]/50'
            : 'text-white/50 hover:text-white/70'
        }`}
      >
        PM
      </button>
    </div>

    <div className="text-white/50 text-sm font-medium min-w-fit">{hour}:{minute} {amPm}</div>
  </div>
  
</div>

{/* Duration */}
<div className="mt-6">
  <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">{t('durationLabel')}</label>
  <div className="relative">
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      onWheel={(e) => e.preventDefault()}
      step="0.5"
      min="0.5"
      max="24"
      placeholder="2"
      className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all pr-12 [appearance:textfield]"
    />
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8A7E5]/50 text-sm font-medium">{t('hoursSuffix')}</span>
  </div>
</div>

{/* Day Selector - Custom Dropdown */}
<div className="mt-6">
  <label className="text-sm text-[#B8A7E5] mb-2 block font-medium">{t('dayLabel')}</label>
  <div className="relative">
    <button
      onClick={() => setDayDropdownOpen(!dayDropdownOpen)}
      className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] px-4 py-3 text-white font-medium focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-[#B8A7E5]/30 outline-none transition-all cursor-pointer flex justify-between items-center"
    >
      <span>{t(dayMap[day])}</span>
      <svg
        className={`w-4 h-4 text-[#B8A7E5] transition-transform ${dayDropdownOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>

    {dayDropdownOpen && (
    
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-[12px] overflow-hidden z-50 shadow-lg">
  <div className="max-h-48 overflow-y-auto">
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
      <button
        key={d}
        onClick={() => {
          setDay(d)
          setDayDropdownOpen(false)
        }}
        className={`w-full px-4 py-3 text-left font-medium transition-all ${
          day === d
            ? 'bg-[#B8A7E5]/30 text-[#B8A7E5] border-l-2 border-[#B8A7E5]'
            : 'text-white hover:bg-white/10'
        }`}
      >
        {t(dayMap[d])}
      </button>
    ))}
  </div>
</div>
    )}
  </div>
</div>
                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddSessionPopup(false)}
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-[#B8A7E5] rounded-lg hover:bg-white/20 transition-all font-medium"
                  >
                    {t('cancel')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddSessionPopup(false)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    {t('submit')}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
  )
}

export default SessionForm

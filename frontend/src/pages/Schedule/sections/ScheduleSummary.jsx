/* eslint-disable no-unused-vars */
import React from 'react'
import { FilterIcon, ScheduleIcon, OpenBookIcon, CalenderIcon, TipBackgroundIcon } from "@/comp/ui/Icons"
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function ScheduleSummary() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';
  const labels = {
    en: {
      week: 'This Week',
      studyHours: 'Study Hours',
      avgDaily: 'Average Daily',
      studyTime: 'Study Time',
      subjects: 'Subjects',
      activeCourses: 'Active Courses',
      upcoming: 'Upcoming',
      deadlines: 'Deadlines',
    },
    ar: {
      week: 'الأسبوع ده',
      studyHours: 'ساعات مذاكرة',
      avgDaily: 'المعدل اليومي',
      studyTime: 'وقت مذاكرة',
      subjects: 'المواد',
      activeCourses: 'الكورسات الشغّالة',
      upcoming: 'الجاي',
      deadlines: 'المواعيد النهائية',
    },
  };

  return (
      <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-row mt-6 lg:gap-3">
          <div className="flex bg-[#9B7EDE]/20 flex-col items-start border-t border-[#9B7EDE]/30 rounded-[24px] font-Inter lg:w-1/4 p-6">
            <ScheduleIcon />
            <p className="text-sm text-[#B8A7E5] mt-3">{labels[lang].week}</p>
            <p className="font-bold text-white mt-2 text-2xl">28</p>
            <p className="text-[#B8A7E5]">{labels[lang].studyHours}</p>
          </div>
          <div className="flex bg-[#7C5FBD]/20 flex-col items-start border-t border-[#7C5FBD]/30 rounded-[24px] font-Inter lg:w-1/4 p-6">
            <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.0003 29.3333C23.3641 29.3333 29.3337 23.3638 29.3337 16C29.3337 8.6362 23.3641 2.66666 16.0003 2.66666C8.63653 2.66666 2.66699 8.6362 2.66699 16C2.66699 23.3638 8.63653 29.3333 16.0003 29.3333Z"
                stroke="#7C5FBD"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M16 8V16L21.3333 18.6667" stroke="#7C5FBD" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-[#B8A7E5] mt-3">{labels[lang].avgDaily}</p>
            <p className="font-bold text-white mt-2 text-2xl">4h</p>
            <p className="text-[#B8A7E5]">{labels[lang].studyTime}</p>
          </div>

          <div className="flex bg-[#3D3555] flex-col items-start border-t border-[#7C5FBD]/20 rounded-[24px] font-Inter lg:w-1/4 p-6">
            <OpenBookIcon />
            <p className="text-sm text-[#B8A7E5] mt-3">{labels[lang].subjects}</p>
            <p className="font-bold text-white mt-2 text-2xl">8</p>
            <p className="text-[#B8A7E5]">{labels[lang].activeCourses}</p>
          </div>

          <div className="flex bg-[#3D3555] flex-col items-start border-t border-[#7C5FBD]/20 rounded-[24px] font-Inter lg:w-1/4 p-6">
            <ScheduleIcon />
            <p className="text-sm text-[#B8A7E5] mt-3">{labels[lang].upcoming}</p>
            <p className="font-bold text-white mt-2 text-2xl">5</p>
            <p className="text-[#B8A7E5]">{labels[lang].deadlines}</p>
          </div>
        </div>
  )
}

export default ScheduleSummary

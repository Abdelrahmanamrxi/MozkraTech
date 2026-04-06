/* eslint-disable no-unused-vars */
import Body from "../../comp/layout/Body"
import { FilterIcon, TipBackgroundIcon } from "../../comp/ui/Icons"
import { PlusIcon } from "lucide-react"
import { motion,AnimatePresence } from "framer-motion"
import SessionCard from "./sections/SessionCard"
import ScheduleSummary from "./sections/ScheduleSummary"
import { useState } from "react"
import SessionForm from "./sections/SessionForm"
import { useTranslation } from "react-i18next"

const scheduleData = {
  Monday: [
    { time: "8:00 AM", subject: "Data Structures", duration: "2h", color: "bg-[#9B7EDE]" },
    { time: "11:00 AM", subject: "Web Development", duration: "1.5h", color: "bg-[#7C5FBD]" }
  ],
  Tuesday: [
    { time: "9:00 AM", subject: "Algorithm Design", duration: "2h", color: "bg-[#9B7EDE]" },
    { time: "1:00 PM", subject: "Database Systems", duration: "2h", color: "bg-[#7C5FBD]" },
  ],
  Wednesday: [
    { time: "8:00 AM", subject: "Computer Networks", duration: "2h", color: "bg-[#9B7EDE]" },
    { time: "12:00 PM", subject: "English Literature", duration: "1h", color: "bg-[#7C5FBD]" },
    { time: "3:00 PM", subject: "Project Work", duration: "2h", color: "bg-[#52466B]" },
  ],
  Thursday: [
    { time: "10:00 AM", subject: "Software Engineering", duration: "2h", color: "bg-[#9B7EDE]" },
    { time: "2:00 PM", subject: "Mathematics", duration: "1.5h", color: "bg-[#7C5FBD]" },
  ],
  Friday: [
    { time: "9:00 AM", subject: "Operating Systems", duration: "2h", color: "bg-[#9B7EDE]" },
    { time: "1:00 PM", subject: "Group Study", duration: "2h", color: "bg-[#52466B]" },
  ],
  Saturday: [
     
  ],
  Sunday: [
    { time: "11:00 AM", subject: "Self Study", duration: "2h", color: "bg-[#52466B]" },
  ],
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]



const Schedule = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const labels = {
    en: {
      pageTitle: "My Schedule",
      pageSubtitle: "Plan and manage your study sessions",
      filterButton: "Filter",
      filterHeader: "Filter by Subject",
      addSession: "Add Task",
      weeklySchedule: "Weekly Schedule",
      noSessions: "No sessions scheduled",
      proTip: "Pro Tip",
      proTipText: "Schedule your most challenging subjects during your peak productivity hours. Most students perform best in the morning (8-11 AM) or late afternoon (3-5 PM). Try to align difficult topics with these time slots for optimal learning.",
      all: "All",
    },
    ar: {
      pageTitle: "جدولي",
      pageSubtitle: "نظم جلسات مذاكرتك وخطط ليها",
      filterButton: "فلتر",
      filterHeader: "فلتر بالمادة",
      addSession: "ضيف مهمة",
      weeklySchedule: "جدول الأسبوع",
      noSessions: "مفيش جلسات ",
      proTip: "نصيحة",
      proTipText: "حاول تحط أصعب المواد في ساعات النشاط بتاعتك. معظم الطلبة بيبقوا شغالين أحسن الصبح (8-11 ص) أو بعد الضهر (3-5 م). جمّع المواضيع الصعبة في الأوقات دي علشان تذاكر بشكل أفضل.",
      all: "الكل",
    },
  };
  const dayLabels = {
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
    Sunday: "الأحد",
  };
  const subjects = ["All", "Data Structures", "Web Development", "Mathematics", "Algorithm Design"];

  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [showAddSessionPopup, setShowAddSessionPopup] = useState(false)
  const [filterSubject, setFilterSubject] = useState("All")

  return (
     <Body>
      <section className="min-h-screen p-7 lg:p-14 pt-12 lg:pt-20 ">
         <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-col font-Inter gap-2">
            <p className="text-3xl font-semibold text-white ">{labels[lang].pageTitle}</p>
            <p className="text-xs text-[#B8A7E5]">{labels[lang].pageSubtitle}</p>
          </div>
          <div className="flex flex-row gap-3 mt-4 text-white relative">
            {/* Filter Button */}
            <motion.button
              onClick={() => setShowFilterPopup(!showFilterPopup)}
              whileHover={{
                scale: 1.08,
                backgroundColor: "#4a3f66",
                boxShadow: "0 0 20px rgba(155, 126, 222, 0.3)",
              }}
              whileTap={{
                scale: 0.94,
                y: 3,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              className="bg-[#3D3555] border-t cursor-pointer border-[#9B7EDE]/20 rounded-full flex flex-row gap-2 font-Inter text-sm items-center px-4 py-2 transition-all"
            >
              <FilterIcon />
              {labels[lang].filterButton}
            </motion.button>

            {/* Filter Popup */}
            <AnimatePresence>
              {showFilterPopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 bg-primary/20 backdrop-blur-xl border border-white/20 rounded-[16px] p-4 w-48 z-50 shadow-2xl"
                >
                  <p className="text-sm font-semibold text-w mb-3">{labels[lang].filterHeader}</p>
                  <div className="space-y-2">
                    {["All", "Data Structures", "Web Development", "Mathematics", "Algorithm Design"].map((subject) => (
                      <motion.button
                        key={subject}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        onClick={() => {
                          setFilterSubject(subject)
                          setShowFilterPopup(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filterSubject === subject
                            ? "bg-[#9B7EDE] text-white"
                            : "text-[#B8A7E5] hover:bg-white/10"
                        }`}
                      >
                        {subject === 'All' ? labels[lang].all : subject}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Session Button */}
            <motion.button
              onClick={() => setShowAddSessionPopup(true)}
              whileHover={{
                scale: 1.08,
                backgroundColor: "#b59ef7",
                boxShadow: "0 8px 32px rgba(155, 126, 222, 0.5)",
              }}
              whileTap={{
                scale: 0.94,
                y: 3,
                boxShadow: "0 2px 12px rgba(155, 126, 222, 0.3)",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              className="bg-[#9B7EDE] flex flex-row gap-2 cursor-pointer items-center px-4 py-2 rounded-full text-sm transition-all"
            >
              <PlusIcon />
              {labels[lang].addSession}
            </motion.button>
          </div>
        </div>

        {/* Add Session Modal */}
        <AnimatePresence>
          {showAddSessionPopup && (
            <SessionForm setShowAddSessionPopup={setShowAddSessionPopup}/>
          )}
        </AnimatePresence>
              {/**WEEKLY SCHEDULE SUMMARY */}
              <ScheduleSummary/>

        {/* Weekly Schedule */}
        <div className="bg-[#3D3555]/60 p-8 w-full rounded-[24px] text-white font-Inter border-t border-[#9B7EDE]/20 mt-12">
          <p className="text-2xl font-semibold mb-8">{labels[lang].weeklySchedule}</p>
          {/* Day Headers + Schedule Grid */}
          <div className="grid grid-cols-1 font-Inter md:grid-cols-2 lg:grid-cols-7 gap-4">
            {days.map((day, dayIndex) => (
              <motion.div 
                key={day} 
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
              >
                <p className="text-center bg-[#52466B] rounded-[16px] px-3 py-2 text-sm font-semibold text-white mb-4">{lang === 'ar' ? dayLabels[day] : day}</p>
                <div className="flex flex-col gap-3">
                  
                  {scheduleData[day].length>0 && scheduleData[day].map((session, idx) =>
                  {
                    
                    return (

                        <SessionCard key={idx} session={session} index={idx} />
                    )
                    } 
                  )}
                 {scheduleData[day].length <= 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-[#2F2844]/50 border border-[#9B7EDE]/20 rounded-[16px] p-6 text-center"
  >
    <p className="text-[#B8A7E5] text-sm">{labels[lang].noSessions}</p>
  
  </motion.div>
)}
                 
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div
        style={{
            background: "linear-gradient(135deg, rgba(155, 126, 222, 0.2) 0%, rgba(124, 95, 189, 0.2) 100%)"

        }}
        
        className="border-t flex flex-col lg:flex-row font-Inter text-white items-center gap-3 rounded-[24px] p-6 border-[#9B7EDE]/30 mt-8 mb-16">
            <TipBackgroundIcon/>
            <div className="flex items-center lg:items-start flex-col gap-2">
                <p className="font-semibold text-lg">{labels[lang].proTip}</p>
                <p className="text-xs leading-relaxed text-center lg:text-start text-[#B8A7E5]">{labels[lang].proTipText}</p>
            </div>
            </div>
      </section>
    </Body>
  
  )
}

export default Schedule
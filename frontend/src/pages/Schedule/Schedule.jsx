/* eslint-disable no-unused-vars */
import Body from "../../comp/layout/Body";
import { FilterIcon, TipBackgroundIcon } from "../../comp/ui/Icons";
import { PlusIcon } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SessionCard from "./sections/SessionCard";
import ScheduleSummary from "./sections/ScheduleSummary";
import { useState } from "react";
import SessionForm from "./sections/SessionForm";
import { useTranslation } from "react-i18next";

const initialScheduleData = {
  Monday: [
    {
      id: "monday-1",
      time: "8:00 AM",
      subject: "Data Structures",
      duration: "2h",
      color: "bg-[#9B7EDE]",
    },
    {
      id: "monday-2",
      time: "11:00 AM",
      subject: "Web Development",
      duration: "1.5h",
      color: "bg-[#7C5FBD]",
    },
  ],
  Tuesday: [
    {
      id: "tuesday-1",
      time: "9:00 AM",
      subject: "Algorithm Design",
      duration: "2h",
      color: "bg-[#9B7EDE]",
    },
    {
      id: "tuesday-2",
      time: "1:00 PM",
      subject: "Database Systems",
      duration: "2h",
      color: "bg-[#7C5FBD]",
    },
  ],
  Wednesday: [
    {
      id: "wednesday-1",
      time: "8:00 AM",
      subject: "Computer Networks",
      duration: "2h",
      color: "bg-[#9B7EDE]",
    },
    {
      id: "wednesday-2",
      time: "12:00 PM",
      subject: "English Literature",
      duration: "1h",
      color: "bg-[#7C5FBD]",
    },
    {
      id: "wednesday-3",
      time: "3:00 PM",
      subject: "Project Work",
      duration: "2h",
      color: "bg-[#52466B]",
    },
  ],
  Thursday: [
    {
      id: "thursday-1",
      time: "10:00 AM",
      subject: "Software Engineering",
      duration: "2h",
      color: "bg-[#9B7EDE]",
    },
    {
      id: "thursday-2",
      time: "2:00 PM",
      subject: "Mathematics",
      duration: "1.5h",
      color: "bg-[#7C5FBD]",
    },
  ],
  Friday: [
    {
      id: "friday-1",
      time: "9:00 AM",
      subject: "Operating Systems",
      duration: "2h",
      color: "bg-[#9B7EDE]",
    },
    {
      id: "friday-2",
      time: "1:00 PM",
      subject: "Group Study",
      duration: "2h",
      color: "bg-[#52466B]",
    },
  ],
  Saturday: [],
  Sunday: [
    {
      id: "sunday-1",
      time: "11:00 AM",
      subject: "Self Study",
      duration: "2h",
      color: "bg-[#52466B]",
    },
  ],
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [dragOverDay, setDragOverDay] = useState(null);
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
      proTipText:
        "Schedule your most challenging subjects during your peak productivity hours. Most students perform best in the morning (8-11 AM) or late afternoon (3-5 PM). Try to align difficult topics with these time slots for optimal learning.",
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
      proTipText:
        "حاول تحط أصعب المواد في ساعات النشاط بتاعتك. معظم الطلبة بيبقوا شغالين أحسن الصبح (8-11 ص) أو بعد الضهر (3-5 م). جمّع المواضيع الصعبة في الأوقات دي علشان تذاكر بشكل أفضل.",
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

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showAddSessionPopup, setShowAddSessionPopup] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");

  const handleDragStart = (event, fromDay, sourceIndex) => {
    const payload = JSON.stringify({ fromDay, sourceIndex });
    event.dataTransfer.setData("application/json", payload);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, toDay, targetIndex = null) => {
    event.preventDefault();
    setDragOverDay(null);
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const { fromDay, sourceIndex } = JSON.parse(data);

      setScheduleData((prev) => {
        const newData = { ...prev };
        const sourceList = [...newData[fromDay]];
        const [movedItem] = sourceList.splice(sourceIndex, 1);

        if (fromDay === toDay && targetIndex !== null) {
          // Swap logic within the same day
          const targetList = [...newData[toDay]];
          const [targetItem] = targetList.splice(targetIndex, 1, movedItem);
          targetList.splice(sourceIndex, 1, targetItem);
          newData[toDay] = targetList;
        } else if (targetIndex !== null) {
          // Swap logic between different days
          const destList = [...newData[toDay]];
          const [targetItem] = destList.splice(targetIndex, 1, movedItem);
          sourceList.splice(sourceIndex, 0, targetItem);
          newData[fromDay] = sourceList;
          newData[toDay] = destList;
        } else {
          // Just move to end if dropped in empty area
          newData[fromDay] = sourceList;
          newData[toDay] = [...newData[toDay], movedItem];
        }

        return newData;
      });
    } catch (error) {
      console.error("Failed to swap sessions:", error);
    }
  };

  return (
    <section className="min-h-screen p-7 lg:p-14 pt-12 lg:pt-20 ">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col font-Inter gap-2">
          <p className="text-3xl font-semibold text-white ">
            {labels[lang].pageTitle}
          </p>
          <p className="text-xs text-[#B8A7E5]">{labels[lang].pageSubtitle}</p>
        </div>
        <div className="flex flex-row gap-3 mt-4 text-white relative">
          <motion.button
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3D3555] border-t border-[#9B7EDE]/20 rounded-full flex gap-2 font-Inter text-sm items-center px-4 py-2"
          >
            <FilterIcon /> {labels[lang].filterButton}
          </motion.button>

          <AnimatePresence>
            {showFilterPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-0 bg-[#2F2844] border border-white/10 rounded-[16px] p-4 w-48 z-50 shadow-2xl"
              >
                <div className="space-y-1">
                  {[
                    "All",
                    "Data Structures",
                    "Web Development",
                    "Mathematics",
                    "Algorithm Design",
                  ].map((subject) => (
                    <button
                      key={subject}
                      onClick={() => {
                        setFilterSubject(subject);
                        setShowFilterPopup(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${filterSubject === subject ? "bg-[#9B7EDE] text-white" : "text-[#B8A7E5] hover:bg-white/5"}`}
                    >
                      {subject === "All" ? labels[lang].all : subject}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setShowAddSessionPopup(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#9B7EDE] flex gap-2 items-center px-4 py-2 rounded-full text-sm"
          >
            <PlusIcon size={18} /> {labels[lang].addSession}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showAddSessionPopup && (
          <SessionForm setShowAddSessionPopup={setShowAddSessionPopup} />
        )}
      </AnimatePresence>

      <ScheduleSummary />

      <div className="bg-[#3D3555]/60 p-6 lg:p-8 w-full rounded-[24px] text-white font-Inter border-t border-[#9B7EDE]/20 mt-12 overflow-x-auto">
        <p className="text-2xl font-semibold mb-8">
          {labels[lang].weeklySchedule}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 min-w-[1000px] lg:min-w-0">
          <LayoutGroup>
            {days.map((day, dayIndex) => (
              <div key={day} className="flex flex-col">
                <p className="text-center bg-[#52466B] rounded-[12px] px-3 py-2 text-xs font-bold text-white mb-4 uppercase tracking-wider">
                  {lang === "ar" ? dayLabels[day] : day}
                </p>
                <motion.div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                  onDragEnter={() => setDragOverDay(day)}
                  onDragLeave={() => setDragOverDay(null)}
                  className={`flex flex-col gap-3 p-4 min-h-[240px] md:min-h-[280px] rounded-[20px] transition-colors duration-200 ${dragOverDay === day ? "bg-white/10 ring-2 ring-[#9B7EDE]/50" : "bg-transparent"}`}
                >
                  {scheduleData[day]
                    .filter(
                      (s) =>
                        filterSubject === "All" || s.subject === filterSubject,
                    )
                    .map((session, idx) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        index={idx}
                        day={day}
                        onDragStart={handleDragStart}
                        onDropOnCard={handleDrop}
                      />
                    ))}

                  {scheduleData[day].length === 0 && (
                    <div className="border-2 border-dashed border-[#9B7EDE]/10 rounded-[16px] h-full flex items-center justify-center p-4">
                      <p className="text-[#B8A7E5]/40 text-[10px] text-center">
                        {labels[lang].noSessions}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </LayoutGroup>
        </div>
      </div>

      <div className="border-t flex flex-col lg:flex-row font-Inter text-white items-center gap-4 rounded-[24px] p-6 border-[#9B7EDE]/30 mt-8 mb-16 bg-gradient-to-br from-[#9B7EDE]/10 to-transparent">
        <TipBackgroundIcon />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">{labels[lang].proTip}</p>
          <p className="text-xs leading-relaxed text-[#B8A7E5]">
            {labels[lang].proTipText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Schedule;

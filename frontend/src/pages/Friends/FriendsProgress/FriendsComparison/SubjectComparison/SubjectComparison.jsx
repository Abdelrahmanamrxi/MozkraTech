/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import SubjectRow from './SubjectRow';
import { FriendshipIcon,ElectricIcon,EmptyStarIcon } from '@/comp/ui/Icons';

const subjects = [
  { name: "Data Structures", friendSubject:'Physics 1',youScore: 85, friendScore: 88, diff: -3 },
  { name: "Web Development", friendSubject: "Chemistry", youScore: 72, friendScore: 75, diff: -3 },
  { name: "Database Design", friendSubject:'Biology',youScore: 90, friendScore: 92, diff: -2 },
  { name: "Algorithm Analysis", friendSubject:'Biochemistry',youGrade: "B", friendGrade: "B", youScore: 68, friendScore: 70, diff: -2 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 22 } },
};
const actions = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    label: "Study Together",
    desc: "Schedule a group study session with friends",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    label: "Challenge Friend",
    desc: "Create a study challenge and compete",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: "Share Achievement",
    desc: "Celebrate your progress with friends",
  },]


function SubjectComparison() {
  return (
      <div className="font-Inter mt-7 flex items-start justify-center">
      <div className="w-full  flex flex-col gap-4">
 
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 280, damping: 24 }}
          className="rounded-2xl p-5 bg-[#3D3555] border border-[#9B7EDE]/20 sm:p-6"
          
        >
          <h2 className="text-white font-bold text-xl mb-5">Top Subject Comparison</h2>
 
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5"
          >
            {subjects.map((subject, i) => (
              <SubjectRow key={subject.name} subject={subject} index={i} />
            ))}
          </motion.div>
        </motion.div>
 
        {/* Action Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "rgba(155,126,222,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="flex bg-[#9B7EDE]/10 border border-[#9B7EDE]/30 flex-col gap-2 rounded-xl p-4 text-left cursor-pointer transition-colors hover:bg-[#4A3870]/40"
             
            >
              <span className="text-[#9B7EDE]"><FriendshipIcon/></span>
              <p className="text-white font-semibold text-sm">Study Together</p>
              <p className="text-purple-300/50 text-xs leading-relaxed">Schedule a group study session with friends</p>
            </motion.button>


             
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "rgba(155,126,222,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="flex bg-[#7C5FBD]/10 border border-[#7C5FBD]/30 flex-col gap-2 rounded-xl p-4 text-left cursor-pointer transition-colors hover:bg-[#4A3870]/40"
              
            >
              <span className="text-[#9B7EDE]"><ElectricIcon/></span>
              <p className="text-white font-semibold text-sm">Challenge Friend</p>
              <p className="text-purple-300/50 text-xs leading-relaxed">Create study challenges and compete</p>
            </motion.button>


            
             
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "rgba(155,126,222,0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="flex bg-[#3D3555] border border-[#9B7EDE]/20 flex-col gap-2 rounded-xl p-4 text-left cursor-pointer transition-colors hover:bg-[#3D3555]/40"
          
            >
              <span className="text-[#9B7EDE]"><EmptyStarIcon/></span>
              <p className="text-white font-semibold text-sm">Share Achievement</p>
              <p className="text-purple-300/50 text-xs leading-relaxed">Celebrate your progress with friends</p>
            </motion.button>
        
        
        </motion.div>
              





 
      </div>
    </div>

  )
}

export default SubjectComparison

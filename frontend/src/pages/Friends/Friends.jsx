/* eslint-disable no-unused-vars */
import {useState} from 'react'
import { PlusIcon } from 'lucide-react'
import { AnalyticsIcon,SendIcon } from '../../comp/ui/Icons'
import FriendsMessages from './FriendsMessages/FriendsMessages'
import FriendsProgress from './FriendsProgress/FriendsProgress'
import LiquidGlassButton from '@/comp/ui/LiquidGlassButton'
import Body from '../../comp/layout/Body'
import { motion } from 'framer-motion'


function Friends() {
    const[showMessagesSection,setSection]=useState(false)
    console.log(showMessagesSection)
    return(
       <Body>
      <div className='min-h-screen p-8 lg:p-14 pt-12 lg:pt-20'>
  {/* Header */}
  <div className='flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between'>
    <div className='flex flex-col gap-1'>
      <h1 className='text-white font-semibold text-3xl font-Inter'>Friends and Progress</h1>
      <p className='text-xs text-[#B8A7E5] font-Inter'>Track your progress and compete with study buddies</p>
    </div>

    <motion.button
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
      className="bg-[#9B7EDE] w-fit mt-3 lg:mt-0 text-white flex flex-row gap-2 cursor-pointer items-center px-4 py-2 rounded-full text-sm"
    >
      <PlusIcon />
      Add Friends
    </motion.button>
  </div>

  {/* Tab Switcher */}
  <div className='mt-6 inline-flex items-center gap-1 bg-[#3D3555]/60 border border-[#9B7EDE]/15 rounded-full p-1 font-Inter'>
    <button
      onClick={() => setSection(false)}
      className={`flex flex-row gap-2 items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-250
        ${!showMessagesSection
          ? 'bg-[#9B7EDE] text-white shadow-[0_2px_16px_rgba(155,126,222,0.45)]'
          : 'text-purple-300/60 hover:text-purple-200'
        }`}
    >
      <AnalyticsIcon />
      Progress & Tracking
    </button>

    <button
      onClick={() => setSection(true)}
      className={`flex flex-row gap-2 items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-250
        ${showMessagesSection
          ? 'bg-[#9B7EDE] text-white shadow-[0_2px_16px_rgba(155,126,222,0.45)]'
          : 'text-purple-300/60 hover:text-purple-200'
        }`}
    >
      <SendIcon />
      Messages
      <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold transition-all duration-250
        ${showMessagesSection ? 'bg-red-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
        3
      </span>
    </button>
  </div>

        {
        showMessagesSection?
        <FriendsMessages/>:
        <FriendsProgress/>
        }

                  






        </div>
   

       </Body>
    )

}

export default Friends

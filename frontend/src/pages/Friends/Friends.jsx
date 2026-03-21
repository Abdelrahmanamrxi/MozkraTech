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
            <div className='flex   flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <h1 className='text-white font-semibold text-3xl font-Inter'>Friends and Progress</h1>
            <p className='text-xs flex lg:hidden mt-2 mb-3  text-[#B8A7E5] font-Inter'>Track your progress and compete with study buddies</p>
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
              className="bg-[#9B7EDE] self-start   text-white flex flex-row gap-2 cursor-pointer items-center px-4 py-2 rounded-full text-sm transition-all"
            >
              <PlusIcon />
              Add Friends
            </motion.button>
            </div>
            <p className='text-xs hidden lg:flex mt-4 lg:mt-2 text-[#B8A7E5] font-Inter'>Track your progress and compete with study buddies</p>
            <div className='flex flex-col self-start lg:flex-row gap-7 font-Inter mt-5'>
                <button onClick={()=>{setSection(false)}} className={`  text-base rounded-[24px] transition-all ${showMessagesSection?'border-t bg-[#3D3555] border-[#9B7EDE]/20  hover:bg-[#9B7EDE] hover:border-none  ':' bg-[#9B7EDE] font-semibold'}  px-4 py-2 cursor-pointer transition-all flex flex-row gap-2 text-white`}><AnalyticsIcon/>Progress & Tracking</button>
                <button onClick={()=>{setSection(true)}} className={`text-white  bg-[#3D3555] rounded-[24px] cursor-pointer transition-all hover:bg-[#9B7EDE] hover:border-none  ${showMessagesSection?'bg-[#9B7EDE] border-none font-semibold ':''} px-4 py-2 border-t border-[#9B7EDE]/20 flex flex-row items-center gap-2 text-base`}><SendIcon/>Messages
                <div className='bg-red-800 rounded-full px-2'>3</div>
                </button>
                </div>

                   <FriendsProgress/>






        </div>
   

       </Body>
    )

}

export default Friends

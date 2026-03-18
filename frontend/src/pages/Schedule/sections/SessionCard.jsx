/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"

const SessionCard = ({session,index})=>{
 return(
 <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className={`${session.color} p-4 rounded-[16px] text-white`}
  >
    <p className="text-xs font-Inter opacity-90">{session.time}</p>
    <p className="font-semibold text-sm mt-2">{session.subject}</p>
    <p className="text-xs opacity-80 mt-1">{session.duration}</p>
  </motion.div>
  )
    }
export default SessionCard
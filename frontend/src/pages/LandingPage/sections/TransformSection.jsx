/* eslint-disable no-unused-vars */
import React from 'react'
import useTypewriter from '../../../hooks/useTypewriter'
import { motion } from 'framer-motion'
const TransformSection = () => {
     const{displayed,done}=useTypewriter('Ready To Transform Your Study Routine?',70,700)
  return (
     <div className="p-20 ready-background lg:m-20 m-3 mt-12 gap-7 text-white  flex flex-col lg:items-center rounded-[72px] ">
           <h6 className="font-sans font-bold text-xl lg:text-2xl">{displayed}
            {!done && (
           <motion.span
       className="inline-block w-[3px] h-[0.82em] bg-white align-middle ml-[2px] rounded-sm"
       animate={{ opacity: [1, 0, 1] }}
       transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
     />
        )}
           </h6>
           <p className="font-blinker text-base lg:text-xl">Join students who are studying smarter, not harder. Start your free today — no credit card required.</p>
         <motion.button
   className="bg-primary transition-all hover:bg-primary-dark  flex flex-row gap-2 items-center px-6 lg:px-12 cursor-pointer py-3 rounded-[19px] border border-white/20"
   whileHover="hover"
   whileTap={{ scale: 0.96 }}
   initial="rest"
   animate="rest"
 >
   <motion.span
     variants={{
       rest:  { x: 0 },
       hover: { x: -4 },
     }}
     transition={{ type: 'spring', stiffness: 300, damping: 20 }}
   >
     Start Free Today
   </motion.span>
 
   <motion.svg
     width="32" height="15" viewBox="0 0 32 15" fill="none"
     xmlns="http://www.w3.org/2000/svg"
     variants={{
       rest:  { x: 0,  opacity: 1 },
       hover: { x: 6,  opacity: 1 },
     }}
     transition={{ type: 'spring', stiffness: 300, damping: 18 }}
   >
     <path d="M30.7423 8.07112C31.1328 7.6806 31.1328 7.04743 30.7423 6.65691L24.3784 0.292946C23.9878 -0.0975785 23.3547 -0.0975785 22.9641 0.292946C22.5736 0.68347 22.5736 1.31664 22.9641 1.70716L28.621 7.36401L22.9641 13.0209C22.5736 13.4114 22.5736 14.0446 22.9641 14.4351C23.3547 14.8256 23.9878 14.8256 24.3784 14.4351L30.7423 8.07112ZM0 7.36401L0 8.36401H30.0352V7.36401V6.36401H0L0 7.36401Z" fill="white"/>
   </motion.svg>
 
   {/* glow layer */}
   <motion.span
     className="absolute inset-0 rounded-[19px] bg-white pointer-events-none"
     variants={{
       rest:  { opacity: 0 },
       hover: { opacity: 0.08 },
     }}
     transition={{ duration: 0.2 }}
   />
 </motion.button>
         </div>
  )
}

export default TransformSection

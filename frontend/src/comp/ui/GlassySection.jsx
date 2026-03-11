import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
function GlassySection({children,index}) {
const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: 28 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})
const glassHover = {
  scale: 1.02,
  boxShadow: '0 16px 48px rgba(144,103,198,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
  borderColor: 'rgba(255,255,255,0.28)',
  backgroundColor: 'rgba(144,103,198,0.28)',
  transition: { type: 'spring', stiffness: 280, damping: 20 },
}
const glassTap = { scale: 0.98 }

  return (
    
                <motion.div
                 key={index}
                 className="flex glassy-primary-background items-center gap-2 rounded-[30px] p-5 flex-row border border-white/15 ring-1 ring-white/10 cursor-default"
                 variants={fadeLeft(0.18 + index * 0.1)}
                 initial="hidden"
                 whileInView="show"
                 viewport={{ once: true, amount: 0.2 }}
                 whileHover={glassHover}
                 whileTap={glassTap}
               >
                {children}

               </motion.div>
  )
}

export default GlassySection

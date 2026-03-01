/* eslint-disable no-unused-vars */
import React from 'react'
import { cards_data } from '../../../data/data.jsx'
import { useInView } from 'framer-motion'
import {motion} from 'framer-motion'
function Features({featureRef}) {
      const featureInView = useInView(featureRef, { once: true, amount: 0.2 })
  return (
    <>
      <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="lg:text-5xl text-3xl font-sans font-semibold text-center text-white">
                  Everything You Need to Succeed
                </p>
              </motion.div>
    
              <motion.div
                className="max-w-md text-base mt-4"
                initial={{ opacity: 0, y: 44 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
              >
                <p className="font-blinker text-center text-white">
                  Powerful features designed to help you plan better, study smarter,
                  and achieve your academic goals.
                </p>
              </motion.div>
    
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 p-10 pt-28">
                  {cards_data.map((card, index) => (
                    <div key={index} className="cards">
                     
                      <div className="cards-bg" />
                      <div className="relative z-10">
                       
                        <div className="cards-icon">
                          <img className="w-8 h-8" src={card.src} alt="AI" />
                        </div>
                        <h2 className="text-white font-semibold text-lg">{card.header}</h2>
                        <p className="text-gray-300 mt-2 text-sm">{card.paragraph}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
    </>
  )
}

export default Features

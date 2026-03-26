/* eslint-disable no-unused-vars */
import React from 'react'

import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion'
import AiImage from "@/assets/ai.svg";
import analytics from "@/assets/analytics.svg";
import flash from "@/assets/flash.svg";
import group from "@/assets/group.svg";
import schedule from "@/assets/schedule.svg";
import timer from "@/assets/timer.svg";
import {motion} from 'framer-motion'
function Features({featureRef}) {
      const{t}=useTranslation()
      const icons=[AiImage,analytics,flash,group,schedule,timer]
      const featureInView = useInView(featureRef, { once: true, amount: 0.2 })
      const cards_data=t("features.cards",{returnObjects:true})
  return (
    <>
      <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="lg:text-5xl text-3xl font-sans font-semibold text-center text-white">
                  {t('features.title')} !
                </p>
              </motion.div>
    
              <motion.div
                className="max-w-md text-base mt-4"
                initial={{ opacity: 0, y: 44 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
              >
                <p className="font-blinker text-center text-white">
                 {t("features.description")}
                </p>
              </motion.div>
    
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 p-10 pt-28">
                  {cards_data.map((card, index) => (
                    <div key={index} className="cards">
                     
                      <div className="cards-bg" />
                      <div className="relative z-10">
                       
                        <div className="cards-icon">
                          <img className="w-8 h-8" src={icons[index]} alt="AI" />
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

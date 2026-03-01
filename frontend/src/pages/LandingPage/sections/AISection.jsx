/* eslint-disable no-unused-vars */
import React from 'react'
import { ai_cards } from '../../../data/data'
import { motion } from 'framer-motion'
const AISection = () => {

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})

const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: -28 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: 28 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})

// ── glassy card hover style ──────────────────────────────────────────────────
const glassHover = {
  scale: 1.02,
  boxShadow: '0 16px 48px rgba(144,103,198,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
  borderColor: 'rgba(255,255,255,0.28)',
  backgroundColor: 'rgba(144,103,198,0.28)',
  transition: { type: 'spring', stiffness: 280, damping: 20 },
}

const glassTap = { scale: 0.98 }
  return (
      
 <section className="ai-background m-6 mt-6 lg:gap-8 lg:items-center  gap-9 flex lg:flex-row flex-col lg:p-14  p-8 text-white font-sans rounded-[60px]">

      {/* ── LEFT ── */}
      <div className="lg:w-1/2 w-full flex flex-col gap-5">

        <motion.h3
          className="font-semibold text-base"
          variants={fadeRight(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          AI Assistant
        </motion.h3>

        <motion.div
          className="flex flex-col"
          variants={fadeRight(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h4 className="font-bold lg:w-1/2 w-full lg:text-start text-center text-xl lg:text-2xl">
            Master Your Time,
          </h4>
          <p className="text-primary font-bold lg:w-1/2 lg:text-start text-center text-xl lg:text-2xl">
            Ace Your Goals
          </p>
        </motion.div>

        {/* Big glassy card */}
        <motion.div
          className="bg-primary-dark/70 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-white/10 h-full py-20 px-6 rounded-2xl cursor-default"
          variants={fadeUp(0.25)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{
            scale: 1.015,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)',
            borderColor: 'rgba(255,255,255,0.25)',
            transition: { type: 'spring', stiffness: 260, damping: 22 },
          }}
        >
          <h5 className="font-bold text-2xl lg:text-3xl w-3/4 mb-3">
            Your Personal Study Coach
          </h5>
          <p className="text-base">
            Our advanced AI learns from your habits, energy levels, and performance
            to create personalized study plans that actually work for you
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex flex-col">

        {/* Top AI Suggestion card */}
        <motion.div
          className="flex glassy-primary-background items-center gap-2 rounded-[30px] p-6 flex-row border border-white/15 ring-1 ring-white/10 cursor-default"
          variants={fadeLeft(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={glassHover}
          whileTap={glassTap}
        >
          {/* SVG star icons */}
          <motion.svg
            width="90" height="50" viewBox="0 0 90 50" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
          >
            <g transform="translate(-10,0)">
              <path
                d="M37.839 5.68658C38.0905 5.04897 38.993 5.04897 39.2445 5.68658L39.9559 7.49087C40.4167 8.65887 41.3413 9.58345 42.5092 10.0441L44.3136 10.7557C44.9511 11.0072 44.9511 11.9096 44.3136 12.161L42.5092 12.8726C41.3413 13.3333 40.4167 14.2579 39.9559 15.4259L39.2445 17.2302C38.993 17.8678 38.0905 17.8678 37.839 17.2302L37.1276 15.4259C36.6667 14.2579 35.7422 13.3333 34.5742 12.8726L32.7699 12.161C32.1324 11.9096 32.1324 11.0072 32.7699 10.7557L34.5742 10.0441C35.7422 9.58345 36.6667 8.65887 37.1276 7.49087L37.839 5.68658Z"
                stroke="#141B34" strokeWidth="1.5"
              />
            </g>
            <g transform="translate(40,0)">
              <path
                d="M15.7929 2.27523C16.4635 0.574922 18.8698 0.574922 19.5404 2.27523L21.4381 7.08667C22.6665 10.2014 25.1319 12.6669 28.2467 13.8952L33.0581 15.7929C34.7583 16.4635 34.7583 18.8698 33.0581 19.5404L28.2467 21.4381C25.1319 22.6665 22.6665 25.1319 21.4381 28.2467L19.5404 33.0581C18.8698 34.7583 16.4635 34.7583 15.7929 33.0581L13.8953 28.2467C12.6669 25.1319 10.2014 22.6665 7.08667 21.4381L2.27523 19.5404C0.574922 18.8698 0.574922 16.4635 2.27523 15.7929L7.08667 13.8952C10.2014 12.6669 12.6669 10.2014 13.8953 7.08667L15.7929 2.27523Z"
                stroke="#141B34" strokeWidth="2"
              />
            </g>
          </motion.svg>

          <div className="flex flex-col">
            <p className="font-semibold text-lg">AI Suggestion</p>
            <p className="font-blinker text-base">
              You're most productive in the morning. I've scheduled your hardest subjects between 9-11 AM.
            </p>
          </div>
        </motion.div>

        {/* AI cards list */}
        <div className="flex flex-col mt-5 gap-5">
          {ai_cards.map((card, index) => (
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
              {/* Icon subtle pulse on hover */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              >
                {card.icon}
              </motion.div>

              <div className="flex flex-col">
                <p className="font-semibold text-lg">{card.header}</p>
                <p className="font-blinker text-base">{card.paragraph}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default AISection

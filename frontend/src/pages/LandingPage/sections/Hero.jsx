/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import Image from "../../../assets/image1.jpeg";
import useTypewriter from '../../../hooks/useTypewriter'
function Hero() {
    const { displayed, done } = useTypewriter('potential', 45, 700)
  return (
    <div className="flex lg:flex-row flex-col items-center justify-center py-20 lg:py-0 lg:h-screen">

          <div className="lg:text-start lg:items-start text-center items-center lg:w-2/5 px-4 py-2 text-white">

            {/* Heading fades up, "potential" types out */}
            <motion.p
              className="md:text-7xl text-5xl font-sans font-semibold"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Unlock your{' '}
              <span className="text-primary mt-4 inline-block min-w-[4px]">
                {displayed}
                {/* blinking cursor — disappears when typing is done */}
                {!done && (
                  <motion.span
                    className="inline-block w-[3px] h-[0.82em] bg-primary align-middle ml-[2px] rounded-sm"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </span>
            </motion.p>

            <motion.p
              className="lg:text-xl text-base font-blinker mt-8"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            >
              The intelligent scheduling platform that adapts to your learning
              style. Plan smarter, study better, and achieve more with
              AI-powered insights.
            </motion.p>

            <motion.button
              className="get-started-button"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.44 }}
              whileHover={{ y: -3, boxShadow: '0 10px 32px rgba(144,103,198,0.55)' }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started Free →
            </motion.button>
          </div>

          {/* Image — untouched */}
          <div>
            <div className="relative md:w-full w-3/4 mt-8 max-w-xl mx-auto rounded-4xl p-4 bg-gradient-to-bl from-[var(--color-primary-dark)] to-[var(--color-primary)]">
              <img
                src={Image}
                alt="Image 1"
                className="w-full h-auto object-cover rounded-4xl"
              />
              <div className="-bottom-4 -left-2 cards-styling">AI Schedule</div>
              <div className="-top-4 -right-2 cards-styling">Weekly updates</div>
            </div>
          </div>
        </div>
  )
}

export default Hero

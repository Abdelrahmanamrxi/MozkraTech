/* eslint-disable no-unused-vars */
import React from 'react'
import LiquidGlassButton from '../../../../comp/ui/LiquidGlassButton';
import { motion } from 'framer-motion';
import { CalenderIcon, WeeklyReportIcon, StreakIcon } from '../../../../comp/ui/Icons';
import { Link } from 'react-router';
import useTypewriter from '../../../../hooks/useTypewriter.jsx';
import CardStack from './CardStack';


function WelcomeBanner({ mockUserData }) {
  

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
const{displayed,done}=useTypewriter(formattedDate)
  return (
    <section className="relative flex flex-row items-center justify-between   overflow-hidden">

      {/* ── Left: text + buttons ── */}
      <div className="flex flex-col gap-5 z-10">
        <p className="font-blinker mt-8 lg:mt-0 text-2xl">{displayed}</p>
        <h1 className="lg:text-5xl text-4xl font-semibold lg:w-3/4 leading-15 text-white font-poppins">
          Good afternoon!<span className="text-primary"> {mockUserData.name}</span>
        </h1>
        <p className="lg:w-3/4 font-blinker text-lg lg:text-xl">{mockUserData.motivationalText}</p>
        <div className="flex flex-row mt-3 lg:mt-0 items-center gap-3">
          <Link to="/schedule">
            <LiquidGlassButton className='px-2 py-1 text-sm gap-2 lg:px-6 lg:py-2 lg:text-base lg:gap-2.5' icon={CalenderIcon}>View Full Schedule</LiquidGlassButton>
          </Link>
          <Link to="/weeklyreport">
            <LiquidGlassButton    icon={WeeklyReportIcon} className="bg-white text-primary px-2 py-1 text-sm gap-2 lg:px-6 lg:py-2 lg:text-base lg:gap-2.5">Weekly Report</LiquidGlassButton>
          </Link>


        </div>

        
      </div>

      {/* ── Desktop: full-size stack ── */}
      <CardStack scale={1} mockUserData={mockUserData} className="hidden lg:block" />

      {/* ── Mobile: scaled-down stack pinned top-right ── */}
   

    </section>
  );
}

export default WelcomeBanner;
/* eslint-disable no-unused-vars */
import React from "react";
import Body from "../../comp/layout/Body";

import { cards_data } from "../../data/data.jsx";
import { motion } from "framer-motion";
import {useRef } from "react";
import { useInView } from "framer-motion";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import { ai_cards } from "../../data/data.jsx";
import AISection from "./sections/AISection.jsx";
import useTypewriter from "../../hooks/useTypewriter.js";
import TransformSection from "./sections/TransformSection.jsx";


function LandingPage() {
  const featureRef= useRef(null)
  return (
      <Body>
      <div className="main-background pb-0 flex flex-col ">
        {/* ══════════ HERO ══════════ */}
          <Hero/>
        {/* ══════════ FEATURES — fade up on scroll ══════════ */}
        <div ref={featureRef} className="h-full w-full flex flex-col items-center justify-center">
        <Features featureRef={featureRef}/>
           </div>
          {/** AI Section */}
        <AISection/>
        <TransformSection/>
      </div>
    </Body>
   
  );
}

export default LandingPage;

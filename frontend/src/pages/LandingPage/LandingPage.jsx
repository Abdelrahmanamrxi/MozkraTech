/* eslint-disable no-unused-vars */
import Body from "../../comp/layout/Body";
import { motion } from "framer-motion";
import { useRef } from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import AISection from "./sections/AISection.jsx";
import TransformSection from "./sections/TransformSection.jsx";

function LandingPage() {
  const featureRef = useRef(null);
  return (
    
      <div className="main-background pb-0 flex flex-col ">
        {/* ══════════ HERO ══════════ */}
        <Hero />
        {/* ══════════ FEATURES — fade up on scroll ══════════ */}
        <div
          ref={featureRef}
          className="h-full w-full flex flex-col items-center justify-center"
        >
          <Features featureRef={featureRef} />
        </div>
        {/** AI Section */}
        <AISection />
        <TransformSection />
      </div>
    
  );
}

export default LandingPage;

/* eslint-disable no-unused-vars */
/**
 * LandingPage — same structure as original, same component API.
 * Drop-in replacement.
 */
import { useRef } from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import TransformSection from "./sections/TransformSection.jsx";
import Testimonials from "./sections/Testimonials.jsx";

function LandingPage() {
  const heroRef = useRef(null);
  const featureRef = useRef(null);
  const testimonialRef = useRef(null);
  const transformRef = useRef(null);
  return (
    <div className="main-background pb-0 flex flex-col">
      <div ref={heroRef} id="hero">
        <Hero />
      </div>
      <div
        ref={featureRef}
        id="features"
        className="h-full w-full flex flex-col items-center justify-center"
      >
        <Features featureRef={featureRef} />
      </div>
      <div ref={testimonialRef} id="testimonials">
        <Testimonials testimonialRef={testimonialRef} />
      </div>
      <div ref={transformRef} id="transform">
        <TransformSection />
      </div>
    </div>
  );
}

export default LandingPage;

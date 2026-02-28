import React from "react";
import Body from "../comp/layout/Body";
import Image from "../assets/image1.jpeg";

function LandingPage() {
  return (
    <Body>
      <div className="main-background h-screen flex items-center justify-center">
        <div className="w-2/5 px-4 py-2 text-white">
          <p className="text-6xl font-sans font-semibold">
            Unlock your <span className="text-primary mt-4">potential</span>
          </p>
          <p className="text-sm font-blinker mt-8">
            The intelligent scheduling platform that adapts to your learning
            style. Plan smarter, study better, and achieve more with AI-powered
            insights.
          </p>
          <button className="get-started-button">Get Started Free →</button>
        </div>
        <div>
          <div className="relative w-full max-w-xl mx-auto rounded-4xl p-4 bg-gradient-to-bl from-[var(--color-primary-dark)] to-[var(--color-primary)]">
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
    </Body>
  );
}

export default LandingPage;

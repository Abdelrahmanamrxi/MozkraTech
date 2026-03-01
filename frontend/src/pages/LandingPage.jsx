import React from "react";
import Body from "../comp/layout/Body";
import Image from "../assets/image1.jpeg";
import grains from "../assets/grains texture.jpg";
import AiImage from "../assets/ai.svg";
import analytics from "../assets/analytics.svg";
import flash from "../assets/flash.svg";
import group from "../assets/group.svg";
import schedule from "../assets/schedule.svg";
import timer from "../assets/timer.svg";
import { progress } from "framer-motion";

function LandingPage() {
  return (
    <Body>
      <div className="main-background">
        <div className="h-screen flex items-center justify-center">
          <div className="w-2/5 px-4 py-2 text-white">
            <p className="text-6xl font-sans font-semibold">
              Unlock your <span className="text-primary mt-4">potential</span>
            </p>
            <p className="text-sm font-blinker mt-8">
              The intelligent scheduling platform that adapts to your learning
              style. Plan smarter, study better, and achieve more with
              AI-powered insights.
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

              <div className="-top-4 -right-2 cards-styling">
                Weekly updates
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div>
            <p className="text-4xl font-sans font-semibold text-center text-white">
              Everything You Need to Succeed
            </p>
          </div>
          <div className="max-w-xs mt-4">
            <p className="font-blinker text-center text-white">
              Powerful features designed to help you plan better, study smarter,
              and achieve your academic goals.
            </p>
          </div>

          <div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 p-10 pt-28">
              <div className="cards ">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={AiImage} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    AI-Powered Planning
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Smart algorithms analyze your learning patterns and suggest
                    optimal study schedules.
                  </p>
                </div>
              </div>

              <div className="cards">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={timer} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    Smart Timer
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Pomodoro-style timer with automatic breaks and productivity
                    tracking.
                  </p>
                </div>
              </div>

              <div className="cards">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={schedule} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    Visual Schedule{" "}
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Beautiful calendar views with drag-and-drop scheduling and
                    color-coded tasks.
                  </p>
                </div>
              </div>

              <div className="cards">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={group} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    Study Groups
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Collaborate with friends, share progress, and stay motivated
                    together.
                  </p>
                </div>
              </div>

              <div className="cards">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={analytics} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    Progress Analytics{" "}
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Detailed insights and charts to track your productivity and
                    improvement.
                  </p>
                </div>
              </div>

              <div className="cards">
                {/* subtle radial lines effect */}
                <div className="cards-bg"></div>
                <div className="relative z-10">
                  {/* icon circle */}
                  <div className="cards-icon">
                    <img className="w-8 h-8" src={flash} alt="AI" />
                  </div>
                  <h2 className="text-white font-semibold text-lg">
                    Quick Actions
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    DAccess your most-used features instantly with smart
                    shortcuts and widgets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Body>
  );
}

export default LandingPage;

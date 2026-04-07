/* eslint-disable no-unused-vars */
import React from "react";
import Body from "../../comp/layout/Body";
import ProgressBanner from "./sections/Progressbanner";
import StatsOverview from "./sections/Statsoverview";
import SubjectProgress from "./sections/Subjectprogress";
import WeeklyActivity from "./sections/Weeklyactivity";
import RecentMilestones from "./sections/Recentmilestones";
import SidePanel from "./sections/Sidepanel";
import mockProgressData from "./Progress.constants";

function Progress() {
  return (
    
      <div className="text-white main-background lg:p-15 p-5 sm:p-8">
        <ProgressBanner mockProgressData={mockProgressData} />
        <StatsOverview mockProgressData={mockProgressData} />

        <div className="flex flex-col lg:flex-row gap-8 mt-10 items-start">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-8 w-full">
            <SubjectProgress mockProgressData={mockProgressData} />
            <WeeklyActivity mockProgressData={mockProgressData} />
            <RecentMilestones mockProgressData={mockProgressData} />
          </div>

          {/* Right column */}
          <SidePanel mockProgressData={mockProgressData} />
        </div>
      </div>
   
  );
}

export default Progress;

/* eslint-disable no-unused-vars */
import React from "react";
import ProfileHero from "./sections/ProfileHero";
import StatsRow from "./sections/StatsRow";
import PersonalInformation from "./sections/PersonalInformation";
import RecentActivity from "./sections/RecentActivity";
import Preferences from "./sections/Preferences";
import AccountSettings from "./sections/AccountSettings";
import AchievementsCard from "./sections/AchievementsCard";
import mockProfileData from "./Profile.constants";

function Profile() {
  return (
    <div className="text-white main-background lg:p-15 p-5 sm:p-8">
      <ProfileHero mockProfileData={mockProfileData} />
      <StatsRow mockProfileData={mockProfileData} />

      <div className="flex flex-col lg:flex-row gap-8 mt-10 items-start">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          <PersonalInformation mockProfileData={mockProfileData} />
          <RecentActivity mockProfileData={mockProfileData} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:w-[400px] w-full">
          <Preferences mockProfileData={mockProfileData} />
          <AccountSettings mockProfileData={mockProfileData} />
          <AchievementsCard mockProfileData={mockProfileData} />
        </div>
      </div>
    </div>
  );
}

export default Profile;

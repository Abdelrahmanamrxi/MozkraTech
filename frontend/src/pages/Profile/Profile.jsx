/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProfileHero from "./sections/ProfileHero";
import StatsRow from "./sections/StatsRow";
import PersonalInformation from "./sections/PersonalInformation";
import RecentActivity from "./sections/RecentActivity";
import Preferences from "./sections/Preferences";
import AccountSettings from "./sections/AccountSettings";
import AchievementsCard from "./sections/AchievementsCard";
import mockProfileData from "./Profile.constants";
import api from "../../middleware/api";

function Profile() {
  const [user, setUser] = useState({});
  const [metrics, setMetrics] = useState({});

  const applyUserFromApi = (dbUser) => {
    if (!dbUser) return;
    const createdAt = dbUser.createdAt ? new Date(dbUser.createdAt) : null;

    setUser({
      name: dbUser.fullName ?? "",
      email: dbUser.email ?? "",
      phone: dbUser.phone ?? "",
      location: dbUser.location ?? "",
      bio: dbUser.bio ?? "",
      summary: dbUser.summary ?? "",
      profileImage: dbUser.profileImage,
      currentStreak: dbUser.currentStreak ?? 0,
      level: dbUser.level ?? 1,

      memberSince: createdAt
        ? createdAt.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "",
    });
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/user/get-profile");
      applyUserFromApi(data?.user);
      setMetrics(data.metrics);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="text-white main-background lg:p-15 p-5 sm:p-8">
      <ProfileHero
        user={user}
        onUserChange={setUser}
        onUserRefresh={refreshUser}
      />
      <StatsRow streak={user.currentStreak} metrics={metrics} />

      <div className="flex flex-col lg:flex-row gap-8 mt-10 items-start">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-8  w-full">
          <PersonalInformation user={user} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:w-[400px] w-full">
          <Preferences mockProfileData={mockProfileData} />
          <AccountSettings mockProfileData={mockProfileData} />
          <AchievementsCard achievements={metrics.achievementCount} />
        </div>
      </div>
    </div>
  );
}

export default Profile;

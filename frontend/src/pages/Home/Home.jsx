/* eslint-disable no-unused-vars */
import React from "react";
import Body from "../../comp/layout/Body";
import WelcomeBanner from "./sections/WelcomeBanner/WelcomeBanner";
import mockUserData from './Home.constant'
import { motion } from "framer-motion";
import TodaysSummary from "./sections/TodaysSummary/TodaysSummary";
import LearningOverview from "./sections/LearningOverview/LearningOverview";


function Home() {

  return (
    <Body navbarVariant="dashboard">
      <div className=" text-white main-background lg:p-15 p-5 sm:p-8">
        <WelcomeBanner mockUserData={mockUserData} />
        <TodaysSummary mockUserData={mockUserData} />
        <LearningOverview mockUserData={mockUserData} />

      </div>
    </Body>
  );
}

export default Home;

/* eslint-disable no-unused-vars */
import React from "react";
import Body from "../../comp/layout/Body";
import WelcomeBanner from "./sections/WelcomeBanner/WelcomeBanner";
import mockUserData from './Home.constant'


function Home() {
 
  return (
    <Body navbarVariant="dashboard">
      <div className="h-screen text-white main-background">
      <WelcomeBanner mockUserData={mockUserData}/>
        </div>
    </Body>
  );
}

export default Home;

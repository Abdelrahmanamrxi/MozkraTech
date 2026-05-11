import React, { useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import NavbarMobile from "./Navbar/NavbarMobile/NavbarMobile";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import api from "../../../middleware/api";
function Header() {
  const [profileImage, setProfileImage] = useState("");
  const accessToken = useSelector((state) => state.auth.accessToken);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    let active = true;

    const fetchProfileImage = async () => {
      if (!accessToken || !isDashboardRoute) return;
      try {
        const { data } = await api.post("/user/get-profile");
        if (!active) return;
        setProfileImage(data?.user?.profileImage ?? "");
      } catch (error) {
        if (!active) return;
        setProfileImage("");
      }
    };

    fetchProfileImage();
    return () => {
      active = false;
    };
  }, [accessToken, isDashboardRoute]);

  useEffect(() => {
    const handler = (event) => {
      setProfileImage(event.detail ?? "");
    };

    window.addEventListener("profile-image-updated", handler);
    return () => window.removeEventListener("profile-image-updated", handler);
  }, []);

  return (
    <>
      {/* Desktop navbar + line */}
      <div className="hidden lg:block">
        <div className="flex font-sans bg-primary-dark justify-between items-center px-8 pt-5 pb-0">
          <Navbar profileImage={profileImage} />
        </div>
        <div
          style={{
            height: "3px",
            background: "rgba(70, 66, 66, 0.75)",
            boxShadow: "0 0 8px 3px rgba(200, 200, 220, 0.5)",
            filter: "blur(1.5px)",
          }}
        />
      </div>

      {/* Mobile navbar — fully self-contained, fixed positioned */}
      <div className="lg:hidden">
        <NavbarMobile profileImage={profileImage} />
        <div
          style={{
            height: "3px",
            background: "rgba(70, 66, 66, 0.75)",
            boxShadow: "0 0 8px 3px rgba(200, 200, 220, 0.5)",
            filter: "blur(1.5px)",
          }}
        />
      </div>
    </>
  );
}

export default Header;

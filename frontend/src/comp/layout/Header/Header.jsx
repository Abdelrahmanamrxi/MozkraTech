import React from "react";
import Navbar from "./Navbar/Navbar";
import NavbarMobile from "./Navbar/NavbarMobile/NavbarMobile";
function Header({ navbarVariant = "landing" }) {
  return (
    <>
      {/* Desktop navbar + line */}
      <div className="hidden lg:block">
        <div className="flex font-sans bg-primary-dark justify-between items-center px-8 pt-5 pb-0">
          <Navbar variant={navbarVariant} />
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
        <NavbarMobile />
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

import React from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import brand_logo from "../../assets/images/brand_logo.png";
function LandingNav({ currRoute }) {
  let headerClass = "";

  if (currRoute !== "") {
    headerClass = "bg-light_gradient_bot";
  }
  return (
    <AnimatePresence>
      <motion.header
        variants={{
          hidden: { y: -200, opacity: 0, transition: { duration: 0.5 } },
          visible: { y: 0, opacity: 1, transition: { duration: 1 } },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        key={currRoute}
        className={`${headerClass} text-dark_font px-20 py-6  z-50 fixed w-full`}
      >
        <nav className=" flex justify-between">
          <div className="flex justify-center items-center gap-4">
            <img className=" w-20 h-20" src={brand_logo} alt="KalaKalikasan Brand Logo" />
            <h1 className=" font-mono">KalaKalikasan</h1>
          </div>
          <ul
            className={`flex justify-center items-center gap-24 text-2xl font-bold ${
              currRoute == "" ? "text-white" : "text-dark_font"
            }`}
          >
            <li>
              <NavLink to={"/"} className="hover:text-yellow_highlight">
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="about" className="hover:text-yellow_highlight">
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink to="services" className="hover:text-yellow_highlight">
                SERVICES
              </NavLink>
            </li>
            <li>
              <NavLink to="features" className="hover:text-yellow_highlight">
                FEATURES
              </NavLink>
            </li>
            <li>
              <NavLink to="support" className="hover:text-yellow_highlight">
                SUPPORT US
              </NavLink>
            </li>
          </ul>
        </nav>
      </motion.header>
    </AnimatePresence>
  );
}

export default LandingNav;

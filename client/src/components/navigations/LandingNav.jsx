import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import brand_logo from '../../assets/logo/logo_transparent.png';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import { IconButton } from "@mui/material";
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
function LandingNav({ currRoute }) {
  let headerClass = "";

  let menuColor = 'text-white';

  if (currRoute == 'support') {
    menuColor = 'text-dark_font'
  }
  if (currRoute !== "") {
    headerClass = "bg-light_gradient_bot";
  }

  const [openMenu, setOpenMenu] = useState(false)
  return (
    <>
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
          className={`${headerClass} hidden lg:block text-dark_font lg:px-10 xl:px-20 py-6  z-50 fixed w-full`}
        >
          <nav className=" flex justify-between">
            <div className="flex justify-center items-center gap-4">
              <img className=" w-20 h-20" src={brand_logo} alt="KalaKalikasan Brand Logo" />
              <h1 className="lg:text-2xl xl:text-4xl font-mono">KalaKalikasan</h1>
            </div>
            <ul
              className={`flex justify-center items-center lg:gap-4 2xl:gap-24 lg:text-lg xl:text-2xl font-bold ${currRoute == "" ? "text-white" : "text-dark_font"
                }`}
            >
              <li>
                <NavLink to={"/"} className={({isActive}) => isActive ? 'text-yellow_highlight' : "hover:text-yellow_highlight"} end>
                  HOME
                </NavLink>
              </li>
              <li>
                <NavLink to="about" className={({isActive}) => isActive ? 'text-yellow_highlight' : "hover:text-yellow_highlight"} end>
                  ABOUT US
                </NavLink>
              </li>
              <li>
                <NavLink to="services" className={({isActive}) => isActive ? 'text-yellow_highlight' : "hover:text-yellow_highlight"} end>
                  SERVICES
                </NavLink>
              </li>
              <li>
                <NavLink to="features" className={({isActive}) => isActive ? 'text-yellow_highlight' : "hover:text-yellow_highlight"} end>
                  FEATURES
                </NavLink>
              </li>
              <li>
                <NavLink to="support" className={({isActive}) => isActive ? 'text-yellow_highlight' : "hover:text-yellow_highlight"} end>
                  SUPPORT US
                </NavLink>
              </li>
            </ul>
          </nav>
        </motion.header>
      </AnimatePresence>

      {openMenu &&
        <div className="w-full lg:hidden flex justify-end fixed top-0 p-4 flex-col bg-light_gradient_top z-50 ">
          <div className="px-10 flex justify-start items-center gap-4">
            <img className=" w-20 h-20" src={brand_logo} alt="KalaKalikasan Brand Logo" />
            <h1 className=" font-mono text-dark_font text-lg">KalaKalikasan</h1>
          </div>
          <nav className="mt-16">
            <ul className=" py-10">
              <li>
                <NavLink to={"/"} className="hover:text-yellow_highlight px-10">
                  HOME
                </NavLink>
              </li>
              <li>
                <NavLink to="about" className="hover:text-yellow_highlight px-10">
                  ABOUT US
                </NavLink>
              </li>
              <li>
                <NavLink to="services" className="hover:text-yellow_highlight px-10">
                  SERVICES
                </NavLink>
              </li>
              <li>
                <NavLink to="features" className="hover:text-yellow_highlight px-10">
                  FEATURES
                </NavLink>
              </li>
              <li>
                <NavLink to="support" className="hover:text-yellow_highlight px-10">
                  SUPPORT US
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>}
      <div className="fixed top-8 right-4 z-50 lg:hidden">
        <IconButton onClick={() => { setOpenMenu(prev => !prev) }}>
          {openMenu ? <CloseSharpIcon className={`${menuColor} size-96`} /> : <MenuSharpIcon className={`${menuColor} size-96`} />}
        </IconButton>
      </div>
    </>
  );
}

export default LandingNav;

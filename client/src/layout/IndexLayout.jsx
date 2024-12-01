import React, { useEffect, useState } from "react";
import LandingNav from "../components/navigations/LandingNav";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
function IndexLayout() {
  //   const [gradientBG, setGradientBG] = useState(
  //     "bg-gradient-to-b from-light_gradient_top"
  //   );

  let gradientBG = "bg-gradient-to-b from-light_gradient_top to-white";

  const [currentRoute, setCurrentRout] = useState("");
  const location = useLocation();
  const currRoute = location.pathname.replace("/", "");

  useEffect(() => {
    setCurrentRout(currRoute);

    // if(currRoute !== ''){
    //     setGradientBG("bg-gradient-to-b from-dark_gradient_top to-light_gradient_bot");
    //     return
    // }
    // setGradientBG("bg-gradient-to-b from-light_gradient_top to-white");
  }, [currRoute]);

  if (currRoute !== "")
    gradientBG =
      "bg-gradient-to-b from-dark_gradient_top to-light_gradient_bot";
  return (
    <div
      className={`min-h-dvh relative z-0 ${gradientBG} ${
        currentRoute == "" && "overflow-hidden"
      }`}
    >
      <LandingNav currRoute={currRoute} />
      <main className=" pt-44">
        <Outlet />
      </main>
    </div>
  );
}

export default IndexLayout;

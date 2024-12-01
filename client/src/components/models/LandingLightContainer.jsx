import React from "react";

function LandingLightContainer({ children }) {
  return <div className="grid grid-cols-2 bg-light_gradient_bot shadow-top4xl min-h-[80dvh] py-20 px-20">{children}</div>;
}

export default LandingLightContainer;

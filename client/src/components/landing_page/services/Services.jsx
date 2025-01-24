import React from "react";
import PageHeader from "../PageHeader";
import LandingLightContainer from "../../models/LandingLightContainer";
import ServiceCard from "./ServiceCard";
function Services() {
  return (
    <div className="pt-44">
      <PageHeader textHeader={"Our Services"} />
      <LandingLightContainer>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </div>
      </LandingLightContainer>
    </div>
  );
}

export default Services;

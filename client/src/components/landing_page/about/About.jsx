import React from "react";
import PageHeader from "../PageHeader";
import about_phone from "../../../assets/images/phone_notalike.png";
import LandingLightContainer from "../../models/LandingLightContainer";

function About() {
  return (
    <div className="pt-44">
      <PageHeader textHeader={"Welcome to KalaKalikasan"} aboutPage />
      <LandingLightContainer >
        <div className="grid lg:grid-cols-2">
          <img className=" mx-auto w-1/2 lg:w-3/4" src={about_phone} alt="phone hold" />
          <div className="flex flex-col gap-4 text-center lg:text-xl">
            <p>
              KalaKalikasan is your partner in sustainable waste management,
              designed to make recycling easy, rewarding, and impactful.
            </p>
            <p>
              Our app empowers Quezon City residents to participate in
              eco-friendly practices through a Coin-Based incentive system,
              automated scheduling, and partnerships with local businesses.
            </p>
            <p>
              With features like QR code transactions and AI-powered analytics,
              we’re creating a culture of environmental stewardship that supports
              local government waste management goals.
            </p>
            <p className="font-bold">
              KalaKalikasan is more than an app—it’s a movement for a cleaner,
              greener future. Join us in making a positive impact on our planet,
              one recyclable at a time.
            </p>
          </div>
        </div>
      </LandingLightContainer>
    </div>
  );
}

export default About;

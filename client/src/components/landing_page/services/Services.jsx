import React from "react";
import PageHeader from "../PageHeader";
import LandingLightContainer from "../../models/LandingLightContainer";
import starcoin from '../../../assets/images/starcoin.png'
import house from '../../../assets/images/house.png'
import gear from '../../../assets/images/gear.png'
import ServiceCard from "./ServiceCard";
function Services() {
  return (
    <div className="pt-44">
      <PageHeader textHeader={"Our Services"} />
      <LandingLightContainer>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          <ServiceCard icon={starcoin} message={'Eco-Actors can earn, store, and redeem Eco-Coins by recycling materials. They can generate QR codes for transactions, scan barcodes at partner stores, and track their e-wallet balance and transaction history.'} />
          <ServiceCard icon={house}  message={'Eco-Partners can manage their store profiles and products, including adding, updating, and removing items. They can accept Eco-Coins as payment, track their sales and transaction history, and redeem their collected Eco-Coins for cash through the system.'}  />
          <ServiceCard icon={gear}  message={'Admins have full control over the platform, allowing them to manage user accounts, approve or reject Eco-Partner applications, update conversion rates, and oversee content such as announcements and educational materials. '}  />
        </div>
      </LandingLightContainer>
    </div>
  );
}

export default Services;

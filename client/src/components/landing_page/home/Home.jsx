import React from "react";
import imgbg from "../../../assets/images/Ellipse 24.png";
import playstore_logo from "../../../assets/images/playstore_logo.png";
import phone_hold from "../../../assets/images/phone_hold.png";
function Home() {
  return (
    <>
      <div className="grid grid-cols-2 z-10  min-h-full px-10 pt-44">
        <div className=" h-full">
          <img className="absolute left-32 bottom-0 w-[40%]" src={phone_hold} />
        </div>
        <div className=" px-24">
          <h1 className=" text-neutral-50 text-biggest  leading-extra-loose">
            TURN WASTE INTO WEALTH: CLEAN, EARN, SUSTAIN.
          </h1>
          <h2 className=" mt-8 mb-8 text-dark_font">
            Make Every waste count for a greener future. Donload the
            KalaKalikasan App now!
          </h2>
          <div className=" w-60 rounded-lg">
            <img className=" rounded-lg" src={playstore_logo} />
          </div>
        </div>
      </div>    
      <img className="fixed top-0 right-0 w-3/4 -z-10 h-svh" src={imgbg} />
    </>
  );
}
export default Home;

import React from "react";
import imgbg from "../../../assets/images/Ellipse 24.png";
import playstore_logo from "../../../assets/images/android-download.png";
import phone_hold from "../../../assets/images/phone_hold.png";
function Home() {
  return (
    <>
      <div className="grid lg:grid-cols-2 z-10  min-h-full px-8  pt-20 lg:px-10 lg:pt-44">
        <div className=" h-full">
          <img className="absolute left-32 -bottom-10 w-[40%]" src={phone_hold} />
        </div>
        <div className="lg:grid-cols-1 px-4 lg:px-24">
            <h1 className=" text-neutral-50 text-3xl lg:text-biggest lg:leading-extra-loose">
              TURN WASTE INTO WEALTH: CLEAN, EARN, SUSTAIN.
            </h1>
            <h2 className="mt-8 text-xl lg:text-3xl text-dark_font">
              Make Every waste count for a greener future. Download the
              KalaKalikasan App now!
            </h2>
          <div className=" w-60 rounded-lg mt-8">
            <img className=" rounded-lg" src={playstore_logo} />
          </div>
        </div>
      </div>
      <img className="fixed top-0 right-24 scale-[170%]  md:top-0 md:right-0 md:w-3/4 -z-10 md:h-svh" src={imgbg} />
    </>
  );
}
export default Home;

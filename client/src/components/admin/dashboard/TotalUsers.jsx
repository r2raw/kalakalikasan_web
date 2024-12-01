import React from "react";

import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import StoreMallDirectorySharpIcon from "@mui/icons-material/StoreMallDirectorySharp";
import Diversity2SharpIcon from "@mui/icons-material/Diversity2Sharp";
function TotalUsers() {
  return (
    <div className="card flex-col gap-4">
      <h4 className="text-dark_font"> Total Number of Users</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center text-dark_font card px-16  relative bg-gradient-to-r from-light_gradient_top to-light_gradient_bot">
          <h5 className=" self-start">100,000</h5>
          <h6 className="  self-start z-10">Eco-Actors</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-dark_font/30">
            <PeopleAltSharpIcon />
          </div>
        </div>
        <div className="flex flex-col items-center text-dark_font card  relative bg-gradient-to-r from-light_gradient_top to-light_gradient_bot">
          <h5 className=" self-start">100,000</h5>
          <h6 className="  self-start z-10">Eco-Partners</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-dark_font/30">
            <StoreMallDirectorySharpIcon />
          </div>
        </div>
        <div className="flex flex-col items-start text-dark_font card  relative bg-gradient-to-r from-light_gradient_top to-light_gradient_bot">
          <h5 className=" self-start">100,000</h5>
          <h6 className="  self-start z-10">Officers</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-dark_font/30">
            <Diversity2SharpIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalUsers;

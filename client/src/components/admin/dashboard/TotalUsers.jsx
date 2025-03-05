import React from "react";

import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import StoreMallDirectorySharpIcon from "@mui/icons-material/StoreMallDirectorySharp";
import Diversity2SharpIcon from "@mui/icons-material/Diversity2Sharp";
import { useQuery } from "@tanstack/react-query";
import { fetchTotalUsers } from "../../../util/http";
import CustomLoader from "../../models/CustomLoader";
function TotalUsers() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users", "total"],
    queryFn: ({ signal }) => fetchTotalUsers({ signal }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  });

  let actorCount = 0;
  let officerCount = 0;
  let partnerCount = 0;

  if (isPending) {
    actorCount = <CustomLoader />
    officerCount = <CustomLoader />
    partnerCount = <CustomLoader />
  }

  if (isError) {
    actorCount = <div className="bg-red-200 w-full px-4 py-4">

      <p className="text-red-700">{error.info?.error || 'an error occured'}</p>
    </div>
    officerCount = <div className="bg-red-200 w-full px-4 py-4">

      <p className="text-red-700">{error.info?.error || 'an error occured'}</p>
    </div>
    partnerCount = <div className="bg-red-200 w-full px-4 py-4">

      <p className="text-red-700">{error.info?.error || 'an error occured'}</p>
    </div>
  }

  if(data){
    actorCount = data.actors;
    officerCount = data.officers;
    partnerCount = data.partners;
  }


  return (
    <div className="card flex-col gap-4">
      <h4 className="text-dark_font"> Total Number of Users</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col items-center card px-16  relative textured-bg">
          <h5 className=" self-start text-secondary_color">{actorCount}</h5>
          <h6 className="  self-start z-10 text-secondary_color">Eco-Actors</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-secondary_color/30">
            <PeopleAltSharpIcon />
          </div>
        </div>
        <div className="flex flex-col items-center text-secondary_color card  relative  textured-bg">
          <h5 className=" self-start text-secondary_color">{partnerCount}</h5>
          <h6 className="  self-start z-10 text-secondary_color">Eco-Partners</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-secondary_color/30">
            <StoreMallDirectorySharpIcon />
          </div>
        </div>
        <div className="flex flex-col items-start text-secondary_color card  relative  textured-bg">
          <h5 className=" self-start text-secondary_color">{officerCount}</h5>
          <h6 className="  self-start z-10 text-secondary_color">Officers</h6>
          <div className="absolute bottom-0 right-0 -z-0 text-secondary_color/30">
            <Diversity2SharpIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalUsers;

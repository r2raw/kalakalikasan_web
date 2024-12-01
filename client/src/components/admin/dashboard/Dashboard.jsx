import React from "react";
import ScheduleToday from "./ScheduleToday";
import UpcomingSchedule from "./UpcomingSchedule";
import MasonryContainer from "./MasonryContainer";
import TotalUsers from "./TotalUsers";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MasonryContainer>
          <ScheduleToday />
          <UpcomingSchedule />
        </MasonryContainer>
        <MasonryContainer>
          <TotalUsers />
          <UpcomingSchedule />
          <UpcomingSchedule />
        </MasonryContainer>
        <div className="flex flex-col"></div>
      </div>
    </>
  );
}

export default Dashboard;

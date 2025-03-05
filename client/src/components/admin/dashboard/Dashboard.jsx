import React from "react";
import ScheduleToday from "./ScheduleToday";
import UpcomingSchedule from "./UpcomingSchedule";
import MasonryContainer from "./MasonryContainer";
import TotalUsers from "./TotalUsers";
import DashboardMap from "./DashboardMap";
import BarangayCollectionSummary from "./BarangayCollectionSummary";
import TotalWasteToday from "./TotalWasteToday";
import MaterialsCollectedToday from "./MaterialsCollectedToday";
import TopReactedContents from "./TopReactedContents";
import RecentReactor from "./RecentReactor";
import TopCommentedContent from "./TopCommentedContent";
import RecentCommentor from "./RecentCommentor";
function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MasonryContainer>
          <TotalUsers />
          <ScheduleToday />
          <UpcomingSchedule />
        </MasonryContainer>
        <MasonryContainer>
          <TotalWasteToday />
          <MaterialsCollectedToday />
          <TopReactedContents />
        </MasonryContainer>
        <MasonryContainer>
          <RecentReactor />
          <TopCommentedContent />
          <RecentCommentor />
        </MasonryContainer>
      </div>
    </>
  );
}

export default Dashboard;

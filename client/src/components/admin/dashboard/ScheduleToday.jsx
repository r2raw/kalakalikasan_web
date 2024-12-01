import React from "react";

function ScheduleToday() {
  return (
    <>
      <h4 className="bg-dark_font py-4 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
        Today's Collection Schedule
      </h4>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Barangay</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Batasan Hills</td>
              <td>9:00 am - 10:00 am</td>
            </tr>
            <tr>
              <td>Holy Spirit</td>
              <td>9:00 am - 10:00 am</td>
            </tr>
            <tr>
              <td>Commonwealth</td>
              <td>9:00 am - 10:00 am</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ScheduleToday;

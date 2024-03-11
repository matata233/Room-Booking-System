import React from "react";
import "react-calendar/dist/Calendar.css";
import EventCalendar from "../components/EventCalendar/EventCalendar";

const UserSchedulePage = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col gap-10 2xl:flex-row">
        <div className="flex items-center justify-center">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default UserSchedulePage;

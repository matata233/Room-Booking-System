import React from "react";
import "react-calendar/dist/Calendar.css";
import EventCalendar from "../components/EventCalendar/EventCalendar";

const UserSchedulePage = () => {
  return (
    <div className="flex items-center justify-center">
      <EventCalendar />
    </div>
  );
};

export default UserSchedulePage;

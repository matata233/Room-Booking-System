import React from "react";
import TimeSelect from "../components/TimeSelect";

const UserAvailabilityPage = () => {
  return (
    <div className="flex flex-col ">
      <h1 className="mb-10 text-2xl font-semibold">
        Select Your Unavailable Time
      </h1>
      <div className="flex flex-col items-center gap-3">
        <TimeSelect />
      </div>
    </div>
  );
};

export default UserAvailabilityPage;

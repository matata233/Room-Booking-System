import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";

const TimeDropdowns = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : `${i}`;
      options.push(`${hour}:00`);
      options.push(`${hour}:30`);
    }
    return options;
  };

  // Function to filter past dates
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div>Date</div>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="MMMM d, yyyy"
        minDate={new Date()}
        showTimeSelect
        filterDate={filterPassedTime}
        className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
      />
      <input
        type="time"
        value={startTime}
        onChange={(event) => setStartTime(event.target.value)}
      />
      <div>Start Time</div>
      <div className="relative">
        <select
          className="block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          value={startTime}
          onChange={handleStartTimeChange}
        >
          {generateTimeOptions().map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <img
            src={DropdownArrowSVG}
            alt="Dropdown Arrow"
            className="h-5 w-5"
          />
        </div>
      </div>

      <div className="mt-4">End Time</div>
      <div className="relative mb-4">
        <select
          className="block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          value={endTime}
          onChange={handleEndTimeChange}
        >
          {generateTimeOptions().map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <img
            src={DropdownArrowSVG}
            alt="Dropdown Arrow"
            className="h-5 w-5"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeDropdowns;

import React, { useState, useEffect } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { setStartDate, setStartTime, setEndTime } from "../slices/bookingSlice";
import dayjs from "dayjs";

const TimeDropdowns = () => {
  const dispatch = useDispatch();
  const { startDate, startTime, endTime } = useSelector(
    (state) => state.booking,
  );

  const handleDateChange = (e) => {
    dispatch(setStartDate(e.target.value));
  };

  const handleStartTimeChange = (e) => {
    dispatch(setStartTime(e.target.value));
  };

  const handleEndTimeChange = (e) => {
    dispatch(setEndTime(e.target.value));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        const minute = j === 0 ? "00" : `${j}`;
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const validateEndTime = () => {
    const startDateTime = dayjs(`${startDate} ${startTime}`);
    const endDateTime = dayjs(`${startDate} ${endTime}`);
    if (endDateTime.isBefore(startDateTime)) {
      dispatch(setEndTime("23:45")); // Reset end time to 23:45
      alert("End time should be later than start time.");
    }
  };

  useEffect(() => {
    validateEndTime();
  }, [startTime, endTime, startDate]);

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div>Date</div>
      <DateRangePicker format="MM/dd/yyyy HH:mm" />
      <div>Start Time</div>
      <div className="relative">
        <select
          className="block w-full cursor-pointer appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
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
          className="block w-full cursor-pointer appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
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

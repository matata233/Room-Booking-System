import React, { useState, useEffect } from "react";
import {
  setStartTime,
  setStartDate,
  setDuration,
  setUnit,
} from "../slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import dayjs from "dayjs";

const UserTimeInput = () => {
  const dispatch = useDispatch();
  const { startTime, startDate, duration, unit } = useSelector(
    (state) => state.booking,
  );

  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    generateTimeOptions();
  }, [startDate]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const generateTimeOptions = () => {
    const options = [];
    const currentDate = dayjs().format("YYYY-MM-DD");
    const selectedDate = dayjs(startDate).format("YYYY-MM-DD");

    let startHour = 0;
    let startMinute = 0;

    if (selectedDate === currentDate) {
      // If the selected date is the current date, start from the next 15-minute interval
      startHour = dayjs().hour();
      startMinute = Math.ceil(dayjs().minute() / 15) * 15;
      if (startMinute === 60) {
        startHour++;
        startMinute = 0;
      }
    }

    for (let i = startHour; i < 24; i++) {
      for (let j = startMinute; j < 60; j += 15) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        const minute = j < 10 ? `0${j}` : `${j}`;
        options.push(`${hour}:${minute}`);
      }
      startMinute = 0;
    }

    setTimeOptions(options);
  };

  const handleStartDateChange = (e) => {
    dispatch(setStartDate(e.target.value));
  };

  const handleStartTimeChange = (e) => {
    dispatch(setStartTime(e.target.value));
  };

  const handleDurationChange = (e) => {
    dispatch(setDuration(e.target.value));
  };

  const handleUnitChange = (e) => {
    dispatch(setUnit(e.target.value));
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div className="mb-2">Start Date</div>
      <input
        type="date"
        value={startDate}
        min={getCurrentDate()}
        onChange={handleStartDateChange}
        className="w-full cursor-pointer appearance-none rounded-md bg-white px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        required
      />
      <div className="mb-2 mt-4">Start Time</div>
      <div className="relative">
        <select
          className="w-full cursor-pointer appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          value={startTime}
          onChange={handleStartTimeChange}
        >
          {timeOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
          <img
            src={DropdownArrowSVG}
            alt="Dropdown Arrow"
            className="h-5 w-5"
          />
        </div>
      </div>

      <div className="mb-2 mt-4">Duration</div>
      <div className="flex  items-center justify-between">
        <input
          type="number"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          className="w-48 rounded-lg border  px-4 py-1 focus:outline-none"
          placeholder="Duration"
        />

        <select
          value={unit}
          onChange={handleUnitChange}
          className="cursor-pointer rounded-lg border px-1 py-1 focus:outline-none"
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>
    </div>
  );
};

export default UserTimeInput;

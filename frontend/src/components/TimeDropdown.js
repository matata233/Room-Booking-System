import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { setStartDate, setStartTime, setEndTime } from "../slices/bookingSlice";
import dayjs from "dayjs";

const TimeDropdowns = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking);

  const handleStartTimeChange = (e) => {
    dispatch(setStartTime(e.target.value));
  };

  const handleEndTimeChange = (e) => {
    dispatch(setEndTime(e.target.value));
  };

  const handleStartDateChange = (e) => {
    const inputValue = e.target.value;

    const selectedDate = dayjs(inputValue || undefined)
      .startOf("day")
      .toDate(); // Get 12AM of time

    dispatch(setStartDate(selectedDate));
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div className="mb-2">
        Date<span className="text-red-600">*</span>
      </div>
      <input
        type="date"
        value={booking.startDate}
        onChange={handleStartDateChange}
        className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        aria-label="Date"
        required
      />
      {console.log(booking.startDate)}

      <div className="mb-2">
        Start Time<span className="text-red-600">*</span>
      </div>
      <input
        type="time"
        value={booking.startTime}
        onChange={handleStartTimeChange}
        className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        aria-label="Start Time"
        required
      />

      <div className="mb-2 mt-4">
        End Time<span className="text-red-600">*</span>
      </div>
      <input
        type="time"
        value={booking.endTime}
        onChange={handleEndTimeChange}
        className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        aria-label="End Time"
        required
      />
    </div>
  );
};

export default TimeDropdowns;

import dayjs from "dayjs";
import React, { useState } from "react";

const AddEvent = ({ onSubmit, selectedDate }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(selectedDate || new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const inputValue = e.target.value;

    const selectedDate = dayjs(inputValue || undefined)
      .startOf("day")
      .toDate(); // Get 12AM of time

    setStartDate(selectedDate);
  };

  const handleSubmit = () => {
    if (title && startDate && startTime && endTime) {
      onSubmit({
        title,
        startDate,
        startTime,
        endTime,
      });
      setStartDate(selectedDate);
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Add Events</h1>
      <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4 ">
        <div className="mb-2">
          Title<span className="text-red-600">*</span>
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          aria-label="Title"
          required
        />

        <div className="mb-2">
          Date<span className="text-red-600">*</span>
        </div>
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={handleStartDateChange}
          className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          aria-label="Date"
          required
        />

        <div className="mb-2">
          Start Time<span className="text-red-600">*</span>
        </div>
        <input
          type="time"
          value={startTime}
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
          value={endTime}
          onChange={handleEndTimeChange}
          className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          aria-label="End Time"
          required
        />

        <button
          onClick={handleSubmit}
          className="my-4 rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddEvent;

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import { MdDelete } from "react-icons/md";
import PlusButtonSVG from "../assets/plus-button.svg";

const TimeSelect = () => {
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      startDate: new Date(),
      startTime: "",
      endTime: "",
      submitted: false,
    },
  ]);

  const handleStartTimeChange = (e, index) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index].startTime = e.target.value;
    setTimeEntries(updatedEntries);
  };

  const handleEndTimeChange = (e, index) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index].endTime = e.target.value;
    setTimeEntries(updatedEntries);
  };

  const handleDateChange = (date, index) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index].startDate = date;
    setTimeEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    setTimeEntries((prevEntries) => [
      ...prevEntries,
      {
        id: prevEntries.length + 1,
        startDate: new Date(),
        startTime: "",
        endTime: "",
        submitted: false,
      },
    ]);
  };

  const handleDeleteEntry = (index) => {
    setTimeEntries((prevEntries) => [
      ...prevEntries.slice(0, index),
      ...prevEntries.slice(index + 1),
    ]);
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

  const handleSubmit = (index) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index].submitted = true;
    setTimeEntries(updatedEntries);
  };

  return (
    <div>
      {timeEntries.map((entry, index) => (
        <div
          key={entry.id}
          className={`mb-4 rounded-lg ${
            entry.submitted ? "bg-zinc-300" : "bg-zinc-200"
          }`}
        >
          <div className="flex flex-row gap-10 p-4">
            <div>
              <div>Date</div>
              <DatePicker
                selected={entry.startDate}
                minDate={new Date()}
                onChange={(date) => handleDateChange(date, index)}
                dateFormat="MMMM d, yyyy"
                className={`mb-4 block w-64 appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                  entry.submitted && "pointer-events-none opacity-50"
                }`}
                disabled={entry.submitted}
              />
            </div>
            <div>
              <div>Start Time</div>
              <div className="relative">
                <select
                  className={`block w-64 appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                    entry.submitted && "pointer-events-none opacity-50"
                  }`}
                  value={entry.startTime}
                  onChange={(e) => handleStartTimeChange(e, index)}
                  disabled={entry.submitted}
                >
                  {generateTimeOptions().map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
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
            <div>
              <div>End Time</div>
              <div className="relative">
                <select
                  className={`block w-64 appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none ${
                    entry.submitted && "pointer-events-none opacity-50"
                  }`}
                  value={entry.endTime}
                  onChange={(e) => handleEndTimeChange(e, index)}
                  disabled={entry.submitted}
                >
                  {generateTimeOptions().map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
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
            <button
              type="button"
              onClick={() => handleDeleteEntry(index)}
              className="px-2 py-1 text-red-500"
            >
              <MdDelete className="size-5" />
            </button>
            <div className="my-4 flex justify-center">
              <button
                type="button"
                onClick={() => handleSubmit(index)}
                className={`rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white ${
                  entry.submitted && "pointer-events-none opacity-50"
                }`}
                disabled={entry.submitted}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="my-4 flex flex-col justify-center">
        <button
          type="button"
          onClick={handleAddEntry}
          className="flex justify-center rounded-md px-4 py-2"
        >
          <img src={PlusButtonSVG} alt="Add Time Icon" className="h-8 w-10" />
        </button>
      </div>
    </div>
  );
};

export default TimeSelect;

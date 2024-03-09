import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import { MdDelete } from "react-icons/md";
import PlusButtonSVG from "../assets/plus-button.svg";
import { v4 as uuidv4 } from "uuid";

const TimeSelect = () => {
  const initialTimeEntriesState = () => ({
    id: uuidv4(),
    startDate: new Date(),
    startTime: "00:00",
    endTime: "00:00",
    submitted: false,
  });

  const [timeEntries, setTimeEntries] = useState([initialTimeEntriesState()]);

  const handleChangeDateTime = (key, value, index) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index][key] = value;
    setTimeEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    setTimeEntries((prevEntries) => [
      ...prevEntries,
      initialTimeEntriesState(),
    ]);
  };

  const handleDeleteEntry = (id) => {
    setTimeEntries((prevEntries) => prevEntries.filter((x) => x.id !== id));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = String(i).padStart(2, "0");
        const minute = String(j).padStart(2, "0");
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
          <div className="flex flex-col items-center gap-2 p-4 md:flex-row md:gap-6 lg:gap-10">
            <div>
              <div>Date</div>
              <DatePicker
                selected={entry.startDate}
                minDate={new Date()}
                onChange={(date) =>
                  handleChangeDateTime("startDate", date, index)
                }
                dateFormat="MMMM d, yyyy"
                className={`mb-4 block w-60 appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-40 xl:w-64 ${
                  entry.submitted && "pointer-events-none opacity-50"
                }`}
                disabled={entry.submitted}
              />
            </div>
            <div>
              <div>Start Time</div>
              <div className="relative">
                <select
                  className={`mb-4 block w-60  appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-40 xl:w-64 ${
                    entry.submitted && "pointer-events-none opacity-50"
                  }`}
                  value={entry.startTime}
                  onChange={(e) =>
                    handleChangeDateTime("startTime", e.target.value, index)
                  }
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
                  className={`mb-4  block  w-60 appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none md:w-40 xl:w-64 ${
                    entry.submitted && "pointer-events-none opacity-50"
                  }`}
                  value={entry.endTime}
                  onChange={(e) =>
                    handleChangeDateTime("endTime", e.target.value, index)
                  }
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
              onClick={() => handleDeleteEntry(entry.id)}
              className="px-2 py-1 text-red-500"
            >
              <MdDelete className="size-5" />
            </button>
            <div className="flex justify-center">
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

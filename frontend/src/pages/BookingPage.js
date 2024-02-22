import React from "react";
import BookingStepper from "../components/BookingStepper";
import DrapAndDrop from "../components/DragAndDrop";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import StartSearchGIF from "../assets/start-search.gif";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";

const BookingPage = () => {
  return (
    <div className="flex w-full flex-col  gap-y-12 font-amazon-ember">
      <BookingStepper />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="basis-1/3">
          <h1 className="mb-4 text-xl font-semibold">Book a Room</h1>
          <div className="flex flex-col gap-3">
            <h2>Select Time</h2>
            <TimeDropdowns />
            {/* <h2>Meeting Type</h2>
            <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
              <div className="relative">
                <select className="block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none">
                  <option value="local">Local</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <img
                    src={DropdownArrowSVG}
                    alt="Dropdown Arrow"
                    className="h-5 w-5"
                  />
                </div>
              </div>
            </div> */}
            <h2>Priority</h2>
            <DrapAndDrop />
            <h2>Enter all user email</h2>
            <UserEmailInput />
            <div className="my-4 flex w-80 justify-center">
              <button
                type="submit"
                className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="flex basis-2/3 flex-col items-center">
          <div className="mb-4 text-xl font-semibold">Available Rooms</div>
          <img
            src={StartSearchGIF}
            alt="Start Search SVG"
            className="w-full lg:w-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import React, { useState, useMemo } from "react";
import BookingStepper from "../components/BookingStepper";
import DragAndDrop from "../components/DragAndDrop";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import StartSearchGIF from "../assets/start-search.gif";
// import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import Pagination from "../components/Pagination";
import dummyRooms from "../dummyData/dummyRooms";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";

const BookingPage = () => {
  const data = useMemo(() => dummyRooms, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination event handlers
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
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
            <DragAndDrop />
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
        <div className="flex basis-2/3 flex-col">
          <div className="mb-4 text-xl font-semibold">Available Rooms</div>
          {paginatedData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {paginatedData.map((room) => (
                <div
                  key={room.roomId}
                  className=" flex flex-col justify-between bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl xl:flex-row"
                >
                  <div className="flex flex-col items-center xl:flex-row">
                    <div className="">
                      <img
                        src={MeetingRoomImg}
                        alt="meeting room"
                        className="h-[25vh] object-cover"
                      />
                    </div>
                    <div className="mt-6 flex flex-col xl:ml-6 xl:mt-0">
                      <div className="font-semibold">
                        Room ID: {room.roomId}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Location:</span>{" "}
                        {room.location.city}, {room.location.building}, Floor{" "}
                        {room.location.floor}, Room {room.location.room}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Equipments:</span>{" "}
                        {room.equipments.join(", ")}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Number of Seats:</span>{" "}
                        {room.numSeat}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Is Active:</span>{" "}
                        {room.is_active ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  <div className="m-5 flex justify-center xl:items-end">
                    <Link
                      to="#"
                      className="rounded bg-theme-orange px-8 py-0.5 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <img
              src={StartSearchGIF}
              alt="Start Search SVG"
              className="w-full lg:w-1/2"
            />
          )}
          <div className="my-4">
            <Pagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              count={data.length}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

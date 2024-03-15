import React, { useState, useMemo } from "react";
import BookingStepper from "../components/BookingStepper";
import DragAndDrop from "../components/DragAndDrop";
import UserEquipInput from "../components/UserEquipInput";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import StartSearchGIF from "../assets/start-search.gif";
import Pagination from "../components/Pagination";
import dummyRoomBooking from "../dummyData/dummyRoomBooking";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import UserRoomCountInput from "../components/UserRoomCountInput";
import UserEmailGroup from "../components/UserEmailGroup";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../slices/bookingSlice";
import { useGetAvailableRoomsMutation } from "../slices/bookingApiSlice";

const BookingPage = () => {
  const data = useMemo(
    () => dummyRoomBooking.filter((room) => room.is_active),
    [],
  );
  const dispatch = useDispatch();

  const {
    startTime,
    endTime,
    startDate,
    equipments,
    priority,
    roomCount,
    groupedAttendees,
    ungroupedAttendees,
    searchOnce,
  } = useSelector((state) => state.booking);

  const [getAvailableRooms, { isLoading }] = useGetAvailableRoomsMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDateTime = new Date(
      `${startDate}T${startTime}:00.000Z`,
    ).toISOString();
    const endDateTime = new Date(
      `${startDate}T${endTime}:00.000Z`,
    ).toISOString();
    const reqBody = {
      startTime: startDateTime,
      endTime: endDateTime,
      attendees: ungroupedAttendees, // Assuming attendees array contains objects with an email property
      equipments, // Assuming this is already in the desired format
      priority: priority.map((item) => item.item), // Assuming you want to send the item names
    };
    const availableRooms = await getAvailableRooms(reqBody).unwrap();
    console.log(availableRooms);
  };

  const handleReset = () => {
    dispatch(resetBooking());
  };

  return (
    <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
      <BookingStepper />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="flex basis-1/3 flex-col items-center justify-center">
          {" "}
          <form onSubmit={handleSubmit}>
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
              <h2>Equipments</h2>
              <UserEquipInput />
              <h2>Priority</h2>
              <DragAndDrop />
              <h2>Number of Rooms </h2>
              <UserRoomCountInput />
              {searchOnce ? (
                <>
                  <h2>Enter user emails by group</h2>
                  <UserEmailGroup />
                </>
              ) : (
                <>
                  <h2>Enter all user emails</h2>
                  <UserEmailInput />
                </>
              )}

              <div className="my-4 flex w-80 justify-center">
                <button
                  type="submit"
                  className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
          <button
            onClick={handleReset}
            className="rounded bg-theme-dark-blue px-[54px] py-2 text-white transition-colors duration-300  ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Reset
          </button>
        </div>
        <div className="flex basis-2/3 flex-col">
          <div className="flex items-center justify-between">
            <div className="mb-4 text-xl font-semibold">Available Rooms</div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={StartSearchGIF}
              alt="Start Search SVG"
              className="w-full lg:w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

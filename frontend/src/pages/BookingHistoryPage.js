import React, { useState, useMemo } from "react";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import { useGetBookingCurrentUserQuery } from "../slices/bookingApiSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Pagination from "../components/Pagination";
import { mirage } from "ldrs";
import StartSearchGIF from "../assets/start-search.gif";

const BookingHistoryPage = () => {
  const {
    data: booking,
    error,
    isLoading,
    refetch,
  } = useGetBookingCurrentUserQuery();

  const bookingData = useMemo(() => {
    if (isLoading || !booking || !booking.result) {
      return [];
    }
    console.log("Got booking data");
    return booking.result;
  }, [isLoading, booking]);

  mirage.register();

  console.log("hi", bookingData);

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

  function formatDateTime(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const formattedDate = startDate.toISOString().split("T")[0];

    const formattedStartTime = startDate
      .toISOString()
      .split("T")[1]
      .substring(0, 5);

    const formattedEndTime = endDate
      .toISOString()
      .split("T")[1]
      .substring(0, 5);

    return {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  }

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="flex w-full flex-col items-center gap-y-12 font-amazon-ember">
        <h1 className="text-center text-2xl font-semibold">Booking History</h1>

        {bookingData.length > 0 ? (
          <>
            <div className="flex flex-col">
              {bookingData.map((book) => (
                <div
                  key={book.bookingId}
                  className="relative mx-6 mb-10 bg-white px-5 pb-5 pt-[120px] shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:pt-[105px] lg:pt-28"
                >
                  {/* ----- */}
                  {book.groups.map((group, index) => (
                    <div>
                      <div
                        key={group.room.roomId}
                        className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between lg:gap-20 "
                      >
                        <div className="absolute -top-2 bg-theme-orange px-5 py-1 lg:-left-10 lg:top-7">
                          <div>
                            <span className="font-semibold">Time:</span>{" "}
                            {`${formatDateTime(book.startTime, book.endTime).date}` +
                              " " +
                              `${formatDateTime(book.startTime, book.endTime).startTime}` +
                              " - " +
                              `${formatDateTime(book.startTime, book.endTime).endTime}`}
                          </div>
                          <div className="">
                            <span className="font-semibold">Booked by:</span>{" "}
                            {book.users.email}
                          </div>
                        </div>
                        {index == 0 && (
                          <div className="text-md absolute top-20 m-2 text-center font-semibold sm:top-14 lg:left-80 lg:top-9">
                            {book.status == "confirmed" ? (
                              <div className="text-green-500">
                                {" "}
                                Confirmed <CheckIcon />{" "}
                              </div>
                            ) : (
                              <div className="text-red-500">
                                {" "}
                                Canceled <CancelIcon />{" "}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Room Information */}
                        <div className="flex flex-row items-center gap-2 lg:items-start ">
                          <div className="m-5 hidden  lg:flex">
                            <img
                              src={MeetingRoomImg}
                              alt="meeting room"
                              className="h-[20vh]"
                            />
                          </div>

                          <div className="mt-2 flex flex-col justify-center sm:justify-start">
                            <div className="m-2 border-b-2 border-zinc-200 text-left font-semibold">
                              <h2>Room Information:</h2>
                            </div>
                            <div className="w-72 px-2">
                              <div className="text-mb text-theme-orange">
                                {`${group.room.city.cityId}${group.room.building.code} ${group.room.floorNumber.toString().padStart(2, "0")}.${group.room.roomCode} ${group.room.roomName ? group.room.roomName : ""} `}{" "}
                              </div>

                              <div className="">
                                <span className="font-semibold">
                                  Equipments:
                                </span>{" "}
                                {group.room.equipmentList.length > 0
                                  ? group.room.equipmentList
                                      .map((equip) => equip.equipmentId)
                                      .join(" / ")
                                  : "None"}
                              </div>
                              <div className="">
                                <span className="font-semibold">
                                  Number of Seats:
                                </span>{" "}
                                {group.room.numberOfSeats}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Attendees */}
                        <div className="mb-5 mt-8 flex flex-col sm:mx-5 lg:mt-2">
                          <div className="m-2 border-b-2 border-zinc-200 text-left font-semibold">
                            <h2>Attendee(s):</h2>
                          </div>
                          <div className=" w-72 px-2">
                            {group.attendees.map((attendee) => (
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                                <div className="ml-2">{attendee.email}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {book.groups.length > 1 &&
                        index < book.groups.length - 1 && (
                          <>
                            <div className="break"></div>
                            <div className="flex-item mx-auto  my-5 w-full border-t-2 border-dashed border-theme-orange"></div>
                          </>
                        )}
                    </div>
                  ))}
                  {book.status == "confirmed" &&
                    userInfo.email == book.users.email && (
                      <div className="mr-5 flex justify-end">
                        <div className="flex space-x-4 ">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 "
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEdit className="size-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MdDelete className="size-5" />
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
            <div className="mb-20 flex justify-center">
              <Pagination
                count={bookingData.length}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mt-20 text-center">
              <l-mirage size="150" speed="2.5" color="orange"></l-mirage>{" "}
              Searching...
            </div>
            <img
              src={StartSearchGIF}
              alt="Start Search"
              className="h-96 w-96"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;

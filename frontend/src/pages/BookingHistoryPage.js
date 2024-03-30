import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import {
  useGetBookingCurrentUserQuery,
  useUpdateBookingMutation,
} from "../slices/bookingApiSlice";
import { setGroupedAttendees, setUngroupedAttendees } from "../slices/bookingSlice";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Pagination from "../components/Pagination";
import { mirage } from "ldrs";
import StartSearchGIF from "../assets/start-search.gif";
import { toast } from "react-toastify";
import EditBookingModal from "../components/EditBookingModal";
import CancelConfirmationModal from "../components/CancelConfirmationModal";
import moment from "moment-timezone";

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
    return booking.result;
  }, [isLoading, booking]);

  const [updateBooking] = useUpdateBookingMutation();
  const dispatch = useDispatch();
  const { ungroupedAttendees } = useSelector((state) => state.booking);

  mirage.register();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //edit
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const handleEditBooking = (booking, index) => {
    dispatch(setUngroupedAttendees(booking.groups[index].attendees));
    setIsEditing(true);
    setSelectedBooking(booking);
    setSelectedGroup(index);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsEditing(false);
  };

  const handleCancelConfirmOpen = (booking) => {
    setIsCancelConfirmOpen(true);
    setSelectedBooking(booking);
  };

  const handleCancelBooking = async () => {
    try {
      await updateBooking({
        bookingId: selectedBooking.bookingId,
        updatedBooking: { 
          status: "canceled", 
          users: getAttendees(selectedBooking), 
          rooms: getRooms(selectedBooking) 
        },
      }).unwrap();
      toast.success("Booking updated");
      setIsCancelConfirmOpen(false);
      // bookingData = [];
      // Close the modal
    } catch (err) {
      // Display error toast message
      console.log(err);
      toast.error(err?.data?.error || "Failed to save book");
    }
  };

  const handleSaveBooking = async () => {
    try {
      console.log("selected booking", selectedBooking);
      const users = getAttendees(selectedBooking);
      const newAttendees = [];
      ungroupedAttendees.map((attendee) => {
        newAttendees.push(attendee.userId);
      });
      users[selectedGroup] = newAttendees;
      const body = { 
        status: "confirmed",
        users:users,
        rooms:getRooms(selectedBooking)
      }
      console.log(body);
      await updateBooking({
        bookingId: selectedBooking.bookingId,
        updatedBooking: { status: "confirmed", users: users, rooms: getRooms(selectedBooking) },
      }).unwrap();
      toast.success("Booking updated");
      // Close the modal
      handleCloseModal();
    } catch (err) {
      // Display error toast message
      console.log(err);
      toast.error(err?.data?.error || "Failed to save book");
    }
  };

  // Pagination event handlers
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  function formatDateTime(utcTime) {
    const transferedTime = moment(utcTime)
      .tz(moment.tz.guess())
      .format("YYYY-MM-DD HH:mm z");

    const [date, time, timezone] = transferedTime.split(" ");

    return {
      date: date,
      time: time,
      timezone: timezone,
    };
  }

  function getRooms(booking) {
    const rooms = [];
    booking.groups.forEach((group) => {
      rooms.push(group.room.roomId);
    })
    return rooms;
  }

  function getAttendees(booking) {
    const allAttendees = [];
    booking.groups.forEach((group) => {
      const attendees = [];
      group.attendees.forEach((attendee) => {
        attendees.push(attendee.userId);
      });
      allAttendees.push(attendees);
    })
    return allAttendees;
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
                  className="relative mx-6 mb-10 bg-white px-2 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:pt-28"
                >
                  {/* ----- */}
                  {book.groups.map((group, index) => (
                    <div>
                      <div
                        key={group.room.roomId}
                        className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between lg:gap-24 "
                      >
                        <div className="w-full bg-theme-orange px-5 py-1 lg:absolute lg:-left-10 lg:top-7 lg:w-auto">
                          <div>
                            <span className="font-semibold">Time:</span>{" "}
                            {`${formatDateTime(book.startTime).date} ` +
                              `${formatDateTime(book.startTime).time} ` +
                              (formatDateTime(book.startTime).date ===
                              formatDateTime(book.endTime).date
                                ? `- ${formatDateTime(book.endTime).time} ${formatDateTime(book.endTime).timezone}`
                                : `to ${formatDateTime(book.endTime).date} ${formatDateTime(book.endTime).time} ${formatDateTime(book.endTime).timezone}`)}
                          </div>

                          <div>
                            <span className="font-semibold">Booked by:</span>{" "}
                            {book.users.email}
                          </div>
                        </div>

                        {index == 0 && (
                          <div className="text-md mt-4 flex w-full justify-end pr-2 font-semibold lg:absolute lg:right-5 lg:top-7">
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
                          <div className="m-5 hidden lg:flex">
                            <img
                              src={MeetingRoomImg}
                              alt="meeting room"
                              className="h-[20vh]"
                            />
                          </div>

                          <div className="flex flex-col justify-center sm:justify-start lg:mt-2">
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
                        <div className="my-6 flex flex-col sm:mx-5 lg:mt-2">
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
                      {book.status === "confirmed" &&
                        userInfo.email === book.users.email && (
                          <div className="mr-2 lg:mr-5">
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                onClick={(e) => handleEditBooking(book, index)}
                                className="rounded bg-theme-orange px-5 py-2 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white"
                              >
                                Edit Attendee(s)
                              </button>
                            </div>
                            {index === book.groups.length - 1 && (
                              <div className="mt-3">
                                <div className="w-full border-t border border-grey-700"></div>
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={() => handleCancelConfirmOpen(book)}
                                    className="rounded border border-theme-orange bg-white px-5 py-2 text-black transition-colors duration-300 ease-in-out hover:bg-red-500 hover:text-white"
                                  >
                                    Cancel Booking
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      {book.groups.length > 1 &&
                        index < book.groups.length - 1 && (
                          <>
                            <div className="break"></div>
                            <div className="flex-item mx-auto  my-5 w-full border-t-2 border-dashed border-theme-orange"></div>
                          </>
                        )}
                    </div>
                  ))}
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

      {isEditing && (
        <EditBookingModal
          onUpdate={handleSaveBooking}
          onClose={handleCloseModal}
        />
      )}
      {isCancelConfirmOpen && (
        <CancelConfirmationModal
          onCancel={() => setIsCancelConfirmOpen(false)}
          onClose={() => setIsCancelConfirmOpen(false)}
          onConfirm={handleCancelBooking}
          message={"Are you sure you want to cancel this booking?"}
        />
      )}
    </div>
  );
};

export default BookingHistoryPage;

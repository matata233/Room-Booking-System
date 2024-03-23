import React, { useState, useMemo } from "react";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import {
  useGetBookingCurrentUserQuery,
  useUpdateBookingMutation,
} from "../slices/bookingApiSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import Pagination from "../components/Pagination";
import { mirage } from "ldrs";
import StartSearchGIF from "../assets/start-search.gif";
import { toast } from "react-toastify";
import EditBookingModal from "../components/EditBookingModal";
import CancelConfirmationModal from "../components/CancelConfirmationModal";

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

  const [updateBooking] = useUpdateBookingMutation();

  mirage.register();

  console.log("hi", bookingData);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //edit
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const handleEditBooking = (book) => {
    setIsEditing(true);
    setSelectedBooking(book);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsEditing(false);
  };

  const handleCancelConfirmOpen = () => {
    setIsCancelConfirmOpen(true);
    // setSelectedBooking(book);
  };

  const handleCancelBooking = async () => {
    try {
      await updateBooking({
        bookingId: selectedBooking.bookingId,
        updatedBooking: { status: "canceled", users: [], rooms: [] },
      }).unwrap();
      toast.success("Booking updated");
      // bookingData = [];
      // Close the modal
    } catch (err) {
      // Display error toast message
      toast.error(err?.data?.error || "Failed to save book");
    }
  };

  const handleSaveBooking = async (book) => {
    try {
      if (isEditing) {
        await updateBooking({
          bookingId: selectedBooking.bookingId,
          updatedBooking: book,
        }).unwrap();
        toast.success("Booking updated");
      }
      // Close the modal
      handleCloseModal();
    } catch (err) {
      // Display error toast message
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
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <h1 className="text-center text-2xl font-semibold">Booking History</h1>

        {bookingData.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {bookingData.map((book) => (
                <div
                  key={book.bookingId}
                  className="relative mx-6 mb-10 bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* ----- */}
                  {book.groups.map((group, index) => (
                    <div>
                      <div
                        key={group.room.roomId}
                        className="flex flex-col items-center justify-between lg:flex-row"
                      >
                        <div>
                          {index == 0 && (
                            <div className="ml-10 mt-[60px] text-center text-lg font-semibold">
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
                          <div className="absolute -left-20 top-1 ml-10 mt-2 bg-theme-orange px-5 py-2">
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

                          <div className="ml-10 mt-2">
                            <img
                              src={MeetingRoomImg}
                              alt="meeting room"
                              className="h-[15vh]"
                            />
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col  justify-start gap-1">
                          <div className="mt-2 text-lg text-theme-orange">
                            {`${group.room.city.cityId}${group.room.building.code} ${group.room.floorNumber.toString().padStart(2, "0")}.${group.room.roomCode} ${group.room.roomName ? group.room.roomName : ""} `}{" "}
                          </div>

                          <div className="mt-2">
                            <span className="font-semibold">Equipments:</span>{" "}
                            {group.room.equipmentList.length > 0
                              ? group.room.equipmentList
                                  .map((equip) => equip.equipmentId)
                                  .join(" / ")
                              : "None"}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold">
                              Number of Seats:
                            </span>{" "}
                            {group.room.numberOfSeats}
                          </div>
                        </div>

                        {/* Attendees */}
                        <div className="mt-10 flex flex-col lg:mt-0">
                          <div className="mb-2 text-center font-semibold">
                            <h2>Attendee(s):</h2>
                          </div>
                          <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
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
                      <div className="flex justify-end">
                        <div className="flex space-x-6 ">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 "
                            onClick={(e) => handleEditBooking(book)}
                          >
                            <FaEdit className="size-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => setIsCancelConfirmOpen(true)}
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

      {isEditing && (
        <EditBookingModal
          book={selectedBooking}
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

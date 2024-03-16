import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link, useLocation } from "react-router-dom";

const BookingCompletePage = () => {
  const location = useLocation();
  const bookingData = location.state;
  const roomInfo = bookingData.result.bookings_rooms[0].rooms;
  const startTime = new Date(bookingData.result.start_time);
  const endTime = new Date(bookingData.result.end_time);

  const formattedDate = startTime.toISOString().split("T")[0];
  const formattedStartHour = startTime
    .toISOString()
    .split("T")[1]
    .substring(0, 5);
  const formattedEndHour = endTime.toISOString().split("T")[1].substring(0, 5);
  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <BookingStepper currentStage={3} />
        <div className="flex items-center justify-center">
          <div className="h-100 mx-10 w-1/2 md:w-1/2 lg:w-1/2">
            <h1 className="mb-4 text-xl font-semibold">Booking Confirmation</h1>
            <p className="mb-4">
              You have successfully booked{" "}
              <span className="font-bold text-theme-orange">{`Room ${roomInfo.name} ${roomInfo.code}`}</span>{" "}
              at{" "}
              <span className="font-bold text-theme-orange">Building 112</span>{" "}
              !
            </p>
            <p className="mb-4">
              <span className="font-bold text-theme-orange">
                {formattedDate}
              </span>{" "}
              from{" "}
              <span className="font-bold text-theme-orange">
                {formattedStartHour}
              </span>{" "}
              to{" "}
              <span className="font-bold text-theme-orange">
                {formattedEndHour}
              </span>
            </p>
            <h1 className="mb-2 text-xl font-semibold">Happy Meeting!</h1>
            <p className="mb-10 text-sm text-gray-500">
              If you have any questions or need further assistance, please
              contact our support team at support@email.com
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 mt-10 flex justify-center">
        <Link
          to="/"
          className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default BookingCompletePage;

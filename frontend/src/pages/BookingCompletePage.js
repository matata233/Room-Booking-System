import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";

const BookingCompletePage = () => {
  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <BookingStepper />
        <div className="flex justify-center items-center">
        <div className="h-100 w-1/2 mx-10 md:w-1/2 lg:w-1/2">
          <h1 className="mb-4 text-xl font-semibold">
            Booking Confirmation
          </h1>
          <p className="mb-4">
            You have successfully booked <span className="font-bold text-theme-orange">Room 120</span> at <span className="font-bold text-theme-orange">Building 112</span> !
          </p>
          <p className="mb-4">
            An email confirmation containing the details of your booking has been sent to your registered email address.
          </p>
          <h1 className="mb-2 text-xl font-semibold">
            Happy Meeting!
          </h1>
          <p className="mb-10 text-gray-500 text-sm">
             If you have any questions or need further assistance, please contact our support team at support@email.com
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

import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";

const BookingReviewPage = () => {
  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <BookingStepper />

        <div className="mx-6 bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div>
              <img
                src={MeetingRoomImg}
                alt="meeting room"
                className="h-[25vh] object-cover"
              />
            </div>
            <div className="mt-6 flex flex-col  justify-start gap-1">
              <div>
                <span className="font-semibold">Time:</span> 13:00 - 14:00
              </div>
              <div>
                <span className="font-semibold">Room:</span> 120
              </div>
              <div>
                <span className="font-semibold">Capacity:</span> 10
              </div>
              <div>
                <span className="font-semibold">Equipments:</span> CV
              </div>
              <div>
                <span className="font-semibold">Location:</span> Building 112
              </div>
            </div>

            {/* Attendees */}
            <div className="mt-10 flex flex-col lg:mt-0">
              <div className="mb-2 text-center font-semibold">
                <h2>Attendee(s):</h2>
              </div>
              <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
                cat@gmail.com, dog@gmail.com, cat2@gmail.com, dog2@gmail.com,
                cat3@gmail.com, dog3@gmail.com, cat4@gmail.com, dog4@gmail.com,
                cat5@gmail.com, dog5@gmail.com, cat6@gmail.com, dog6@gmail.com,
                cat7@gmail.com, dog7@gmail.com
              </div>
            </div>
          </div>

          <div className="mx-auto  my-5 w-full border-t-2 border-dashed border-theme-orange"></div>

          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div>
              <img
                src={MeetingRoomImg}
                alt="meeting room"
                className="h-[25vh] object-cover"
              />
            </div>
            <div className="mt-6 flex flex-col  justify-start gap-1">
              <div>
                <span className="font-semibold">Time:</span> 13:00 - 14:00
              </div>
              <div>
                <span className="font-semibold">Room:</span> 120
              </div>
              <div>
                <span className="font-semibold">Capacity:</span> 10
              </div>
              <div>
                <span className="font-semibold">Equipments:</span> CV
              </div>
              <div>
                <span className="font-semibold">Location:</span> Building 112
              </div>
            </div>

            {/* Attendees */}
            <div className="mt-10 flex flex-col lg:mt-0">
              <div className="mb-2 text-center font-semibold">
                <h2>Attendee(s):</h2>
              </div>
              <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
                cat@gmail.com, dog@gmail.com, cat2@gmail.com, dog2@gmail.com,
                cat3@gmail.com, dog3@gmail.com, cat4@gmail.com, dog4@gmail.com,
                cat5@gmail.com, dog5@gmail.com, cat6@gmail.com, dog6@gmail.com,
                cat7@gmail.com, dog7@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="mt-10 flex justify-center">
          <Link
            to="/bookingComplete"
            className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
          >
            Confirm
          </Link>
        </div>
        <div className="my-2 flex justify-center">
          <Link
            to="/booking"
            className="rounded bg-theme-dark-blue px-12 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;

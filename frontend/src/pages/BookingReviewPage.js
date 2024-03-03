import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";

const BookingReviewPage = () => {
  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <BookingStepper />
        <div className="mx-20 bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          
          <div className="my-4 flex flex-col items-center justify-between xl:flex-row">
          <div>
            <div className="ml-10 flex flex-col items-center xl:flex-row">
              <div>
                <img
                  src={MeetingRoomImg}
                  alt="meeting room"
                  className="h-[25vh] object-cover"
                />
              </div>
              <div className="mt-6 flex flex-col xl:ml-6 xl:mt-0">
                {/* <div className="mt-2 text-lg text-theme-orange">room info</div> */}
                <div className="mt-2">
                  <span className="font-semibold">Time:</span> 1:00 - 2:00
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Room:</span> 120
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Capacity:</span> 10
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Equipment includes:</span> Microphone
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Location:</span> Building 112
                </div>
              </div>
            </div>
          </div>
          <div className="mr-10 justify-end">
            <h2>Attendee(s)</h2>
            <div className="flex w-80 flex-col gap-2 rounded-lg bg-gray-200 p-4">
              cat@gmail.com, dog@gmail.com
            </div>
          </div>
          </div>

        <div class="text-theme-orange my-4 mx-4">-----------------------------------------------------------------------------------------------------------------------------------------------------------------------</div>

        <div className="my-4 flex flex-col items-center justify-between xl:flex-row">
          <div>
            <div className="ml-10 flex flex-col items-center xl:flex-row">
              <div>
                <img
                  src={MeetingRoomImg}
                  alt="meeting room"
                  className="h-[25vh] object-cover"
                />
              </div>
              <div className="mt-6 flex flex-col xl:ml-6 xl:mt-0">
              <div className="mt-2">
                  <span className="font-semibold">Time:</span> 4:00 - 7:00
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Room:</span> 420
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Capacity:</span> 4
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Equipment includes:</span> CV
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Location:</span> Building 200
                </div>
              </div>
            </div>
          </div>
          <div className="mr-10 justify-end">
            <h2>Attendee(s)</h2>
            <div className="flex w-80 flex-col gap-2 rounded-lg bg-gray-200 p-4">
              pig@gmail.com, bird@gmail.com, bear@gmail.com
            </div>
          </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="mt-10 flex w-80 justify-center">
          <button
            type="submit"
            className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
          >
            Confirm
          </button>
        </div>
        <div className="my-2 flex w-80 justify-center">
          <button
            type="cancel"
            className="rounded bg-theme-dark-blue px-12 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;

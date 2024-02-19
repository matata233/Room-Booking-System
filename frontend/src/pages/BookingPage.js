import React, { useState } from "react";
import BookingStepper from "../components/BookingStepper";
import DrapAndDrop from "../components/DragAndDrop";
import StartSearchGIF from "../assets/start-search.gif";
const BookingPage = () => {
  return (
    <div className="flex w-full flex-col  gap-y-12 font-amazon-ember">
      <BookingStepper />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="basis-1/3 ">
          <div className="mb-4 text-xl font-semibold">Choose Your Room</div>
          <DrapAndDrop />
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

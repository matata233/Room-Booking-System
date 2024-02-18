import React, { useState } from "react";
import BookingStepper from "../components/BookingStepper";
import DrapAndDrop from "../components/DragAndDrop";
const BookingPage = () => {
  return (
    <div className="flex w-full flex-col  gap-y-12 font-amazon-ember">
      <BookingStepper />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="flex basis-1/3 flex-col items-center">
          <div className="mb-4 text-xl font-semibold">Choose Your Room</div>
          <DrapAndDrop />
        </div>

        {/* Recommended Rooms */}
        <div className="basis-2/3">
          <div className="mb-4 text-xl font-semibold">Recommended Rooms</div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

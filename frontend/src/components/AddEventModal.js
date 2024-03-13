import React from "react";
import AddEvent from "./AddEvent";
import CloseIconSVG from "../assets/close-icon.svg";

const AddEventModal = ({ closeModal, selectedDate, onSubmit }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="relative rounded bg-white p-8 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-6 top-5 cursor-pointer p-2"
          onClick={closeModal}
        >
          <img src={CloseIconSVG} alt="Close Icon" className="h-7 w-7" />
        </button>
        <AddEvent onSubmit={onSubmit} selectedDate={selectedDate} />
      </div>
    </div>
  );
};
export default AddEventModal;

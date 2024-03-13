import React from "react";
import EditEvent from "./EditEvent";
import CloseIconSVG from "../assets/close-icon.svg";

const EditEventModal = ({ closeModal, selectedEvent, onSubmit }) => {
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
        <EditEvent onSubmit={onSubmit} selectedEvent={selectedEvent} />
      </div>
    </div>
  );
};
export default EditEventModal;

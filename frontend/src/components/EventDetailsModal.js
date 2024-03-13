import React from "react";
import CloseIconSVG from "../assets/close-icon.svg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const EventDetailsModal = ({ closeModal, selectedEvent, onDelete, onEdit }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="relative rounded bg-white shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="my-6 flex flex-col items-center">
          <h1 className="text-3xl font-light text-theme-dark-orange">
            {selectedEvent.title}
          </h1>
          <button
            className="absolute right-2 top-2 cursor-pointer p-2"
            onClick={closeModal}
          >
            <img src={CloseIconSVG} alt="Close Icon" className="h-7 w-7" />
          </button>
        </div>
        {selectedEvent && (
          <div className="m-8 mt-0 flex w-80 flex-col rounded-lg bg-gray-200 p-4">
            <p className="pb-2 text-lg  text-gray-800">Start Time:</p>
            <p className="pb-6">
              {new Date(selectedEvent.start).toLocaleString()}
            </p>
            <p className="pb-2 text-lg  text-gray-800">End Time:</p>
            <p className="pb-3">
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
          </div>
        )}{" "}
        <div className="mb-10 flex justify-center ">
          <a
            href="#"
            className="mr-6 text-indigo-600 hover:text-indigo-900"
            onClick={() => onEdit(selectedEvent.id)}
          >
            <FaEdit className="size-6" />
          </a>
          <a
            href="#"
            className="text-red-600 hover:text-red-900"
            onClick={() => onDelete(selectedEvent.id)}
          >
            <MdDelete className="size-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

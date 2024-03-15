import React from "react";
import CloseIconSVG from "../assets/close-icon.svg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";

const EventDetailsModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="group relative pl-3">
        <div className="absolute inset-0 transform rounded-3xl bg-gradient-to-br from-orange-300 to-theme-orange shadow-lg duration-300 group-hover:-rotate-3"></div>
        <div className="relative w-80 flex-col rounded-3xl bg-white p-6 shadow-lg lg:w-96">
          <h1 className="font-natural mb-5 mt-1 text-3xl text-theme-dark-orange  lg:mt-2 ">
            {event.title}
          </h1>

          <p className="pb-2 text-lg  text-gray-800">Start Time:</p>
          <div className="mb-2 block w-full appearance-none rounded-md bg-orange-50 px-4 py-2 leading-tight text-black focus:bg-orange-50 focus:outline-none lg:mb-4">
            <p className="">
              {dayjs(new Date(event.startTime)).format(
                "YYYY-MM-DD \b \b \b hh:mm A",
              )}
            </p>
          </div>

          <p className="pb-2 text-lg  text-gray-800">End Time:</p>
          <div className="mb-2 block w-full appearance-none rounded-md bg-orange-50 px-4 py-2 leading-tight text-black focus:bg-orange-50 focus:outline-none lg:mb-4">
            <p>
              {dayjs(new Date(event.endTime)).format(
                "YYYY-MM-DD \b \b \b hh:mm A",
              )}
            </p>
          </div>
          <div className="mb-3 flex justify-end gap-2">
            <button
              className="text-indigo-600 hover:text-indigo-900"
              onClick={() => onEdit(event.eventId)}
            >
              <FaEdit className="h-[27px] w-[25px]" />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              onClick={() => onDelete(event.eventId)}
            >
              <MdDelete className="h-7 w-7" />
            </button>
          </div>
        </div>
        <button
          className="absolute right-2 top-2 cursor-pointer p-2"
          onClick={onClose}
        >
          <img src={CloseIconSVG} alt="Close Icon" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal;

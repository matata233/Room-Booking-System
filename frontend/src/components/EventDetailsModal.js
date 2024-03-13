import React from "react";
import CloseIconSVG from "../assets/close-icon.svg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import dayjs from "dayjs";

const EventDetailsModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded bg-white shadow-md">
        <div className="my-6 flex flex-col items-center">
          <h1 className="font-natural text-2xl text-theme-dark-orange ">
            {event.title}
          </h1>
          <div className="mx-8 my-6 flex w-80 flex-col rounded-lg bg-gray-200 p-4">
            <p className="pb-2 text-lg  text-gray-800">Start Time:</p>
            <div className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none">
              <p className="">
                {dayjs(new Date(event.start)).format("YYYY-MM-DD hh:mm A")}
              </p>
            </div>

            <p className="pb-2 text-lg  text-gray-800">End Time:</p>
            <div className="mb-4 block w-full appearance-none rounded-md bg-white px-4 py-2  leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none">
              <p>{dayjs(new Date(event.end)).format("YYYY-MM-DD hh:mm A")}</p>
            </div>
            <div className="flex justify-end gap-2">
              <a
                href="#"
                className=" text-indigo-600 hover:text-indigo-900"
                onClick={() => onEdit(event.id)}
              >
                <FaEdit className="h-[27px] w-[25px]" />
              </a>
              <a
                href="#"
                className="text-red-600 hover:text-red-900"
                onClick={() => onDelete(event.id)}
              >
                <MdDelete className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
        <button
          className="absolute right-2 top-2 cursor-pointer p-2"
          onClick={onClose}
        >
          <img src={CloseIconSVG} alt="Close Icon" className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
};

export default EventDetailsModal;

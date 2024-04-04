import React from "react";
import CloseIconSVG from "../assets/close-icon.svg";

export const RoomSelectionModal = ({
  onCancel,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-80 flex-col rounded-3xl bg-white p-6 shadow-lg xl:w-96">
        <div className="flex flex-col">
          <div className="text-md flex flex-col items-center space-y-2">
            <div className="font-natural text-md my-5">{message}</div>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="h-8 w-24 rounded border border-zinc-300 text-black transition-colors  duration-300 ease-in-out hover:bg-zinc-100  xl:h-10 xl:w-28"
              onClick={onCancel}
            >
              Back
            </button>
            <button
              className="h-8 w-24 rounded bg-theme-orange text-black transition-colors  duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white xl:h-10 xl:w-28"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
        <button
          className="absolute right-2 top-2 cursor-pointer p-2"
          onClick={onClose}
        >
          <img
            src={CloseIconSVG}
            alt="Close Icon"
            className="size-5 xl:size-6"
          />
        </button>
      </div>
    </div>
  );
};

export default RoomSelectionModal;

import React from "react";
import CloseIconSVG from "../assets/close-icon.svg";

export const CancelConfirmationModal = ({
  onCancel,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-80 flex-col rounded-3xl bg-white p-6 shadow-lg xl:w-96">
        <div className="flex flex-col">
          <h1 className="font-natural text-md mt-5 xl:pl-4">{message}</h1>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="h-8 w-24 rounded bg-rose-600 text-white transition-colors  duration-300 ease-in-out hover:bg-rose-700 hover:text-white xl:h-10 xl:w-28"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="h-8 w-24 rounded bg-theme-orange text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white xl:h-10 xl:w-28"
              onClick={onCancel}
            >
              Cancel
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

export default CancelConfirmationModal;

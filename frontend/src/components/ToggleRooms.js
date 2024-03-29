import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowRecommended } from "../slices/bookingSlice";

const ToggleRooms = () => {
  const dispatch = useDispatch();
  const { showRecommended } = useSelector((state) => state.booking);

  return (
    <div className="flex h-[40px] items-center justify-center">
      <label
        className={`mr-2 ${showRecommended ? "text-black" : "text-gray-400"}`}
      >
        Recommended
      </label>

      <div
        className="relative cursor-pointer"
        onClick={() => {
          dispatch(toggleShowRecommended());
        }}
      >
        <div
          className={`block h-8 w-14 rounded-full ${showRecommended ? "bg-gray-300" : "bg-orange-300"}`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 h-6 w-6 rounded-full transition ${showRecommended ? "bg-gray-400" : "translate-x-6 transform bg-theme-dark-orange"}`}
        ></div>
      </div>
      <label
        className={`ml-2 ${showRecommended ? "text-gray-400" : "text-theme-dark-orange"}`}
      >
        All
      </label>
    </div>
  );
};

export default ToggleRooms;

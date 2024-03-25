import React, { useState } from "react";

const ToggleRooms = ({ showRecommended, handleToggle }) => {
  return (
    <div className="flex h-[40px] items-center justify-center">
      <label
        className={`mr-2 ${showRecommended ? "text-gray-400" : "text-black"}`}
      >
        All
      </label>
      <div className="relative cursor-pointer" onClick={handleToggle}>
        <div
          className={`block h-8 w-14 rounded-full ${showRecommended ? "bg-orange-300" : "bg-gray-300"}`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 h-6 w-6 rounded-full transition ${showRecommended ? "translate-x-6 transform bg-theme-dark-orange" : "bg-gray-400"}`}
        ></div>
      </div>
      <label
        className={`ml-2 ${showRecommended ? "text-theme-dark-orange" : "text-gray-400"}`}
      >
        Recommended
      </label>
    </div>
  );
};

export default ToggleRooms;

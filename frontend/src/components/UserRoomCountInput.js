import React, { useState } from "react";

const UserRoomCountInput = ({ roomCount, setRoomCount }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // only allow positive integers
    if (/^([1-9]\d*)?$/.test(inputValue)) {
      setRoomCount(inputValue);
    }
  };

  const handleBlur = () => {
    if (roomCount === "") {
      setRoomCount(1);
    }
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      <div className="relative">
        <input
          type="text"
          value={roomCount}
          onChange={handleChange}
          onBlur={handleBlur}
          className="block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  );
};

export default UserRoomCountInput;

import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";
import Select from "react-select";
import animatedComponents from "react-select";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import Loader from "./Loader";
import Message from "./Message";

const Accordion = ({
  groupId,
  open,
  toggle,
  handleChange,
  options,
  initialValue,
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between bg-white px-4 py-2"
        onClick={toggle}
      >
        <div>
          <p className="font-semibold text-theme-orange">{groupId}</p>
          <p className="mt-2 text-sm text-theme-blue">
            Room: {selectedRoom ? `${selectedRoom.cityId}` : "Unselected"}
          </p>
        </div>

        <div className="text-lg">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>
      <Collapse isOpened={open}>
        <div className="bg-white p-4">
          <Select
            value={initialValue}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            placeholder="Select Emails..."
            onChange={(selected) => handleChange(selected, groupId)}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "white",
                border: "none",

                "&:hover": {
                  boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                "&:hover": {
                  backgroundColor: "#f19e38",
                  color: "white",
                },
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "#f2f2f2",
              }),
            }}
          />
        </div>
      </Collapse>
    </>
  );
};

export default Accordion;

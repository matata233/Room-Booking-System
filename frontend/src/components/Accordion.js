import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";

import PlusButtonSVG from "../assets/plus-button.svg";
import AccordionItem from "./AccordionItem";

const Accordion = ({ open, toggle, title, content }) => {
  const [users, setUsers] = useState(content);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleEmailChange = (index, event) => {
    const newUsers = [...users];
    newUsers[index].email = event.target.value;
    setUsers(newUsers);
  };

  const addEmailField = () => {
    setUsers([...users, { id: `new-${users.length}`, email: "" }]);
  };

  const deleteEmailField = (index) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between bg-white px-4 py-2"
        onClick={toggle}
      >
        <div>
          <p className="font-semibold text-theme-orange">{title}</p>
          <p className="mt-2 text-sm text-theme-blue">
            Room: {selectedRoom ? `${selectedRoom.cityId}` : "Unselected"}
          </p>
        </div>

        <div className="text-lg">
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>
      <Collapse isOpened={open}>
        <div className="flex flex-col  items-center justify-between gap-y-3 bg-white py-2">
          {users.map((index, user) => (
            <AccordionItem
              index={index}
              user={user}
              handleEmailChange={handleEmailChange}
              deleteEmailField={deleteEmailField}
            />
          ))}

          <button
            type="button"
            onClick={addEmailField}
            className="flex justify-center rounded-md px-4 py-2"
          >
            <img
              src={PlusButtonSVG}
              alt="Add Email Icon"
              className="h-8 w-10"
            />
          </button>
        </div>
      </Collapse>
    </>
  );
};

export default Accordion;

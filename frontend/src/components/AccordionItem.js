import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";
import { MdDelete } from "react-icons/md";
import PlusButtonSVG from "../assets/plus-button.svg";

const AccordionItem = ({ open, toggle, title, content }) => {
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
        <div className="flex flex-col items-center justify-between bg-white py-2">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-2 py-2 "
            >
              <input
                type="email"
                value={user.email}
                onChange={(event) => handleEmailChange(index, event)}
                placeholder="Enter email"
                className="flex-grow rounded-md border px-2 py-1"
                required
              />
              {users.length > 1 && (
                <button
                  onClick={() => deleteEmailField(index)}
                  className="ml-2 flex items-center justify-center rounded bg-red-500 p-1 text-white"
                >
                  <MdDelete />
                </button>
              )}
            </div>
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

export default AccordionItem;

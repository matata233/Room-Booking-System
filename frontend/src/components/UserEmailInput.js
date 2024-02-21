import React, { useState } from "react";
import PlusButtonSVG from "../assets/plus-button.svg";
import { MdDelete } from "react-icons/md";

const UserEmailInput = ({}) => {
  const [emails, setEmails] = useState([""]);

  const handleEmailChange = (index, event) => {
    const newEmails = [...emails];
    newEmails[index] = event.target.value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const deleteEmailField = (index) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  return (
    <div className="flex w-80 flex-col space-y-4 rounded-lg bg-gray-200 p-4">
      {emails.map((email, userID) => (
        <div key={userID} className="flex ">
          <input
            type="email"
            id={`emailInput-${userID}`}
            value={email}
            onChange={(event) => handleEmailChange(userID, event)}
            placeholder="Enter email"
            className="flex-grow rounded-md px-2 py-2 focus:outline-none focus:ring"
            required
          />
          {userID !== 0 && (
            <button
              type="button"
              onClick={() => deleteEmailField(userID)}
              className="px-2 py-1 text-red-500 "
            >
              <MdDelete />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addEmailField}
        className="rounded-mdpx-4 flex justify-center py-2"
      >
        <img src={PlusButtonSVG} alt="Room Mngt Icon" className="h-8 w-10" />
      </button>
    </div>
  );
};

export default UserEmailInput;

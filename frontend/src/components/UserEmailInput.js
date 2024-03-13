import React, { useState, useEffect } from "react";
import PlusButtonSVG from "../assets/plus-button.svg";
import { MdDelete } from "react-icons/md";

const UserEmailInput = ({ count = 1 }) => {
  const [emails, setEmails] = useState(Array.from({ length: count }, () => ""));

  useEffect(() => {
    // adjust the number of email fields based on count
    setEmails((currentEmails) => {
      if (count > currentEmails.length) {
        // If count increases, add more empty email fields
        return [
          ...currentEmails,
          ...Array.from({ length: count - currentEmails.length }, () => ""),
        ];
      } else {
        // If count decreases, keep the first `count` emails
        return currentEmails.slice(0, count);
      }
    });
  }, [count]);

  const handleEmailChange = (index, event) => {
    const newEmails = [...emails];
    newEmails[index] = event.target.value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const deleteEmailField = (index) => {
    // Allow deletion if the field is not one of the default fields based on count
    if (index >= count) {
      const newEmails = [...emails];
      newEmails.splice(index, 1);
      setEmails(newEmails);
    }
  };

  return (
    <div className="flex w-80 flex-col space-y-4 rounded-lg bg-gray-200 p-4">
      {emails.map((email, userID) => (
        <div key={userID} className="flex">
          <input
            type="email"
            id={`emailInput-${userID}`}
            value={email}
            onChange={(event) => handleEmailChange(userID, event)}
            placeholder="Enter email"
            className="flex-grow rounded-md px-2 py-2 focus:outline-none focus:ring"
            required
          />
          {userID >= count && (
            <button
              type="button"
              onClick={() => deleteEmailField(userID)}
              className="ml-2 px-2 py-1 text-red-500"
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
        <img src={PlusButtonSVG} alt="Add Email Icon" className="h-8 w-10" />
      </button>
    </div>
  );
};

export default UserEmailInput;

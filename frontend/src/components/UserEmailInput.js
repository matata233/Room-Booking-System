import React, { useState, useEffect } from "react";
import PlusButtonSVG from "../assets/plus-button.svg";
import { MdDelete } from "react-icons/md";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import ComboBox from "./ComboBox";

const UserEmailInput = ({ count = 1 }) => {
  const {
    data: userEmails,
    error,
    isLoading,
    refetch,
  } = useGetAllEmailsQuery();

  /**
   * 
   * {
       "userId": 1,
       "username": "bbrown5888",
       firstName": "Bob",
       "email": "bbrown5888@example.com"
      }
   */

  const [userEmailFields, setUserEmailFields] = useState(
    Array.from({ length: count }, () => null),
  );

  // Update the number of email fields based on count
  useEffect(() => {
    // adjust the number of email fields based on count
    setUserEmailFields((current) => {
      if (count > current.length) {
        // If count increases, add more empty email fields
        return [
          ...current,
          ...Array.from({ length: count - current.length }, () => null),
        ];
      } else {
        // If count decreases, keep the first `count` emails
        return current.slice(0, count);
      }
    });
  }, [count]);

  const addEmailField = () => {
    setUserEmailFields([...userEmailFields, null]);
  };

  const deleteEmailField = (index) => {
    // Allow deletion if the field is not one of the default fields based on count
    if (index >= count) {
      const newUserEmails = [...userEmailFields];
      newUserEmails.splice(index, 1);
      setUserEmailFields(newUserEmails);
    }
  };

  return (
    <div className="flex w-80 flex-col  rounded-lg bg-gray-200 p-4">
      {userEmailFields.map((userEmail, index) => (
        <div key={index} className="flex">
          <ComboBox
            options={
              isLoading
                ? [{ label: "Loading...", id: null }]
                : error
                  ? [
                      {
                        label: "Error fetching emails",
                        id: null,
                      },
                    ]
                  : userEmails.result
                      .filter(
                        // filter out the emails that are already in the list
                        (user) =>
                          !userEmailFields.some(
                            (field) => field && field.id === user.userId,
                          ),
                      )
                      .map((user) => ({ label: user.email, id: user.userId }))
            }
            userEmailFields={userEmailFields}
            setUserEmailFields={setUserEmailFields}
            comboBoxId={index}
          />
          {index >= count && (
            <button
              type="button"
              onClick={() => deleteEmailField(index)}
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

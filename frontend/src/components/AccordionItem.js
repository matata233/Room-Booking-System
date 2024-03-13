import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdDragIndicator } from "react-icons/md";
import ComboBox from "./ComboBox";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";

const AccordionItem = ({
  user,
  index,
  handleEmailChange,
  deleteEmailField,
}) => {
  const {
    data: userEmails,
    error,
    isLoading,
    refetch,
  } = useGetAllEmailsQuery();
  const [userEmailFields, setUserEmailFields] = useState([]);
  const [userId, setUserId] = useState(0);

  return (
    <div
      key={index}
      className="group mx-1 flex cursor-move touch-none items-center justify-between rounded-md border-2 bg-white  hover:shadow-md "
    >
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

      {/* <input
        type="email"
        value={user.email}
        onChange={(event) => handleEmailChange(index, event)}
        placeholder="Enter email"
        className="flex-grow rounded-md border px-2 py-1"
        required
      /> */}
      <button
        onClick={() => deleteEmailField(index)}
        className="ml-2 flex items-center justify-center rounded bg-red-500 p-1 text-white"
      >
        <MdDelete />
      </button>
      <MdDragIndicator className="size-6 text-gray-200 group-hover:text-theme-dark-blue" />
    </div>
  );
};

export default AccordionItem;

import React from "react";
import { MdDelete } from "react-icons/md";
import { MdDragIndicator } from "react-icons/md";

const AccordionItem = ({
  user,
  index,
  handleEmailChange,
  deleteEmailField,
}) => {
  return (
    <div
      key={user.id}
      className="group flex cursor-move touch-none items-center justify-between rounded-md border-2 bg-white p-2 hover:shadow-md "
    >
      <input
        type="email"
        value={user.email}
        onChange={(event) => handleEmailChange(index, event)}
        placeholder="Enter email"
        className="flex-grow rounded-md border px-2 py-1"
        required
      />
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

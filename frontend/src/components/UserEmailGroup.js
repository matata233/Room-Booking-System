import React, { useState } from "react";
import Accordion from "./Accordion";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setGroupedAttendees } from "../slices/bookingSlice";
import Loader from "./Loader";
import Message from "./Message";

const UserEmailGroup = () => {
  const dispatch = useDispatch();
  const {
    data: userEmails,
    error,
    isLoading,
    refetch,
  } = useGetAllEmailsQuery();
  const [open, setOpen] = useState(false);
  const groupedAttendees = useSelector(
    (state) => state.booking.groupedAttendees,
  );

  const toggle = (index) => {
    setOpen((prevOpen) => (prevOpen === index ? false : index));
  };

  const handleChange = (selected, groupId) => {
    const selectedAttendees = selected.map((option) => ({
      id: option.value,
      email: option.label,
    }));
    dispatch(setGroupedAttendees({ groupId, attendees: selectedAttendees }));
  };

  return (
    <>
      <div className="flex w-80 flex-col space-y-4 rounded-lg bg-gray-200 p-4">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error.message}</Message>
        ) : (
          groupedAttendees.map((group, index) => {
            const availableOptions = userEmails.result
              .filter(
                (user) =>
                  !groupedAttendees.some((g) =>
                    g.attendees.find((attendee) => attendee.id === user.userId),
                  ),
              )
              .map((user) => ({ value: user.userId, label: user.email }));

            return (
              <div key={index} className="flex flex-col">
                <Accordion
                  key={group.groupId}
                  groupId={group.groupId}
                  open={open === index}
                  toggle={() => toggle(index)}
                  handleChange={(selected) =>
                    handleChange(selected, group.groupId)
                  }
                  options={availableOptions}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default UserEmailGroup;

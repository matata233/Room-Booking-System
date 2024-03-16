import React, { useState, useMemo } from "react";
import Accordion from "./Accordion";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setGroupedAttendees } from "../slices/bookingSlice";
import Loader from "./Loader";
import Message from "./Message";

const UserEmailGroup = () => {
  const dispatch = useDispatch();
  const { data: userEmails, error, isLoading } = useGetAllEmailsQuery();
  const [open, setOpen] = useState(false);
  const groupedAttendees = useSelector(
    (state) => state.booking.groupedAttendees,
  );

  // Aggregate all selected emails across groups
  const allSelectedEmails = useMemo(
    () => new Set(groupedAttendees.flatMap((group) => group.attendees)),
    [groupedAttendees],
  );

  const toggle = (index) => {
    setOpen((prevOpen) => (prevOpen === index ? false : index));
  };

  const handleChange = (selected, groupId) => {
    const selectedAttendees = selected.map((option) => ({
      userId: option.value,
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
            const initialSelected = group.attendees.map((attendee) => ({
              value: attendee.id,
              label: attendee.email,
            }));

            const availableOptions = userEmails.result
              .filter((user) => !allSelectedEmails.has(user.email))
              .map((user) => ({ value: user.userId, label: user.email }));

            return (
              <div key={group.groupId} className="flex flex-col">
                <Accordion
                  groupId={group.groupId}
                  open={open === index}
                  toggle={() => toggle(index)}
                  handleChange={(selected) =>
                    handleChange(selected, group.groupId)
                  }
                  options={availableOptions}
                  initialValue={initialSelected}
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

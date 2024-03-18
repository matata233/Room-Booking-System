import React, { useState, useMemo, useEffect } from "react";
import Accordion from "./Accordion";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setGroupedAttendees } from "../slices/bookingSlice";
import Loader from "./Loader";
import Message from "./Message";

const UserEmailGroup = () => {
  const dispatch = useDispatch();
  const { data: userEmails, error, isLoading } = useGetAllEmailsQuery();
  const [open, setOpen] = useState(0);

  const { groupedAttendees } = useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  // Aggregate all selected emails across groups
  const allSelectedEmails = useMemo(
    () =>
      new Set(
        groupedAttendees.flatMap((group) =>
          group.attendees.map((attendee) => attendee.email),
        ),
      ),
    [groupedAttendees],
  );

  console.log(allSelectedEmails, groupedAttendees);

  const toggle = (index) => {
    setOpen((prevOpen) => (prevOpen === index ? false : index));
  };
  const handleChange = (selectedOptions, groupId) => {
    // selectedOptions is an array of { value, label } objects representing the currently selected items
    const selectedAttendees = selectedOptions.map((option) => ({
      userId: option.value,
      email: option.label,
    }));

    // Dispatch an action to update the Redux store
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
              value: attendee.userId,
              label: attendee.email,
            }));
            // filter out already selected emails and the logged-in user's email
            const availableOptions = userEmails.result
              .filter(
                (user) =>
                  !allSelectedEmails.has(user.email) &&
                  user.email !== userInfo.email,
              )
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
                  selectedRoom={group.selectedRoom}
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

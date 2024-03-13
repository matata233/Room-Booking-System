import React, { useState, useEffect } from "react";
import PlusButtonSVG from "../assets/plus-button.svg";
import { MdDelete } from "react-icons/md";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import ComboBox from "./ComboBox";
import { useDispatch, useSelector } from "react-redux";
import {
  addAttendeePlaceholder,
  updateAttendee,
  removeAttendee,
} from "../slices/bookingSlice";

const UserEmailInput = () => {
  const {
    data: userEmails,
    error,
    isLoading,
    refetch,
  } = useGetAllEmailsQuery();
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.booking.groups);
  const roomCount = useSelector((state) => state.booking.roomCount);
  /**
   * 
   * {
       "userId": 1,
       "username": "bbrown5888",
       firstName": "Bob",
       "email": "bbrown5888@example.com"
      }
   */

  const addEmailField = () => {
    dispatch(addAttendeePlaceholder({ groupId: groups[0].groupId }));
  };
  const deleteEmailField = (index) => {
    if (index < groups[0].attendees.length) {
      dispatch(
        removeAttendee({
          groupId: groups[0].groupId,
          attendeeId: groups[0].attendees[index].id,
        }),
      );
    }
  };

  const handleEmailSelected = (groupId, attendeeIndex, selectedUser) => {
    dispatch(
      updateAttendee({
        groupId,
        attendeeIndex,
        attendeeDetails: { id: selectedUser.id, email: selectedUser.label }, // Adjust according to your data structure
      }),
    );
  };

  return (
    <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
      {/* Render non-deletable ComboBox for the first attendee of each group */}
      {groups.map((group, groupIndex) => (
        <div key={group.groupId} className="flex">
          <ComboBox
            options={
              isLoading
                ? [{ label: "Loading...", id: null }]
                : error
                  ? [{ label: "Error fetching emails", id: null }]
                  : userEmails.result
                      .filter(
                        (user) =>
                          // Ensure the user is not already selected in any group's attendees
                          !groups.some((group) =>
                            group.attendees.some(
                              (attendee) => attendee.id === user.userId,
                            ),
                          ),
                      )
                      .map((user) => ({
                        label: user.email,
                        id: user.userId,
                      }))
            }
            handleEmailSelected={handleEmailSelected}
            comboBoxId={`${group.groupId}_0`}
          />
          {/* No delete button for the first attendee */}
        </div>
      ))}

      {/* If there are additional attendees in the first group, render them below */}
      {groups.length > 0 &&
        groups[0].attendees.slice(1).map((attendee, index) => (
          <div key={attendee.id || index} className="flex">
            <ComboBox
              options={
                isLoading
                  ? [{ label: "Loading...", id: null }]
                  : error
                    ? [{ label: "Error fetching emails", id: null }]
                    : userEmails.result
                        .filter(
                          (user) =>
                            // Ensure the user is not already selected in any group's attendees
                            !groups.some((group) =>
                              group.attendees.some(
                                (attendee) => attendee.id === user.userId,
                              ),
                            ),
                        )
                        .map((user) => ({
                          label: user.email,
                          id: user.userId,
                        }))
              }
              selectedUser={attendee} // Pass the attendee as the selected user
              handleEmailSelected={(selectedUser) =>
                dispatch(
                  updateAttendee({
                    groupId: groups[0].groupId,
                    attendeeIndex: index,
                    attendeeDetails: {
                      id: selectedUser.id,
                      email: selectedUser.label,
                    },
                  }),
                )
              }
              comboBoxId={`${groups[0].groupId}_${index + 1}`}
            />
            {/* Delete button for additional attendees */}
            <button
              type="button"
              onClick={() => deleteEmailField(index + 1)}
              className="ml-2 px-2 py-1 text-red-500"
            >
              <MdDelete />
            </button>
          </div>
        ))}

      {/* Button to add more attendees to the first group */}
      {groups.length > 0 && (
        <button
          type="button"
          onClick={addEmailField}
          className="flex justify-center rounded-md px-4 py-2"
        >
          <img src={PlusButtonSVG} alt="Add Email Icon" className="h-8 w-10" />
        </button>
      )}
    </div>
  );
};

export default UserEmailInput;

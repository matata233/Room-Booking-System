import React, { useState, useEffect } from "react";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Loader from "./Loader";
import Message from "./Message";
import { setUngroupedAttendees } from "../slices/bookingSlice";
const UserEmailInputEdit = () => {
  const animatedComponents = makeAnimated();
  const {
    data: userEmails,
    error,
    isLoading,
    refetch,
  } = useGetAllEmailsQuery();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const filteredEmails = userEmails?.result.filter(
    (user) => user.email !== userInfo.email,
  ); // Filter out the current user's email

  const { ungroupedAttendees } = useSelector((state) => state.booking);

  const editableAttendees = ungroupedAttendees.filter(
    (user) => user.email !== userInfo.email
  );

  const handleChange = (selected) => {
    const selectedAttendees = selected.map((option) => ({
      userId: option.value,
      email: option.label,
    }));
    if (editableAttendees.length !== ungroupedAttendees.length) {
      selectedAttendees.push({userId: userInfo.userId, email: userInfo.email});
    }
    dispatch(setUngroupedAttendees(selectedAttendees));
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message severity="error">{error.message}</Message>
  ) : (
    <>
      <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
        <div className="relative">
          <Select
            value={editableAttendees.map((user) => ({
              value: user.userId,
              label: user.email,
            }))}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={filteredEmails.map((user) => ({
              value: user.userId,
              label: user.email,
            }))}
            onChange={handleChange}
            placeholder="Select Emails..."
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "white",
                border: "none",

                "&:hover": {
                  boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                "&:hover": {
                  backgroundColor: "#f19e38",
                  color: "white",
                },
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "#f2f2f2",
              }),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default UserEmailInputEdit;

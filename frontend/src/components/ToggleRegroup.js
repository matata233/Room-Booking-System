import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRegroup } from "../slices/bookingSlice";

const ToggleRooms = () => {
  const dispatch = useDispatch();
  const { regroup, groupedAttendees, roomCount } = useSelector(
    (state) => state.booking,
  );
  const ungroupedHasAttendees = groupedAttendees.some(
    (group) => group.groupId === "Ungrouped" && group.attendees.length > 0,
  );

  // Fix: We still need to disable "regrouping" when the user sets a group to 0 attendees, but the number of rooms does not match.
  const nonEmptyGroupsCount = groupedAttendees.reduce((count, group) => {
    // increment the count if the group has attendees
    return group.attendees.length > 0 ? count + 1 : count;
  }, 0);
  const roomCountNotMatchGroupCount = nonEmptyGroupsCount !== roomCount;

  useEffect(() => {
    if (ungroupedHasAttendees || roomCountNotMatchGroupCount) {
      dispatch(setRegroup(true));
    }
  }, [ungroupedHasAttendees, roomCountNotMatchGroupCount, dispatch]);

  return (
    <div className="flex-col items-center justify-between">
      <div className="flex h-[40px] items-center justify-center">
        <label className={`mr-2 ${regroup ? "text-gray-400" : "text-black"}`}>
          Same Group
        </label>
        <div
          className={`relative ${ungroupedHasAttendees || roomCountNotMatchGroupCount ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => {
            if (!ungroupedHasAttendees && !roomCountNotMatchGroupCount) {
              dispatch(setRegroup(!regroup));
            }
          }}
        >
          <div
            className={`block h-8 w-14 rounded-full ${regroup ? "bg-orange-300" : "bg-gray-300"}`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 h-6 w-6 rounded-full transition ${regroup ? "translate-x-6 transform bg-theme-dark-orange" : "bg-gray-400"}`}
          ></div>
        </div>
        <label
          className={`ml-2 ${regroup ? "text-theme-dark-orange" : "text-gray-400"}`}
        >
          Regroup
        </label>
      </div>
      {/* Disable the toggle button if ungrouped has attendees */}

      {(ungroupedHasAttendees || roomCountNotMatchGroupCount) && (
        <div className="text-sm text-red-500">
          Toggle is disabled as you{" "}
          {ungroupedHasAttendees
            ? "entered ungrouped attendees"
            : "updated room count"}
          .
        </div>
      )}
    </div>
  );
};

export default ToggleRooms;

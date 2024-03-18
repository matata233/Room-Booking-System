import React, { useState, useMemo } from "react";
import BookingStepper from "../components/BookingStepper";
import DragAndDrop from "../components/DragAndDrop";
import UserEquipInput from "../components/UserEquipInput";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import UserRoomCountInput from "../components/UserRoomCountInput";
import UserEmailGroup from "../components/UserEmailGroup";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import LoggedInUserGroup from "../components/LoggedInUserGroup";
import {
  resetBooking,
  setUngroupedAttendees,
  setSearchOnce,
  initializeGroupedAttendees,
  setLoggedInUserGroup,
  setSelectedRoom,
  startLoading,
  stopLoading,
  setGroupToDisplay,
} from "../slices/bookingSlice";
import { useGetAvailableRoomsMutation } from "../slices/bookingApiSlice";
import { toast } from "react-toastify";
import Message from "../components/Message";
import BookingRoomsDisplay from "../components/BookingRoomsDisplay";

const BookingPage = () => {
  const {
    data: userEmails,
    error: userEmailsError,
    isLoading: userEmailsLoading,
    refetch,
  } = useGetAllEmailsQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    startTime,
    endTime,
    startDate,
    equipments,
    priority,
    roomCount,
    groupedAttendees,
    ungroupedAttendees,
    searchOnce,
    loading,
    loggedInUser,
  } = useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  const [getAvailableRooms, { isLoading, error }] =
    useGetAvailableRoomsMutation();

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      dispatch(startLoading());
      // check if the user number <= room number
      if (!searchOnce) {
        if (ungroupedAttendees.length + 1 < roomCount) {
          toast.error(
            `${roomCount - ungroupedAttendees.length - 1} more attendees are required to book ${roomCount} rooms`,
          );
          return;
        }
      } else {
        // calculate the total number of attendees
        const totalAttendees =
          groupedAttendees.reduce((acc, current) => {
            if (Array.isArray(current.attendees)) {
              return acc + current.attendees.length;
            }
            return acc;
          }, 0) + 1;
        if (totalAttendees < roomCount) {
          toast.error(
            `${roomCount - totalAttendees} more attendees are required to book ${roomCount} rooms`,
          );
          return;
        }
      }
      const startDateTime = new Date(
        `${startDate}T${startTime}:00.000Z`,
      ).toISOString();
      const endDateTime = new Date(
        `${startDate}T${endTime}:00.000Z`,
      ).toISOString();

      const equipmentCodes = equipments.map((equip) => equip.id);
      let attendeeEmails = [];
      if (searchOnce) {
        attendeeEmails = groupedAttendees.reduce((acc, group) => {
          const emails = group.attendees.map((attendee) => attendee.email);
          return acc.concat(emails);
        }, []);
      } else {
        attendeeEmails = ungroupedAttendees.map((attendee) => attendee.email);
      }
      const allAttendees = [userInfo.email, ...attendeeEmails];
      const reqBody = {
        startTime: startDateTime,
        endTime: endDateTime,
        attendees: allAttendees,
        equipments: equipmentCodes,
        priority: priority.map((entry) => entry.item),
      };
      const availableRooms = await getAvailableRooms(reqBody).unwrap();
      dispatch(
        initializeGroupedAttendees(reorganizeAvailableRooms(availableRooms)),
      );
      dispatch(setGroupToDisplay("Group1"));
      if (!searchOnce) {
        dispatch(setUngroupedAttendees([]));
        dispatch(setSearchOnce(true));
      }
    } catch (err) {
      toast.error(err?.data?.error || "Failed to get available rooms");
      console.log(err?.data?.error);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleReset = () => {
    dispatch(resetBooking());
  };

  const reorganizeAvailableRooms = (availableRooms) => {
    let loggedInUserGroup = null;
    const transformedResponse = availableRooms.result.groups.map(
      (group, index) => {
        // ,ap over each attendee to create a new object with userId instead of user_id
        const updatedAttendees = group.attendees
          .map((attendee) => ({
            userId: attendee.user_id,
            user_id: undefined,
            ...attendee,
          }))
          .filter((attendee) => attendee.email !== userInfo.email) // exclude logged-in user
          .map(({ user_id, first_name, last_name, ...rest }) => rest); // remove user_id field

        const filteredAttendees = updatedAttendees.filter(
          (attendee) => attendee.email !== userInfo.email,
        );

        if (
          group.attendees.length !== filteredAttendees.length &&
          !loggedInUserGroup
        ) {
          loggedInUserGroup = `Group${index + 1}`;
        }

        return {
          groupId: `Group${index + 1}`,
          attendees: filteredAttendees,
          rooms: group.rooms,
          selectedRoom: null,
        };
      },
    );

    if (loggedInUserGroup) {
      dispatch(setLoggedInUserGroup(loggedInUserGroup));
    }

    transformedResponse.push({
      groupId: "Ungrouped",
      attendees: [],
    });

    return transformedResponse;
  };

  const allGroupsHaveSelectedRoom =
    groupedAttendees.every(
      (group) => group.groupId === "Ungrouped" || group.selectedRoom != null,
    ) && loggedInUser.selectedRoom != null;

  console.log("allGroupsHaveSelectedRoom", allGroupsHaveSelectedRoom);

  const handleSubmit = () => {
    navigate("/bookingReview");
  };

  return (
    <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
      <BookingStepper currentStage={1} />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="flex basis-1/3 flex-col items-center justify-center">
          {" "}
          <form onSubmit={handleSearch}>
            <h1 className="mb-4 text-center text-xl font-semibold md:text-start">
              Book a Room
            </h1>
            <div className="flex flex-col gap-3">
              <h2>Select Time</h2>
              <TimeDropdowns />
              {/* <h2>Meeting Type</h2>
            <div className="flex w-80 flex-col rounded-lg bg-gray-200 p-4">
              <div className="relative">
                <select className="block w-full appearance-none rounded-md bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none">
                  <option value="local">Local</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <img
                    src={DropdownArrowSVG}
                    alt="Dropdown Arrow"
                    className="h-5 w-5"
                  />
                </div>
              </div>
            </div> */}
              <h2>Equipments</h2>
              <UserEquipInput />
              <h2>Priority</h2>
              <DragAndDrop />

              <h2>Number of Rooms </h2>
              <UserRoomCountInput />
              {searchOnce ? (
                loading ? (
                  <Loader />
                ) : (
                  <>
                    <h2>Your assigned room: </h2>
                    <LoggedInUserGroup />
                    <h2>Enter user emails by group</h2>
                    <UserEmailGroup />
                  </>
                )
              ) : (
                <>
                  <h2>Enter all user emails</h2>
                  <UserEmailInput />
                </>
              )}
              <div className="my-4 flex w-80 justify-center">
                <button
                  type="submit"
                  className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
          <button
            onClick={handleReset}
            className="rounded bg-theme-dark-blue px-[54px] py-2 text-white transition-colors duration-300  ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Reset
          </button>
        </div>
        <div className="flex basis-2/3 flex-col text-center md:text-start">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="mb-4 text-xl font-semibold">Available Rooms</div>
            {searchOnce && allGroupsHaveSelectedRoom ? (
              <button
                class="rounded bg-theme-orange px-4 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                class="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 opacity-50"
                disabled
              >
                Submit
              </button>
            )}
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error.message}</Message>
          ) : (
            <BookingRoomsDisplay />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

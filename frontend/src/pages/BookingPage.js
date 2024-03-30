import React from "react";
import BookingStepper from "../components/BookingStepper";
import DragAndDrop from "../components/DragAndDrop";
import UserEquipInput from "../components/UserEquipInput";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import UserRoomCountInput from "../components/UserRoomCountInput";
import UserEmailGroup from "../components/UserEmailGroup";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllEmailsQuery } from "../slices/usersApiSlice";
import LoggedInUserGroup from "../components/LoggedInUserGroup";
import ToggleRooms from "../components/ToggleRooms";
import ToggleRegroup from "../components/ToggleRegroup";
import {
  initializeGroupedAttendees,
  resetBooking,
  setGroupToDisplay,
  setIsMultiCity,
  setLoggedInUserGroup,
  setRegroup,
  setRoomCount,
  setSearchOnce,
  setUngroupedAttendees,
  startLoading,
  startSearch,
  stopLoading,
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
    regroup,
    isMultiCity,
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
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${startDate}T${endTime}`).toISOString();

      const equipmentCodes = equipments.map((equip) => equip.id);

      let attendeeEmails = [];

      if (searchOnce) {
        groupedAttendees.forEach((group) => {
          // check if the group has attendees
          if (
            group.groupId !== "Ungrouped" ||
            (group.groupId === "Ungrouped" && group.attendees.length > 0)
          ) {
            const emails = group.attendees.map((attendee) => attendee.email);
            attendeeEmails.push(emails);
          }
        });

        // Check if logged in user has a group and add them to it
        const loggedInUserGroupIndex = groupedAttendees.findIndex(
          (group) => group.groupId === loggedInUser.group,
        );
        if (loggedInUserGroupIndex !== -1) {
          attendeeEmails[loggedInUserGroupIndex].push(userInfo.email);
        } else {
          // unlikely to happen, but just in case
          attendeeEmails.push([userInfo.email]);
        }
      } else {
        // ungrouped case
        attendeeEmails = [
          [
            userInfo.email,
            ...ungroupedAttendees.map((attendee) => attendee.email),
          ],
        ];
      }

      if (regroup) {
        attendeeEmails = [attendeeEmails.flat()];
      }

      const reqBody = {
        startTime: startDateTime,
        endTime: endDateTime,
        attendees: attendeeEmails,
        equipments: equipmentCodes,
        roomCount: roomCount,
        regroup: regroup,
        priority: priority.map((entry) => entry.item),
      };

      console.log("reqBody", reqBody);
      const availableRooms = await getAvailableRooms(reqBody).unwrap();

      if (!searchOnce) {
        dispatch(setUngroupedAttendees([]));
        dispatch(setSearchOnce(true));
      }
      dispatch(setRegroup(false)); // always set to Same Group unless isMultiCity
      dispatch(
        initializeGroupedAttendees(reorganizeAvailableRooms(availableRooms)),
      );
      dispatch(startSearch());

      dispatch(setGroupToDisplay("Group1"));
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.error || "Failed to get available rooms");
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

    const newRoomCount = availableRooms.result.groups.length;
    const isMultiCity = availableRooms.result.isMultiCity;
    dispatch(setRoomCount(newRoomCount));
    dispatch(setIsMultiCity(isMultiCity));
    if (isMultiCity) {
      dispatch(setRegroup(true));
      toast.info(
        "Attendees are from different cities. Room counts may be adjusted to match the number of cities.",
      );
    }

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
    groupedAttendees.every((group) =>
      group.groupId !== "Ungrouped"
        ? group.selectedRoom != null
        : group.attendees.length === 0,
    ) && loggedInUser.selectedRoom != null;

  const handleSubmit = () => {
    navigate("/bookingReview");
  };

  return (
    <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
      <BookingStepper currentStage={1} />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="flex basis-1/3 flex-col items-center justify-center">
          <form onSubmit={handleSearch}>
            <h1 className="mb-4 text-center text-xl font-semibold md:text-start">
              New Booking
            </h1>
            <div className="flex flex-col gap-3">
              <h2 className="mt-4">Date and time:</h2>
              <TimeDropdowns />
              <h2>Number of rooms:</h2>
              <div className="text-sm text-gray-500">
                Auto-determined for multi-city attendees
              </div>
              <UserRoomCountInput />
              {searchOnce ? (
                loading ? (
                  <Loader />
                ) : (
                  <>
                    <h2>Select rooms by attendee groups:</h2>
                    <UserEmailGroup />
                    <h2>Your assigned group:</h2>
                    <LoggedInUserGroup />
                  </>
                )
              ) : (
                <>
                  <h2>Enter all attendee emails:</h2>
                  <div className="text-sm text-gray-500">
                    You are automatically included
                  </div>
                  <UserEmailInput />
                </>
              )}
              {searchOnce && !isMultiCity && (
                <div>
                  <h2>Auto-regroup:</h2>
                  <ToggleRegroup />
                </div>
              )}
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
              <h2>Room equipments:</h2>
              <UserEquipInput />
              <h2>Sorting priorities:</h2>
              <DragAndDrop />
              <div className="my-4 flex items-center justify-center">
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
            className="mb-4 rounded bg-theme-dark-blue px-[52px] py-2 text-white transition-colors duration-300  ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Reset
          </button>
        </div>
        <div className="flex basis-2/3 flex-col text-center md:text-start">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <div className="mb-4 text-xl font-semibold">Available Rooms</div>
            </div>

            <div className="flex items-start justify-center gap-4">
              <ToggleRooms />
              {searchOnce && allGroupsHaveSelectedRoom ? (
                <button
                  className="rounded bg-theme-orange px-6 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              ) : (
                <button
                  className="cursor-not-allowed rounded-md bg-gray-300 px-6 py-2 opacity-50"
                  disabled
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message severity="error">{error.data?.error}</Message>
          ) : (
            <BookingRoomsDisplay />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

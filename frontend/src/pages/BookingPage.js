import React, { useState, useMemo } from "react";
import BookingStepper from "../components/BookingStepper";
import DragAndDrop from "../components/DragAndDrop";
import UserEquipInput from "../components/UserEquipInput";
import UserEmailInput from "../components/UserEmailInput";
import TimeDropdowns from "../components/TimeDropdown";
import StartSearchGIF from "../assets/start-search.gif";
import Pagination from "../components/Pagination";
import MeetingRoomImg from "../assets/meeting-room.jpg";
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
} from "../slices/bookingSlice";
import { useGetAvailableRoomsMutation } from "../slices/bookingApiSlice";
import { toast } from "react-toastify";
import Message from "../components/Message";

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
  } = useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  const [getAvailableRooms, { isLoading, error }] =
    useGetAvailableRoomsMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination event handlers
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const availableRoomsData = useMemo(
    () => groupedAttendees.flatMap((group) => group.rooms),
    [groupedAttendees],
  );

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = availableRoomsData.slice(startIndex, endIndex);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

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
      if (!searchOnce) {
        dispatch(setUngroupedAttendees([]));
        dispatch(setSearchOnce(true));
      }
    } catch (err) {
      toast.error(err?.data?.error || "Failed to get available rooms");
      console.log(err?.data?.error);
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
      rooms: null,
      selectedRoom: null,
    });

    return transformedResponse;
  };

  const handleOnClick = (e, room) => {
    e.preventDefault();
    navigate("/bookingReview");
    dispatch(setSelectedRoom(room));
  };

  return (
    <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
      <BookingStepper currentStage={1} />

      <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Input Part */}
        <div className="flex basis-1/3 flex-col items-center justify-center">
          {" "}
          <form onSubmit={handleSubmit}>
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
                <>
                  <h2>Your assigned room: </h2>
                  <LoggedInUserGroup />
                  <h2>Enter user emails by group</h2>
                  <UserEmailGroup />
                </>
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
                  Submit
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
          <div className="mb-4 text-xl font-semibold">Available Rooms</div>
          <div className="flex flex-col items-center justify-center">
            {groupedAttendees.length > 0 ? (
              isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="error">{error.message}</Message>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    {paginatedData.map((room) => (
                      <div
                        key={room.roomId}
                        className="flex flex-col justify-between bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl xl:flex-row"
                      >
                        <div className="flex flex-col items-center xl:flex-row">
                          <div className="">
                            <img
                              src={MeetingRoomImg}
                              alt="meeting room"
                              className="h-[25vh] object-cover"
                            />
                          </div>
                          <div className="mt-6 flex flex-col xl:ml-6 xl:mt-0">
                            <div className="mt-2 text-lg text-theme-orange">
                              {`${room.cityId}${room.buildingCode} ${room.floor.toString().padStart(2, "0")}.${room.roomCode} ${room.roomName ? room.roomName : ""} `}
                            </div>
                            <div className="mt-2">
                              <span className="font-semibold">Equipments:</span>{" "}
                              {room.hasAV && room.hasVC
                                ? "AV / VC"
                                : room.hasAV
                                  ? "AV"
                                  : room.hasVC
                                    ? "VC"
                                    : "None"}
                            </div>

                            <div className="mt-2">
                              <span className="font-semibold">
                                Number of Seats:
                              </span>{" "}
                              {room.seats}
                            </div>
                          </div>
                        </div>

                        <div className="m-5 flex justify-center xl:items-end">
                          <Link
                            to={"/bookingReview"}
                            onClick={(e) => handleOnClick(e, room)}
                            className="rounded bg-theme-orange px-8 py-0.5 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white"
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    count={availableRoomsData.length}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img
                  src={StartSearchGIF}
                  alt="Start Search"
                  className="h-96 w-96"
                />
                <h1 className="text-2xl font-semibold">
                  Start searching for available rooms
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

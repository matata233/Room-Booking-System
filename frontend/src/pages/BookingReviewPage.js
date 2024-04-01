import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAvailableRoomsMutation,
  useConfirmBookingMutation,
} from "../slices/bookingApiSlice";
import {
  initializeGroupedAttendees,
  resetBooking,
  setGroupToDisplay,
  setIsMultiCity,
  setLoggedInUserGroup,
  setRegroup,
  setRoomCount,
  startLoading,
  startSearch,
  stopLoading,
} from "../slices/bookingSlice";
import { toast } from "react-toastify";
import moment from "moment-timezone";

const BookingReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    startTime,
    endTime,
    equipments,
    priority,
    roomCount,
    groupedAttendees,
    loggedInUser,
  } = useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  const utcStartTime = new Date(startTime).toISOString();
  const utcEndTime = new Date(endTime).toISOString();

  const formattedStartTime = moment(utcStartTime)
    .tz(moment.tz.guess())
    .format("YYYY-MM-DD HH:mm z");
  const formattedEndTime = moment(utcEndTime)
    .tz(moment.tz.guess())
    .format("YYYY-MM-DD HH:mm z");

  const [confirmBooking, { isLoading, error }] = useConfirmBookingMutation();
  const [
    getAvailableRooms,
    { isLoading: getAvailableRoomsLoading, error: getAvailableRoomsError },
  ] = useGetAvailableRoomsMutation();

  const createRequestBodyForConfirm = () => {
    const rooms = [];
    const users = [];

    groupedAttendees.forEach((group) => {
      if (group.selectedRoom) {
        rooms.push(group.selectedRoom.roomId);
        const groupUsers =
          group.groupId === loggedInUser.group ? [userInfo.userId] : [];
        group.attendees.forEach((attendee) => {
          groupUsers.push(attendee.userId);
        });
        users.push(groupUsers);
      }
    });

    const reqBody = {
      createdBy: userInfo.userId,
      startTime: utcStartTime,
      endTime: utcEndTime,
      rooms,
      users,
    };

    return reqBody;
  };

  const createRequestBodyForGetAvailableRooms = () => {
    const startDateTime = new Date(startTime).toISOString();
    const endDateTime = new Date(endTime).toISOString();

    const equipmentCodes = equipments.map((equip) => equip.id);

    let attendeeEmails = [];

    groupedAttendees.forEach((group) => {
      // check if the group has attendees
      if (group.groupId !== "Ungrouped") {
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

    const reqBody = {
      startTime: startDateTime,
      endTime: endDateTime,
      attendees: attendeeEmails,
      equipments: equipmentCodes,
      roomCount: roomCount,
      regroup: false,
      priority: priority.map((entry) => entry.item),
    };

    return reqBody;
  };

  const handleOnClick = async () => {
    try {
      const reqBodyConfirm = createRequestBodyForConfirm();
      const response = await confirmBooking(reqBodyConfirm).unwrap();
      dispatch(resetBooking());
      navigate("/bookingComplete", { state: response });
      toast.success("Booking confirmed successfully");
    } catch (err) {
      try {
        dispatch(startLoading());
        const reqBodyRooms = createRequestBodyForGetAvailableRooms();
        const availableRooms = await getAvailableRooms(reqBodyRooms).unwrap();
        dispatch(
          initializeGroupedAttendees(reorganizeAvailableRooms(availableRooms)),
        );
        dispatch(startSearch());
        dispatch(setGroupToDisplay("Group1"));

        toast.error(err?.data?.error || "Failed to confirm booking");
      } catch (err) {
        toast.error(err?.data?.error || "Failed to refetch available rooms");
      } finally {
        navigate("/booking");
        dispatch(stopLoading());
      }
    }
  };

  const reorganizeAvailableRooms = (availableRooms) => {
    let loggedInUserGroup = null;
    const transformedResponse = availableRooms.result.groups.map(
      (group, index) => {
        // map over each attendee to create a new object with userId instead of user_id
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

  const displayableGroups = groupedAttendees.filter(
    (group) => group.groupId !== "Ungrouped",
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember ">
        <BookingStepper currentStage={2} />

        <div className="mx-6 rounded-xl border-4 border-transparent bg-theme-orange px-5 py-5 text-center transition-all duration-300 hover:border-theme-orange hover:bg-white hover:text-theme-orange md:w-1/2 md:text-start lg:w-1/4">
          <div>
            <span className="font-semibold">
              {` ${groupedAttendees.length - 1} Room${groupedAttendees.length - 1 > 1 ? "s" : ""}`}
            </span>
          </div>
          <div>
            <span className="font-semibold">{`From ${formattedStartTime}`}</span>{" "}
          </div>
          <div>
            <span className="font-semibold">{`To ${formattedEndTime}`}</span>{" "}
          </div>
        </div>

        {displayableGroups.map((group) => (
          <div
            key={group.groupId}
            className="mx-6 bg-white px-5 pb-5  shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center justify-between lg:flex-row">
              <div>
                <h1 className="py-3 text-center text-2xl font-bold text-theme-orange lg:text-start">
                  {group.groupId}
                </h1>
                <img
                  src={MeetingRoomImg}
                  alt="meeting room"
                  className="h-[25vh] object-cover"
                />
              </div>
              <div className="mt-6 flex flex-col  justify-start gap-1">
                <div>
                  <span className=" text-theme-orange">Room: </span>{" "}
                  {`${group?.selectedRoom?.cityId}${group?.selectedRoom?.buildingCode} ${group?.selectedRoom?.floor.toString().padStart(2, "0")}.${group?.selectedRoom?.roomCode} ${group?.selectedRoom?.roomName ? group?.selectedRoom?.roomName : ""} `}{" "}
                </div>
                <div>
                  <span className=" text-theme-orange">Capacity: </span>
                  {group?.selectedRoom?.seats}
                </div>
                <div>
                  <span className=" text-theme-orange">Equipments: </span>
                  {group?.selectedRoom?.hasAV && group?.selectedRoom?.hasVC
                    ? "AV / VC"
                    : group?.selectedRoom?.hasAV
                      ? "AV"
                      : group?.selectedRoom?.hasVC
                        ? "VC"
                        : "None"}
                </div>
              </div>

              <div className="mt-10 flex flex-col lg:mt-0">
                <div className="mb-2 text-center font-semibold">
                  {/* Calculate total attendees and determine singular or plural form */}
                  <h2>
                    {`${group.groupId === loggedInUser.group ? group.attendees.length + 1 : group.attendees.length} Attendee${group.groupId === loggedInUser.group ? (group.attendees.length + 1 !== 1 ? "s" : "") : group.attendees.length !== 1 ? "s" : ""}`}
                  </h2>
                </div>
                <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
                  {/* Check if the logged-in user is in this group and display them */}
                  {group.groupId === loggedInUser.group && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                      <div className="ml-2">{userInfo.email}</div>
                    </div>
                  )}
                  {/* Map over attendees to display each */}
                  {group.attendees.map((attendee, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                      <div className="ml-2">{attendee.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <div className="mt-10 flex justify-center">
          <button
            className="rounded bg-theme-orange px-12 py-2 text-black transition-colors duration-300  ease-in-out hover:bg-theme-dark-orange hover:text-white"
            onClick={handleOnClick}
          >
            Confirm
          </button>
        </div>
        <div className="my-2 flex justify-center">
          <Link
            to="/booking"
            className="rounded bg-theme-dark-blue px-[52px] py-2 text-white transition-colors duration-300 ease-in-out hover:bg-theme-blue hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;

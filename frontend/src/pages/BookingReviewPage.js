import React from "react";
import BookingStepper from "../components/BookingStepper";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useConfirmBookingMutation } from "../slices/bookingApiSlice";
import { resetBooking } from "../slices/bookingSlice";
import { toast } from "react-toastify";
const BookingReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { startDate, startTime, endTime, groupedAttendees, loggedInUser } =
    useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  const [confirmBooking, { isLoading, error }] = useConfirmBookingMutation();

  const createRequestBody = () => {
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
      startTime: new Date(`${startDate}T${startTime}`).toISOString(),
      endTime: new Date(`${startDate}T${endTime}`).toISOString(),
      rooms,
      users,
    };

    return reqBody;
  };

  const handleOnClick = async () => {
    try {
      const reqBody = createRequestBody();
      console.log(reqBody);
      const response = await confirmBooking(reqBody).unwrap();
      dispatch(resetBooking());
      navigate("/bookingComplete", { state: response });
      toast.success("Booking confirmed successfully");
    } catch (err) {
      navigate("/booking");
      toast.error(err?.data?.error || "Failed to confirm booking");
    }
  };

  const displayableGroups = groupedAttendees.filter(
    (group) => group.groupId !== "Ungrouped",
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember ">
        <BookingStepper currentStage={2} />

        <div className="mx-6 rounded-xl border-4 border-transparent bg-theme-orange px-5 py-5 text-center transition-all duration-300 hover:border-theme-orange hover:bg-white hover:text-theme-orange md:w-1/4 md:text-start">
          <div>
            <span className="font-semibold">
              {` ${groupedAttendees.length - 1} Room${groupedAttendees.length - 1 > 1 ? "s" : ""}`}
            </span>
          </div>
          <div>
            <span className="font-semibold">Date: </span> {startDate}
          </div>
          <div>
            <span className="font-semibold">Time: </span> {startTime}-{endTime}
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
                  {`${group.selectedRoom.cityId}${group.selectedRoom.buildingCode} ${group.selectedRoom.floor.toString().padStart(2, "0")}.${group.selectedRoom.roomCode} ${group.selectedRoom.roomName ? group.selectedRoom.roomName : ""} `}{" "}
                </div>
                <div>
                  <span className=" text-theme-orange">Capacity: </span>
                  {group.selectedRoom.seats}
                </div>
                <div>
                  <span className=" text-theme-orange">Equipments: </span>
                  {group.selectedRoom.hasAV && group.selectedRoom.hasVC
                    ? "AV / VC"
                    : group.selectedRoom.hasAV
                      ? "AV"
                      : group.selectedRoom.hasVC
                        ? "VC"
                        : "None"}
                </div>
              </div>

              <div className="mt-10 flex flex-col lg:mt-0">
                <div className="mb-2 text-center font-semibold">
                  <h2>Attendee(s):</h2>
                </div>
                <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
                  {group.attendees.map((attendee, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                      <div className="ml-2">{attendee.email}</div>
                    </div>
                  ))}
                  {/* check if the logged in user is in this group */}
                  {group.groupId === loggedInUser.group && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                      <div className="ml-2">{userInfo.email}</div>
                    </div>
                  )}
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

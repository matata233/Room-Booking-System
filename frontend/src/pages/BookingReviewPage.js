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

  const { startDate, startTime, endTime, ungroupedAttendees, selectedRoom } =
    useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.auth);

  const [confirmBooking, { isLoading, error }] = useConfirmBookingMutation();

  const handleOnClick = async () => {
    try {
      const startDateTime = new Date(
        `${startDate}T${startTime}:00.000Z`,
      ).toISOString();
      const endDateTime = new Date(
        `${startDate}T${endTime}:00.000Z`,
      ).toISOString();
      const attendIds = ungroupedAttendees.map((attendee) => attendee.userId);

      const reqBody = {
        createdBy: userInfo.userId,
        startTime: startDateTime,
        endTime: endDateTime,
        rooms: [selectedRoom.roomId],
        users: [[...attendIds]],
      };
      const response = await confirmBooking(reqBody).unwrap();
      dispatch(resetBooking());
      navigate("/bookingComplete", { state: response });
      toast.success("Booking confirmed successfully");
    } catch (err) {
      navigate("/booking");
      toast.error(err?.data?.error || "Failed to confirm booking");
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex w-full flex-col gap-y-12 font-amazon-ember">
        <BookingStepper currentStage={2} />

        <div className="mx-6 bg-white px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div>
              <img
                src={MeetingRoomImg}
                alt="meeting room"
                className="h-[25vh] object-cover"
              />
            </div>
            <div className="mt-6 flex flex-col  justify-start gap-1">
              <div>
                <span className="font-semibold">Date: </span> {startDate}
              </div>
              <div>
                <span className="font-semibold">Time: </span> {startTime} -
                {endTime}
              </div>
              <div>
                <span className="font-semibold">Room: </span>
                {selectedRoom?.name} {selectedRoom?.code}
              </div>
              <div>
                <span className="font-semibold">Capacity: </span>
                {selectedRoom?.seats}
              </div>
              {/* <div>
                <span className="font-semibold">Equipments:</span> ${selectedRoom?.equipments}
              </div>
              <div>
                <span className="font-semibold">Location:</span> Building 112
              </div> */}
            </div>

            {/* Attendees */}
            <div className="mt-10 flex flex-col lg:mt-0">
              <div className="mb-2 text-center font-semibold">
                <h2>Attendee(s):</h2>
              </div>
              <div className="h-32 w-80 overflow-y-auto rounded-lg bg-gray-200 pl-4 pt-2">
                {[
                  ...ungroupedAttendees,
                  { userId: userInfo.userId, email: userInfo.email },
                ].map((attendee) => (
                  <div key={attendee.userId} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-theme-orange"></div>
                    <div className="ml-2">{attendee.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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

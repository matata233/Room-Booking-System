import React, { useState, useMemo } from "react";
import StartSearchGIF from "../assets/start-search.gif";
import Pagination from "../components/Pagination";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectedRoomForGroup, stopSearch } from "../slices/bookingSlice";
import Message from "../components/Message";

const BookingRoomsDisplay = ({ showRecommended }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { groupedAttendees, groupToDisplay, searching } = useSelector(
    (state) => state.booking,
  );

  const availableRoomsData = useMemo(() => {
    // find the group by groupToDisplay
    const group = groupedAttendees.find((g) => g.groupId === groupToDisplay);
    let rooms = group ? (group.rooms ? group.rooms : []) : [];

    // If showRecommended is true, filter the rooms to only include those marked as recommended
    if (showRecommended) {
      rooms = rooms.filter((room) => room.recommended === true);
    }

    const selectedRoomsInOtherGroups = new Set(
      groupedAttendees
        .filter(
          (group) => group.groupId !== groupToDisplay && group.selectedRoom,
        )
        .map((group) => group.selectedRoom.roomId),
    );
    rooms = rooms.filter(
      (room) => !selectedRoomsInOtherGroups.has(room.roomId),
    );

    if (
      searching &&
      rooms.length === 0 &&
      groupToDisplay !== "Ungrouped" &&
      groupToDisplay !== false
    ) {
      const message = showRecommended
        ? "No recommended rooms found"
        : "No available rooms found";
      toast.info(message);
      dispatch(stopSearch());
    }
    return rooms;
  }, [groupedAttendees, groupToDisplay, showRecommended, searching, dispatch]);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = availableRoomsData.slice(startIndex, endIndex);

  const handleOnClick = (room) => {
    return () => {
      dispatch(setSelectedRoomForGroup({ groupId: groupToDisplay, room }));
    };
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {availableRoomsData.length > 0 ? ( // If there are available rooms
        <>
          <div className="flex h-[1400px] flex-col gap-4 overflow-y-auto">
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
                      {`${room.cityId}${room.buildingCode} ${room.floor.toString().padStart(2, "0")}.${room.roomCode} ${room.roomName ? room.roomName : ""} `}{" "}
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
                      <span className="font-semibold">Number of Seats:</span>{" "}
                      {room.seats}
                    </div>
                  </div>
                </div>

                <div className="m-5 flex justify-center xl:items-end">
                  <button
                    onClick={handleOnClick(room)}
                    className="rounded bg-theme-orange px-8 py-0.5 text-black transition-colors duration-300 ease-in-out hover:bg-theme-dark-orange hover:text-white"
                  >
                    Book
                  </button>
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
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img src={StartSearchGIF} alt="Start Search" className="h-96 w-96" />
          <h1 className="text-2xl font-semibold">
            Start searching for available rooms
          </h1>
        </div>
      )}
    </div>
  );
};

export default BookingRoomsDisplay;

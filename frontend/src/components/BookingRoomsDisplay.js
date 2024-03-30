import React, { useState, useMemo } from "react";
import StartSearchGIF from "../assets/start-search.gif";
import Pagination from "../components/Pagination";
import MeetingRoomImg from "../assets/meeting-room.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setSelectedRoomForGroup, stopSearch } from "../slices/bookingSlice";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import RoomSelectionModal from "./RoomSelectionModal";

const BookingRoomsDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showRecommended } = useSelector((state) => state.booking);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomForModal, setSelectedRoomForModal] = useState(null);
  const [messageForModal, setMessageForModal] = useState(null);

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

  const { groupedAttendees, groupToDisplay, searching, equipments } =
    useSelector((state) => state.booking);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRooms = useMemo(() => {
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

    // Filter rooms based on search query
    return rooms.filter((room) =>
      room.roomName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [
    groupedAttendees,
    groupToDisplay,
    showRecommended,
    searching,
    dispatch,
    searchQuery,
  ]);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredRooms.slice(startIndex, endIndex);

  const handleRoomSelection = (room) => {
    return () => {
      if (!room.recommended) {
        setSelectedRoomForModal(room);
        let warnings = [];

        // Check for AV equipment
        if (
          equipments.some((equipment) => equipment.id === "AV") &&
          !room.hasAV
        ) {
          warnings.push(
            <li key="av">
              The meeting requires AV equipment, but it's not available in this
              room.
            </li>,
          );
        }

        // Check for VC equipment
        if (
          equipments.some((equipment) => equipment.id === "VC") &&
          !room.hasVC
        ) {
          warnings.push(
            <li key="vc">
              The meeting requires VC equipment, but it's not available in this
              room.
            </li>,
          );
        }

        // Check if the room is big enough
        if (!room.isBigEnough) {
          warnings.push(
            <li key="size">The room is not big enough for the group.</li>,
          );
        }

        // Construct the JSX message
        let messageJSX = (
          <div>
            {warnings.length > 0 && (
              <div>
                <p>
                  Please review the following{" "}
                  {warnings.length === 1 ? "issue" : "issues"} before
                  proceeding:
                </p>
                <ul className="my-6 text-theme-blue">{warnings}</ul>
              </div>
            )}
            <p className="text-red-400">
              This room is not recommended. Are you sure you want to select it?
            </p>
          </div>
        );

        setMessageForModal(messageJSX);
        setIsModalOpen(true);
      } else {
        dispatch(setSelectedRoomForGroup({ groupId: groupToDisplay, room }));
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center sm:items-stretch">
      {/* Search Bar */}
      <div className="my-4 flex items-center sm:m-0">
        <label className="mr-2 sm:my-4">Search:</label>
        <input
          type="text"
          placeholder="Enter room name..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="text-md h-9 w-60 rounded-lg border-2 border-gray-200 p-2  md:text-base"
        />
      </div>
      {filteredRooms.length > 0 ? ( // If there are available rooms
        <>
          <div className="flex h-[1400px] flex-col gap-4 overflow-y-auto">
            {paginatedData.map((room) => (
              <div
                key={room.roomId}
                className={`flex flex-col justify-between ${room.recommended ? "bg-white" : "bg-zinc-200"} px-5 py-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl xl:flex-row`}
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

                <div
                  className="group m-5 flex cursor-pointer  justify-center xl:items-end"
                  onClick={handleRoomSelection(room)}
                >
                  {groupedAttendees.find(
                    (group) => group.groupId === groupToDisplay,
                  )?.selectedRoom?.roomId === room.roomId ? (
                    <>
                      {" "}
                      <ImCheckboxChecked className="size-6 text-theme-orange" />
                      <span className="ml-3 text-theme-orange">Select</span>
                    </>
                  ) : (
                    <>
                      <ImCheckboxUnchecked className="size-6 group-hover:text-theme-orange" />{" "}
                      <span className="ml-3 group-hover:text-theme-orange">
                        Select
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isModalOpen && (
            <RoomSelectionModal
              message={messageForModal}
              onConfirm={() => {
                dispatch(
                  setSelectedRoomForGroup({
                    groupId: groupToDisplay,
                    room: selectedRoomForModal,
                  }),
                );
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          <Pagination
            count={filteredRooms.length}
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

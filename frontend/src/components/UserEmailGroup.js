import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import DropdownArrowSVG from "../assets/dropdown-arrow.svg";
import Accordion from "./Accordion";

const UserEmailGroup = () => {
  const bookingData = {
    groups: [
      {
        groupId: "group1",
        attendees: [
          {
            id: "attendee1",
            email: "attendee1@example.com",
          },
          {
            id: "attendee2",
            email: "attendee2@example.com",
          },
          {
            id: "attendee3",
            email: "attendee3@example.com",
          },
        ],
        recommendedRooms: [
          {
            roomId: 1,
            cityId: "YVR",
            buildingCode: 32,
            floorNumber: 1,
            roomCode: "101",
            roomName: "A",
            numberOfSeats: 4,
            equipments: [
              {
                equipmentId: "AV",
                description: "Audio visual equipment in room",
              },
              {
                equipmentId: "VC",
                description: "Video Conference equipment in room",
              },
            ],
          },
          {
            roomId: 2,
            cityId: "YVR",
            buildingCode: 32,
            floorNumber: 2,
            roomCode: "201",
            roomName: "B",
            numberOfSeats: 4,
            equipments: [
              {
                equipmentId: "AV",
                description: "Audio visual equipment in room",
              },
              {
                equipmentId: "VC",
                description: "Video Conference equipment in room",
              },
            ],
          },
        ],
      },
      {
        groupId: "group2",
        attendees: [
          {
            id: "attendee4",
            email: "attendee4@example.com",
          },
          {
            id: "attendee5",
            email: "attendee5@example.com",
          },
        ],
        recommendedRooms: [
          {
            roomId: 3,
            cityId: "YVR",
            buildingCode: 32,
            floorNumber: 1,
            roomCode: "102",
            roomName: "C",
            numberOfSeats: 4,
            equipments: [
              {
                equipmentId: "AV",
                description: "Audio visual equipment in room",
              },
            ],
          },
          {
            roomId: 4,
            cityId: "YVR",
            buildingCode: 32,
            floorNumber: 2,
            roomCode: "202",
            roomName: "D",
            numberOfSeats: 4,
            equipments: [
              {
                equipmentId: "AV",
                description: "Audio visual equipment in room",
              },
            ],
          },
        ],
      },
    ],
  };

  const [open, setOpen] = useState(false);
  const toggle = (index) => {
    if (open === index) {
      setOpen(false);
    } else {
      setOpen(index);
    }
  };

  return (
    <div className="flex w-80 flex-col space-y-4 rounded-lg bg-gray-200 p-4">
      {bookingData.groups.map((data, index) => (
        <div key={index} className="flex flex-col">
          <Accordion
            key={index}
            open={index === open}
            toggle={() => toggle(index)}
            title={data.groupId}
            content={data.attendees}
          />
        </div>
      ))}
    </div>
  );
};

export default UserEmailGroup;

// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const initialState = {
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  startTime: "00:00",
  endTime: "23:45",
  equipments: [],
  priority: [
    {
      id: 1,
      item: "Proximity",
    },
    {
      id: 2,
      item: "Seats",
    },
    {
      id: 3,
      item: "Equipment",
    },
  ],
  roomCount: 1,
  groupedAttendees: [
    {
      groupId: "group1",
      attendees: [],
      rooms: [
        {
          roomId: 1,
          cityId: "YVR",
          buildingCode: 32,
          floorNumber: 1,
          roomCode: "101",
          roomName: "A",
          numberOfSeats: 4,
          has_vc: true,
          has_av: true,
          recomended: true,
        },
        {
          roomId: 2,
          cityId: "YVR",
          buildingCode: 32,
          floorNumber: 2,
          roomCode: "201",
          roomName: "B",
          numberOfSeats: 4,
          has_vc: true,
          has_av: true,
          recomended: false,
        },
      ],
    },
    {
      groupId: "group2",
      attendees: [],
      rooms: [
        {
          roomId: 3,
          cityId: "YVR",
          buildingCode: 32,
          floorNumber: 1,
          roomCode: "102",
          roomName: "C",
          numberOfSeats: 4,
          has_vc: true,
          has_av: true,
          recomended: true,
        },
        {
          roomId: 4,
          cityId: "YVR",
          buildingCode: 32,
          floorNumber: 2,
          roomCode: "202",
          roomName: "D",
          numberOfSeats: 4,
          has_vc: true,
          has_av: true,
          recomended: false,
        },
      ],
    },
  ],
  ungroupedAttendees: [],
  searchOnce: false,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    addEquipment: (state, action) => {
      const existingIndex = state.equipments.findIndex(
        (equip) => equip.id === action.payload.id,
      );
      if (existingIndex === -1) {
        // only add if it doesn't exist
        state.equipments.push(action.payload);
      }
    },
    removeEquipment: (state, action) => {
      state.equipments = state.equipments.filter(
        (equip) => equip.id !== action.payload.id,
      );
    },
    setPriority: (state, action) => {
      state.priority = action.payload;
    },
    setRoomCount: (state, action) => {
      state.roomCount = action.payload;
    },
    setGroupedAttendees: (state, action) => {
      const { groupId, attendees } = action.payload;
      const groupIndex = state.groupedAttendees.findIndex(
        (group) => group.groupId === groupId,
      );

      if (groupIndex !== -1) {
        state.groupedAttendees[groupIndex].attendees = attendees;
      } else {
        state.groupedAttendees.push({
          groupId,
          attendees,
          rooms: [],
        });
      }
    },

    setUngroupedAttendees: (state, action) => {
      state.ungroupedAttendees = action.payload;
    },

    setSearchOnce: (state, action) => {
      state.searchOnce = action.payload;
    },
    resetBooking: (state) => (state = initialState),
  },
});

export const {
  setStartDate,
  setStartTime,
  setEndTime,
  addEquipment,
  removeEquipment,
  setPriority,
  setRoomCount,
  setGroupedAttendees,
  setUngroupedAttendees,
  setSearchOnce,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

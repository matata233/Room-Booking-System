// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const persistedUserInfo = localStorage.getItem("userInfo");
const userInfo = persistedUserInfo ? JSON.parse(persistedUserInfo) : null;

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
  groupedAttendees: [],
  ungroupedAttendees: [],
  loggedInUser: {
    group: null,
  },
  selectedRoom: null,
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
    initializeGroupedAttendees: (state, action) => {
      state.groupedAttendees = action.payload;
    },

    setUngroupedAttendees: (state, action) => {
      state.ungroupedAttendees = action.payload;
    },

    setSearchOnce: (state, action) => {
      state.searchOnce = action.payload;
    },
    setLoggedInUserGroup: (state, action) => {
      state.loggedInUser.group = action.payload;
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
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
  initializeGroupedAttendees,
  setSearchOnce,
  setLoggedInUserGroup,
  setSelectedRoom,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  startDate: new Date().toISOString().split("T")[0],
  startTime: "",
  endTime: "",
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
  groups: [
    {
      groupId: uuidv4(),
      attendees: [
        {
          id: uuidv4(),
          email: "",
        },
      ],
    },
  ],
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
      const newRoomCount = action.payload;
      const currentRoomCount = state.roomCount;
      const difference = newRoomCount - currentRoomCount;

      if (difference > 0) {
        // Add new groups with a placeholder attendee for each additional room
        for (let i = 0; i < difference; i++) {
          state.groups.push({
            groupId: uuidv4(), // Generate a unique ID for the new group
            attendees: [{ id: uuidv4(), email: "" }], // Placeholder attendee
          });
        }
      } else if (difference < 0) {
        // Remove groups if the room count decreases, ensuring we don't go below zero
        state.groups.splice(difference); // This removes groups from the end
      }

      state.roomCount = newRoomCount; // Finally, update the room count
    },

    addGroup: (state) => {
      const newGroup = {
        groupId: uuidv4(), // Generates a universally unique identifier
        attendees: [{ id: uuidv4(), email: "" }], // Initial placeholder attendee
      };
      state.groups.push(newGroup);
    },
    removeGroup: (state) => {
      state.groups.pop();
    },
    addAttendeePlaceholder: (state, action) => {
      const groupIndex = state.groups.findIndex(
        (group) => group.groupId === action.payload.groupId,
      );
      if (groupIndex !== -1) {
        state.groups[groupIndex].attendees.push({ id: uuidv4(), email: "" });
      }
    },
    updateAttendee: (state, action) => {
      const { groupId, attendeeIndex, attendeeDetails } = action.payload;
      const group = state.groups.find((group) => group.groupId === groupId);
      if (group && group.attendees[attendeeIndex]) {
        group.attendees[attendeeIndex] = { ...attendeeDetails };
      }
    },
    removeAttendee: (state, action) => {
      const { groupId, attendeeId } = action.payload;
      const groupIndex = state.groups.findIndex(
        (group) => group.groupId === groupId,
      );
      if (groupIndex !== -1) {
        state.groups[groupIndex].attendees = state.groups[
          groupIndex
        ].attendees.filter((attendee) => attendee.id !== attendeeId);
      }
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
  addGroup,
  removeGroup,
  addAttendeePlaceholder,
  updateAttendee,
  removeAttendee,
  setSearchOnce,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;

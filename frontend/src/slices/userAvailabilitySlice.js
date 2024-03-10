// userAvailabilitySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeEntries: [
    {
      id: "",
      startDate: new Date(),
      startTime: "00:00",
      endTime: "00:00",
      submitted: false,
    },
  ],
};

const userAvailabilitySlice = createSlice({
  name: "userAvailability",
  initialState,
  reducers: {
    setTimeEntries: (state, action) => {
      state.timeEntries = action.payload;
    },
    addTimeEntry: (state, action) => {
      state.timeEntries.push(action.payload);
    },
    deleteTimeEntry: (state, action) => {
      state.timeEntries = state.timeEntries.filter(
        (entry) => entry.id !== action.payload,
      );
    },
    submitTimeEntry: (state, action) => {
      const index = state.timeEntries.findIndex(
        (entry) => entry.id === action.payload,
      );
      if (index !== -1) {
        state.timeEntries[index].submitted = true;
      }
    },
  },
});

export const {
  setTimeEntries,
  addTimeEntry,
  deleteTimeEntry,
  submitTimeEntry,
} = userAvailabilitySlice.actions;
export default userAvailabilitySlice.reducer;

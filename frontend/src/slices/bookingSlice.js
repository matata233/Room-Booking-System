// bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  nextDay,
  nextDayAtTen,
  sevenDaysLaterAtTen,
  nextDayAtNoon,
} from "../utils/getDateTime";


const persistedUserInfo = localStorage.getItem("userInfo");
const userInfo = persistedUserInfo ? JSON.parse(persistedUserInfo) : null;

const initialState = {
  startTime: nextDayAtTen.format("YYYY-MM-DD HH:mm"),
  endTime: nextDayAtNoon.format("YYYY-MM-DD HH:mm"),
  equipments: [],
  priority: [
    {
      id: 1,
      item: "distance",
    },
    {
      id: 2,
      item: "seats",
    },
    {
      id: 3,
      item: "equipments",
    },
  ],
  roomCount: 1,
  groupedAttendees: [],
  ungroupedAttendees: [],
  loggedInUser: {
    group: null,
    selectedRoom: null,
  },
  searchOnce: false,
  loading: false,
  groupToDisplay: "Group1",
  searching: false,
  showRecommended: true,
  regroup: true,
  isMultiCity: false,
  suggestedTimeMode: true,
  suggestedTimeInput: {
    startTime: nextDayAtTen.format("YYYY-MM-DD HH:mm"),
    endTime: sevenDaysLaterAtTen.format("YYYY-MM-DD HH:mm"),
    duration: 1,
    unit: "hours",
  },
  suggestedTimeReceived: {},
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    addEquipment: (state, action) => {
      state.equipments = [...state.equipments, action.payload];
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
      const updatedGroupedAttendees = state.groupedAttendees.map((group) =>
        group.groupId === groupId ? { ...group, attendees: attendees } : group,
      );
      state.groupedAttendees = updatedGroupedAttendees;
    },
    initializeGroupedAttendees: (state, action) => {
      state.groupedAttendees = action.payload;
    },
    setSelectedRoomForGroup: (state, action) => {
      const { groupId, room } = action.payload;
      const group = state.groupedAttendees.find((g) => g.groupId === groupId);
      if (group) {
        group.selectedRoom = room;

        // check if the group being updated is the same as the loggedInUser's group
        if (state.loggedInUser.group === groupId) {
          // update the loggedInUser's selectedRoom with the new room details
          state.loggedInUser.selectedRoom = room;
        }
      }
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
    setGroupToDisplay: (state, action) => {
      state.groupToDisplay = action.payload;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    startSearch: (state) => {
      state.searching = true;
    },
    stopSearch: (state) => {
      state.searching = false;
    },
    toggleShowRecommended: (state) => {
      state.showRecommended = !state.showRecommended;
    },
    setRegroup: (state, action) => {
      state.regroup = action.payload;
    },
    setIsMultiCity: (state, action) => {
      state.isMultiCity = action.payload;
    },
    setSuggestedTimeMode: (state, action) => {
      state.suggestedTimeMode = action.payload;
      if (action.payload) {
        // reset suggestedTimeInput when switching to suggestedTimeMode
        state.suggestedTimeInput = {
          startTime: nextDayAtTen.format("YYYY-MM-DD HH:mm"),
          endTime: sevenDaysLaterAtTen.format("YYYY-MM-DD HH:mm"),
          duration: 1,
          unit: "hours",
        };
      }
    },
    setSuggestedTimeInput: (state, action) => {
      state.suggestedTimeInput = action.payload;
    },
    setSuggestedTimeReceived: (state, action) => {
      state.suggestedTimeReceived = action.payload;
    },
    resetBooking: (state) => (state = initialState),
  },
});

export const {
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
  resetBooking,
  startLoading,
  stopLoading,
  setSelectedRoomForGroup,
  setGroupToDisplay,
  startSearch,
  stopSearch,
  toggleShowRecommended,
  setRegroup,
  setIsMultiCity,
  setSuggestedTimeMode,
  setSuggestedTimeInput,
  setSuggestedTimeReceived,
} = bookingSlice.actions;

export default bookingSlice.reducer;

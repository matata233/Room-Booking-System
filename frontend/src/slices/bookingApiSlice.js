import { BOOKING_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableRooms: builder.mutation({
      query: (bookingData) => ({
        url: `${BOOKING_URL}/available-room`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
    confirmBooking: builder.mutation({
      query: (bookingData) => ({
        url: `${BOOKING_URL}/create`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useGetAvailableRoomsMutation, useConfirmBookingMutation } =
  bookingApiSlice;

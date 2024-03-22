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
      providesTags: ["Booking"],
    }),

    confirmBooking: builder.mutation({
      query: (bookingData) => ({
        url: `${BOOKING_URL}/create`,
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),

    getBooking: builder.query({
      query: () => ({
        url: BOOKING_URL,
      }),
      providesTags: ["Booking"],
      keepUnusedDataFor: 5,
    }),

    getBookingCurrentUser: builder.query({
      query: () => ({
        url: `${BOOKING_URL}/currentUser`,
      }),
      providesTags: ["Booking"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetAvailableRoomsMutation,
  useConfirmBookingMutation,
  useGetBookingCurrentUserQuery,
  useGetBookingQuery,
} = bookingApiSlice;

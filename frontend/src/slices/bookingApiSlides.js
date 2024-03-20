import { BOOKING_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetBookingQuery, useGetBookingCurrentUserQuery } = bookingApiSlice;

import { ROOMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => ({
        url: ROOMS_URL,
      }),
      providesTags: ["Room"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRoomsQuery } = roomsApiSlice;

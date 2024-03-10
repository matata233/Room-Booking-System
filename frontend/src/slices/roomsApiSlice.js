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

    createRoom: builder.mutation({
      query: (newRoom) => ({
        url: `${ROOMS_URL}/create`,
        method: "POST",
        body: newRoom,
      }),
      invalidatesTags: ["Room"],
    }),
  }),
});

export const { useGetRoomsQuery, useCreateRoomMutation } = roomsApiSlice;

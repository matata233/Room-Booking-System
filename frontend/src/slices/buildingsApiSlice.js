import { BUILDINGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const buildingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBuildings: builder.query({
      query: () => ({
        url: BUILDINGS_URL,
      }),
      providesTags: ["Building"],
      keepUnusedDataFor: 5,
    }),

    createBuilding: builder.mutation({
      query: (building) => ({
        url: `${BUILDINGS_URL}/create`,
        method: "POST",
        body: building,
      }),
      invalidatesTags: ["Building"],
    }),
  }),
});

export const { useGetBuildingsQuery, useCreateBuildingMutation } =
  buildingsApiSlice;

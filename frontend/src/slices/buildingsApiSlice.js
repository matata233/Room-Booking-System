import { BUILDINGS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const buildingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBuildings: builder.query({
      query: () => ({
        url: BUILDINGS_URL,
      }),
      providesTags: ["BUILDING"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetBuildingsQuery } = buildingsApiSlice;

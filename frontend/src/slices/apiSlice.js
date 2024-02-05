// parent to other API slices (needed for api/backend request)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5000" });
export const apiSlice = createApi({
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});

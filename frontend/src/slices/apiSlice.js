// parent to other API slices (needed for api/backend request)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log("token", token);
    }

    return headers;
  },
});
export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["Room", "User"],
  endpoints: (builder) => ({}),
});

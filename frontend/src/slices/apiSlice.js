// parent to other API slices (needed for api/backend request)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;
    if (token) {
      if (Date.now() >= jwtDecode(token).exp * 1000) {
        localStorage.setItem("userInfo", null);
        toast.error(`Your token has expired, please login again.`);
        localStorage.clear();
        const event = new CustomEvent("token-expired");
        window.dispatchEvent(event);
      }
      headers.set("authorization", `Bearer ${token}`);
      console.log("token", token);
    }

    return headers;
  },
});
export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["Room", "User", "Event", "Booking"],
  endpoints: (builder) => ({}),
});

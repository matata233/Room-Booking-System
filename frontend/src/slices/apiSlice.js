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
        console.log("checking expiration", jwtDecode(token).exp);
        localStorage.setItem("userInfo", null);
        console.log("userInfo: ", localStorage.getItem("userInfo")?
            localStorage.getItem("userInfo"): "successfully set to null" );
        toast.error(
            `Your token has expired, please login again.`
        );
        const event = new CustomEvent('token-expired');
        console.log("new event");
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
  tagTypes: ["Room", "User", "Event","Booking"],
  endpoints: (builder) => ({}),
});

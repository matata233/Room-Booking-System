// set the user credentials to localstorage and remove them
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
    checkTokenExpiration: (state) => {
      const userInfo = state.userInfo;
      if (userInfo && userInfo.token) {
        const decodedToken = jwtDecode(userInfo.token);
        if (Date.now() >= decodedToken.exp * 1000) {
          toast.error(
              `Your token has expired, please login again.`
          );
          state.userInfo = null; // Clear user info if token expired
        }
      }
    },
  },
});
export const { setCredentials, logout, checkTokenExpiration } = authSlice.actions;

export default authSlice.reducer;

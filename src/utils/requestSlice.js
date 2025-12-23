import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequests: (state, action) => {
      return [];
    },
    removeRequest: (state, action) => {
      return state.filter((request) => request._id !== action.payload);
    },
  },
});

export const { addRequests, removeRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;


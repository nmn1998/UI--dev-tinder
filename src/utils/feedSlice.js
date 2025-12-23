import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feeds",
  initialState: [],
  reducers: {
    addFeeds: (state, action) => {
      return action.payload;
    },
    removeFeeds: (state, action) => {
      return [];
    },
    removeFeed: (state, action) => {
      return state.filter((feed) => feed._id !== action.payload);
    },
  },
});

export const { addFeeds, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;

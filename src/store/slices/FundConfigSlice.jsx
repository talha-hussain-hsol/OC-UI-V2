import { createSlice } from "@reduxjs/toolkit";

const fundConfigSlice = createSlice({
  name: "fundConfig",
  initialState: [],
  reducers: {
    addFundConfig(state, action) {
      return action.payload;
    },
  },
});

export default fundConfigSlice.reducer;
export const { addFundConfig } = fundConfigSlice.actions;

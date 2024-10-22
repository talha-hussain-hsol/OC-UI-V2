import { createSlice } from "@reduxjs/toolkit";

const identityDetailSlice = createSlice({
  name: "identityDetail",
  initialState: [],
  reducers: {
    addIdentityDetail(state, action) {
      return action.payload;
    },
  },
});

export default identityDetailSlice.reducer;
export const { addIdentityDetail } = identityDetailSlice.actions;

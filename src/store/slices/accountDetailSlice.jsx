import { createSlice } from "@reduxjs/toolkit";

const accountDetailSlice = createSlice({
  name: "accountDetail",
  initialState: [],
  reducers: {
    addAccountDetail(state, action) {
      return action.payload;
    },
  },
});

export default accountDetailSlice.reducer;
export const { addAccountDetail } = accountDetailSlice.actions;

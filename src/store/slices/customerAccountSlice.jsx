import { createSlice } from "@reduxjs/toolkit";

const customerAccountSlice = createSlice({
  name: "customerAccount",
  initialState: [],
  reducers: {
    setCustomerAccounts(state, action) {
      return action.payload;
    },
  },
});

export default customerAccountSlice.reducer;
export const { setCustomerAccounts } = customerAccountSlice.actions;

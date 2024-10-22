import { createSlice } from "@reduxjs/toolkit";

const permissionSlice = createSlice({
  name: "permissions",
  initialState: [],
  reducers: {
    addPermissions(state, action) {
      return action.payload;
    },
    addEntityPermissions(state, action) {
      return action.payload;
    },
  },
});

export default permissionSlice.reducer;
export const { addPermissions, addEntityPermissions } = permissionSlice.actions;

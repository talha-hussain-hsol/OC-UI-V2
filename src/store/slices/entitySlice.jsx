import { createSlice } from "@reduxjs/toolkit";

const entityIdSlice = createSlice({
  name: "entityID",
  initialState: {},
  reducers: {
    setEntityId(state, action) {
      state.value = action.payload;
    },
  },
});
const entityLogoSlice = createSlice({
  name: "entityLogo",
  initialState: {},
  reducers: {
    setEntityLogo(state, action) {
      state.value = action.payload;
    },
  },
});
const entityProfileImageSlice = createSlice({
  name: "entityProfileImage",
  initialState: {},
  reducers: {
    setEntityProfileImage(state, action) {
      state.value = action.payload;
    },
  },
});
export { entityIdSlice, entityLogoSlice, entityProfileImageSlice };
export const { setEntityId } = entityIdSlice.actions;
export const { setEntityLogo } = entityLogoSlice.actions;
export const { setEntityProfileImage } = entityProfileImageSlice.actions;

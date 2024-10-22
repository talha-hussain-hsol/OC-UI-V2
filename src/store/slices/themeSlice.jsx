import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    initialState: [],
    reducers: {
        addTheme(state, action) {
            state.value = action.payload
        },
    }
})

export default themeSlice.reducer;
export const { addTheme } = themeSlice.actions
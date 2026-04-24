import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loading:false
};
const uiSlice = createSlice({
    name:"ui",
    initialState,
    reducers:{
        startLoading:(state) => {
            state.loading = true;
        },
        stopLoading:(state) => {
            state.loading = false;
        }
    }
});
export const {
    startLoading,
    stopLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
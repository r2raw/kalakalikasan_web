import { createSlice } from "@reduxjs/toolkit";


const initialState = {title: 'Dashboard'};
const currentRouteSlice = createSlice({
    name: 'current-route',   
    initialState,
    reducers: {
        selectedRoute(state, action){
            state.title = action.payload;
        },
    }
});

export const currentRouteActions = currentRouteSlice.actions;

export default currentRouteSlice.reducer;

// not used yet
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    errorMessage: null,
    successMessage: null,
}

const uiSlice = createSlice({
    name: 'ui', initialState,
    reducers: {
        handleErrorMessage(state, action){
            state.errorMessage =  action.payload
        },handleSuccessMessage(state, action){
            state.successMessage = action.payload
        }
    }

})


export const uiActions = uiSlice.actions;
export default uiSlice.reducer;

// not used yet
import { createSlice } from '@reduxjs/toolkit'
const initialState = { isAuthenticated: false };

const authSlice = createSlice({
    name: 'auth', initialState,
    reducers: {
        login(state) { state.isAuthenticated = true },
        logout(state) {
            localStorage.removeItem('id');
        }
    }

})


export const authActions = authSlice.actions;
export default authSlice.reducer;
import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    username: '',
    birthdate: '',
    mobile_num: '',
    email: '',
    street: '',

}

const currentUserSlice = createSlice({
    name: 'currentUser', initialState,
    reducers: {
        usersData(state, action) {
            return { ...state, ...action.payload };
        },
    }

})


export const currentUserActions = currentUserSlice.actions;
export default currentUserSlice.reducer;

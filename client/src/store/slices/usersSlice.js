import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    isDeleting: null,
    isEditing: null,
    isRestoring: null,
    formData: {
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
}

const usersSlice = createSlice({
    name: 'users', initialState,
    reducers: {
        usersData(state, action) {
            state.users = action.payload
        },
        handleEdit(state, action) {
            state.isEditing = action.payload
        },
        handleDelete(state, action) {
            state.isDeleting = action.payload
        },
        handleRestore(state, action) {
            state.isRestoring = action.payload
        }, handleFormData(state, action) {
            state.formData = {
                ...state.formData,
                ...action.payload
            }
                ;
        }
    }

})


export const usersAction = usersSlice.actions;
export default usersSlice.reducer;

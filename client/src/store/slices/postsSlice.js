import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    title: '',
    description: '',
    medias: [],
};

const postsSlice = createSlice({
    name: 'auth', initialState,
    reducers: {
        addPostChange(state, action) {
            state.title = action.payload.title;
            state.description = action.payload.description;
        }, addMedias(state, action) {
            state.medias = [action.payload, ...state.medias]
        }, removeMedia(state, action) {
            const newMedias = state.medias.filter((image) => image.id !== action.payload)
            state.medias = newMedias
        }
    }

})


export const postsActions = postsSlice.actions;
export default postsSlice.reducer;
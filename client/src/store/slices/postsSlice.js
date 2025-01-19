import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    dbContent: {}
};

const postsSlice = createSlice({
    name: 'auth', initialState,
    reducers: {
        loadDb: (state, action)=>{
            state.dbContent = action.payload;
        }
    }

})


export const postsActions = postsSlice.actions;
export default postsSlice.reducer;

// not used yet
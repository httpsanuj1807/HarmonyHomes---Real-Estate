import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error : null,
    loading : false,
}


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        userTypingAgain : (state) => {
            state.error = null;
        },
        signInStart : (state) =>{
            state.loading = true;
        },
        signInSuccess : (state, action) => {
            state.loading = false,
            state.currentUser = action.payload,
            state.error = null
        },
        signInFailure : (state, action) => {
            state.loading = false,
            state.error = action.payload
        }
    }
});

export const {userTypingAgain, signInStart, signInSuccess, signInFailure}  = userSlice.actions;

export default userSlice.reducer;



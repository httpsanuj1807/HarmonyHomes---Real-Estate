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
        signInStart : (state) =>{
            state.loading = true
        },
        signInSuccess : (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        signInFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateProfileStart : (state) =>{
            state.loading = true
        },
        updateProfileSuccess : (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        updateProfileFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteUserStart : (state) =>{
            state.loading = true
        },
        deleteUserSuccess : (state, action) => {
            state.loading = false
            state.currentUser = ''
            state.error = null
        },
        deleteUserFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        signOutStart : (state) =>{
            state.loading = true
        },
        signOutSuccess : (state, action) => {
            state.loading = false
            state.currentUser = ''
            state.error = null
        },
        signOutFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        
    }
});

export const {signInStart, signInSuccess, signInFailure, updateProfileStart, updateProfileSuccess, updateProfileFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure}  = userSlice.actions;

export default userSlice.reducer;



import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import currRouteReducer from './slices/currentRouteSlice'
import postsReducer from './slices/postsSlice';
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice';
import currentUserReducer from './slices/currentUserSlice'

export default configureStore({ reducer: { auth: authReducer, currRoute: currRouteReducer, posts: postsReducer, users: usersReducer, ui: uiReducer, currentUser: currentUserReducer } });
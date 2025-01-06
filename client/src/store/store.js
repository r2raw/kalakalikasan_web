import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import currRouteReducer from './slices/currentRouteSlice'
import postsReducer from './slices/postsSlice';

export default configureStore({ reducer: { auth: authReducer, currRoute: currRouteReducer, posts: postsReducer } });
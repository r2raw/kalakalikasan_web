import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import currRouteReducer from './slices/currentRouteSlice'

export default configureStore({ reducer: { auth: authReducer, currRoute: currRouteReducer } });
import { UserReducer, ThemeReducer } from "./reducer";
import { combineReducers, configureStore } from '@reduxjs/toolkit'


let reducers = combineReducers({
    "userReducer": UserReducer,
    "themeReducer": ThemeReducer
});

let store = configureStore({reducer: reducers});

export default store;
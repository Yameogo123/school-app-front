import { UserReducer, ThemeReducer, ParamReducer } from "./reducer";
import { combineReducers, configureStore } from '@reduxjs/toolkit'


let reducers = combineReducers({
    "userReducer": UserReducer,
    "themeReducer": ThemeReducer,
    "paramReducer": ParamReducer,
});

let store = configureStore({reducer: reducers});

export default store;
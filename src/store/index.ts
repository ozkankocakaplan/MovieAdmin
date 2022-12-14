import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import episodeReducers from "./features/episodeReducers";
import mainReducers from "./features/mainReducers";
import seasonReducers from "./features/seasonReducers";


const rootReducers = combineReducers({
    episodeReducers,
    seasonReducers,
    mainReducers
});
const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})
export const setupStore = () => {
    return configureStore({
        reducer: rootReducers,
        middleware: (getDefaultMiddleware) => customizedMiddleware,
    })
};

export const store = setupStore();
export type RootState = ReturnType<typeof store.getState>
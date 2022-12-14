import { createSlice } from "@reduxjs/toolkit";
import { AnimeSeason } from "../../types/Entites";

const INITIAL_STATE = {
    animeSeasons: [] as Array<AnimeSeason>
};
const seasonSlice = createSlice({
    name: 'seasonSlice',
    initialState: INITIAL_STATE,
    reducers: {
        setAnimeSeasons: (state, action) => {
            state.animeSeasons = action.payload;
        },
        setAnimeSeason: (state, action) => {
            state.animeSeasons = [...state.animeSeasons, action.payload];
        },
        deleteAnimeSeason: (state, action) => {
            state.animeSeasons = state.animeSeasons.filter((y) => y.id !== action.payload.id);
        }
    },
});
const animeReducers = seasonSlice.reducer;
export default animeReducers;
export const {
    setAnimeSeasons,
    setAnimeSeason,
    deleteAnimeSeason
} = seasonSlice.actions;
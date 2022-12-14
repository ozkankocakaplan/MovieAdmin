import { createSlice } from "@reduxjs/toolkit"
import { AnimeEpisodes } from "../../types/Entites";

const INITIAL_STATE = {
    animeEpisodes: [] as Array<AnimeEpisodes>
}
const episodeSlice = createSlice({
    name: 'episodeSlice',
    initialState: INITIAL_STATE,
    reducers: {
        setAnimeEpisodes: (state, action) => {
            state.animeEpisodes = action.payload;
        },
        setAnimeEpisode: (state, action) => {
            state.animeEpisodes = [...state.animeEpisodes, action.payload]
        },
        setAnimeEpisodeByID: (state, action) => {
            state.animeEpisodes = state.animeEpisodes.map((item) => item.id === action.payload.id ? action.payload : item)
        }
    }
});
const episodeReducers = episodeSlice.reducer;
export default episodeReducers;
export const {
    setAnimeEpisodes,
    setAnimeEpisode,
    setAnimeEpisodeByID
} = episodeSlice.actions;
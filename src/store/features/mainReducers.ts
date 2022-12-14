import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    animeFiles: [],
    uploadImages: []
};
const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: INITIAL_STATE,
    reducers: {
        setAnimeFiles: (state, action) => {
            state.animeFiles = action.payload;
        },
        setAnimeFile: (state, action) => {
            state.animeFiles = [...state.animeFiles, action.payload] as any;
        },
        deleteAnimeFile: (state, action) => {
            state.animeFiles = state.animeFiles.filter((item: any) => item.key !== action.payload) as any;
        },
        setUploadImages: (state, action) => {
            state.uploadImages = action.payload;
        },
        setUploadImage: (state, action) => {
            state.uploadImages = [...state.uploadImages, action.payload] as any;
        },
        deleteUploadImage: (state, action) => {
            state.uploadImages = state.uploadImages.filter((y: any) => y.id !== action.payload);
        }
    }
});
const mainReducers = mainSlice.reducer;
export default mainReducers;
export const {
    setAnimeFiles,
    setAnimeFile,
    deleteAnimeFile,
    setUploadImages,
    setUploadImage,
    deleteUploadImage
} = mainSlice.actions;
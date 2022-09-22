

import axios from "axios"
import { Anime, AnimeEpisodes, AnimeSeason, Categories, UserModel, Users } from "../types/Entites";
import ServiceResponse from "../types/ServiceResponse";
export const baseUrl = "http://192.168.2.175:37323";
export default function api() {
    const userLocal = localStorage.getItem('user');
    var user: UserModel = {} as UserModel;
    if (userLocal) {
        user = JSON.parse(userLocal);
    }
    return axios.create({
        baseURL: baseUrl,
        headers: {
            'Authorization': user != null ? 'bearer ' + user.token : "",
            'content-type': 'application/json'
        }
    })
}



export const postLogin = async (userName?: string, password?: string) => {
    return await api().post<ServiceResponse<UserModel>>("/login/" + userName + "/" + password);
}


//Anime
export const getPaginatedAnime = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Anime>>("/getPaginatedAnime/" + pageNo + "/" + showCount);
}
//Anime Season
export const getAnimeSeasonsByAnimeID = async (animeID: number) => {
    return await api().get<ServiceResponse<AnimeSeason>>("/getAnimeSeasonsByAnimeID/" + animeID);
}
//Anime Season Episodes
export const getAnimeEpisodesBySeasonID = async (seasonID: number) => {
    return await api().get<ServiceResponse<AnimeEpisodes>>("/getAnimeEpisodesBySeasonID/" + seasonID);
}

//User
export const getPaginatedUsers = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Users>>("/getPaginatedUsers/" + pageNo + "/" + showCount);
}



//Category
export const postCategory = async (data: Categories) => {
    return await api().post<ServiceResponse<Categories>>("/addCategory", data);
}
export const putCategory = async (data: Categories) => {
    return await api().put<ServiceResponse<Categories>>("/updateCategory", data);
}
export const getCategories = async () => {
    return await api().get<ServiceResponse<Categories>>("/getCategories");
}
export const getCategory = async (categoryID: number) => {
    return await api().get<ServiceResponse<Categories>>("/getCategory/" + categoryID);
}
export const deleteCategories = async (categories: Array<number>) => {
    return await api().delete<ServiceResponse<Categories>>("/deleteCategories", {
        data: categories
    });
}
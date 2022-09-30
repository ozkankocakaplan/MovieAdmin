

import axios from "axios"
import {
    Anime, AnimeEpisodes, AnimeSeason, AnimeSeasonMusic, Categories, CategoryType,
    Episodes, Manga, MangaEpisodeContent, MangaEpisodes, ReportModels, RoleType, Rosette, RosetteContent,
    RosetteModels,
    SocialMediaAccount, Type, UserModel, Users
} from "../types/Entites";
import { AnimeForm } from "../types/EntitesForm";
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
        }
    })
}


// User
export const postLogin = async (userName?: string, password?: string) => {
    return await api().post<ServiceResponse<UserModel>>("/login/" + userName + "/" + password);
}
export const getMe = async () => {
    return await api().get<ServiceResponse<Users>>("/getMe");
}
export const putPassword = async (currentPassword: string, newPassword: string) => {
    return await api().put<ServiceResponse<Users>>("/updatePassword/" + currentPassword + "/" + newPassword, null, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const putUserInfo = async (nameSurname: string, userName: string) => {
    return await api().put("/updateUserInfo/" + nameSurname + "/" + userName);
}
export const putEmail = async (email: string, code: string) => {
    return await api().put("/updateEmailChange/" + email + "/" + code);
}
export const getUserByID = async (userID: number) => {
    return await api().get<ServiceResponse<UserModel>>("/getUserByID/" + userID);
}
export const putIsBanned = async (userID: number) => {
    return await api().put<ServiceResponse<Users>>("/updateIsBanned/" + userID);
}
export const putRole = async (role: RoleType) => {
    return await api().put<ServiceResponse<Users>>("/updateRole/" + role);
}
//Anime
export const getPaginatedAnime = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Anime>>("/getPaginatedAnime/" + pageNo + "/" + showCount);
}
export const postAnime = async (anime: AnimeForm) => {
    var form = new FormData();
    return await api().post<ServiceResponse<Anime>>("/addAnime?AnimeName=" + anime.animeName + "&AnimeDescription=" + anime.animeDescription + "&MalRating=" + anime.malRating + "&AgeLimit=" + anime.ageLimit + "&SeasonCount=" + anime.seasonCount + "&ShowTime=" + anime.showTime + "&Status=" + anime.status + "&VideoType=" + anime.videoType + "&Arrangement=" + anime.arrangement,
        form,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
}
export const putAnime = async (anime: Anime) => {
    var form = new FormData();
    return await api().put<ServiceResponse<Anime>>("/updateAnime?ID=" + anime.id + "&AnimeName=" + anime.animeName + "&AnimeDescription=" + anime.animeDescription + "&MalRating=" + anime.malRating + "&AgeLimit=" + anime.ageLimit + "&SeasonCount=" + anime.seasonCount + "&ShowTime=" + anime.showTime + "&Status=" + anime.status + "&VideoType=" + anime.videoType + "&Arrangement=" + anime.arrangement,
        form,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
}
export const getAnimeByID = async (animeID: number) => {
    return await api().get<ServiceResponse<Anime>>("/getAnimeByID/" + animeID);
}
export const deleteAnime = async (animeID: number) => {
    return await api().delete("/deleteAnime/" + animeID);
}
export const deleteAnimes = async (animes: Array<number>) => {
    return await api().delete("/deleteAnimes", {
        data: animes
    });
}
export const getAnimes = async () => {
    return await api().get<ServiceResponse<Anime>>("/getAnimes");
}
//Anime Season
export const getAnimeSeasonsByAnimeID = async (animeID: number) => {
    return await api().get<ServiceResponse<AnimeSeason>>("/getAnimeSeasonsByAnimeID/" + animeID);
}
export const getAnimeSeason = async (id: number) => {
    return await api().get<ServiceResponse<AnimeSeason>>("/getAnimeSeason/" + id);
}
export const postAnimeSeason = async (season: AnimeSeason) => {
    return await api().post<ServiceResponse<AnimeSeason>>("/addAnimeSeason", season, {
        headers: {
            'content-type': 'application/json'
        }
    })
}
export const putAnimeSeason = async (season: AnimeSeason) => {
    return await api().put<ServiceResponse<AnimeSeason>>("/updateAnimeSeason", season, {
        headers: {
            'content-type': 'application/json'
        }
    })
}
export const deleteAnimeSeason = async (seasonID: number) => {
    return await api().delete("/deleteAnimeSeasons/" + seasonID);
}
//Anime Season Music
export const postAnimeSeasonMusic = async (seasonMusic: AnimeSeasonMusic) => {
    return await api().post<ServiceResponse<AnimeSeasonMusic>>("/addAnimeSeasonMusic", seasonMusic, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const putAnimeSeasonMusic = async (seasonMusic: AnimeSeasonMusic) => {
    return await api().put<ServiceResponse<AnimeSeasonMusic>>("/updateAnimeSeasonMusic", seasonMusic, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const getAnimeSeasonMusics = async (seasonID: number) => {
    return await api().get<ServiceResponse<AnimeSeasonMusic>>("/getAnimeSeasonMusics/" + seasonID);
}
export const getAnimeSeasonMusic = async (id: number) => {
    return await api().get<ServiceResponse<AnimeSeasonMusic>>("/getAnimeSeasonMusic/" + id);
}
export const deleteAnimeSeasonMusic = async (seasonMusics: Array<number>) => {
    return await api().delete("/deleteAnimeSeasonMusic", {
        data: seasonMusics
    });
}
//Anime Season Episodes
export const getAnimeEpisodesBySeasonID = async (seasonID: number) => {
    return await api().get<ServiceResponse<AnimeEpisodes>>("/getAnimeEpisodesBySeasonID/" + seasonID);
}
export const postAnimeEpisode = async (anime: AnimeEpisodes) => {
    return await api().post<ServiceResponse<AnimeEpisodes>>("/addAnimeEpisodes", anime, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const putAnimeEpisode = async (anime: AnimeEpisodes) => {
    return await api().put<ServiceResponse<AnimeEpisodes>>("/updateAnimeEpisodes", anime, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const getAnimeEpisodesByID = async (id: number) => {
    return await api().get<ServiceResponse<AnimeEpisodes>>("/getAnimeEpisodesByID/" + id);
}
export const deleteAnimeEpisode = async (animeEpisodes: Array<number>) => {
    return await api().delete("/deleteAnimeEpisode", {
        data: animeEpisodes
    });
}
export const getAnimeEpisodes = async () => {
    return await api().get<ServiceResponse<AnimeEpisodes>>("/getAnimeEpisodes");
}
//Anime Episodes
export const postAnimeEpisodeContent = async (content: Episodes) => {
    return await api().post<ServiceResponse<Episodes>>("/addEpisodes", content, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const putAnimeEpisodeContent = async (content: Episodes) => {
    return await api().put<ServiceResponse<Episodes>>("/updateEpisode", content, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const getAnimeEpisodeContentByEpisodeID = async (episodeID: number) => {
    return await api().get<ServiceResponse<Episodes>>("/getEpisodeByEpisodeID/" + episodeID);
}
export const getAnimeEpisodeContent = async (id: number) => {
    return await api().get<ServiceResponse<Episodes>>("/getEpisodeByID/" + id);
}
export const deleteEpisode = async (episodes: Array<number>) => {
    return await api().delete("/deleteEpisodes", {
        data: episodes
    });
}
//User
export const getPaginatedUsers = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Users>>("/getPaginatedUsers/" + pageNo + "/" + showCount);
}



//Category
export const postCategory = async (data: Categories) => {
    return await api().post<ServiceResponse<Categories>>("/addCategory", data, {
        headers: {
            'content-type': 'application/json'
        }
    });
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

//Category Type
export const postCategoryType = async (categoryType: Array<CategoryType>) => {
    return await api().post<ServiceResponse<CategoryType>>("/addCategoryType", categoryType, {
        headers: {
            'content-type': 'application/json'
        }
    })
}
export const getCategoryTypes = async (contentID: number, type: Type) => {
    return await api().get<ServiceResponse<CategoryType>>("/getCategoryType/" + contentID + "/" + type);
}

//Manga
export const postManga = async (manga: Manga) => {
    var form = new FormData();
    return await api().post<ServiceResponse<Manga>>("/addManga?Name=" + manga.name + "&Description=" + manga.description + "&Arrangement=" + manga.description + "&AgeLimit=" + manga.ageLimit + "&Status=" + manga.status, form, { headers: { 'content-type': 'multipart/form-data' } });
}
export const putManga = async (manga: Manga) => {
    var form = new FormData();
    return await api().put<ServiceResponse<Manga>>("/updateManga?ID=" + manga.id + "&Name=" + manga.name + "&Description=" + manga.description + "&Arrangement=" + manga.description + "&AgeLimit=" + manga.ageLimit + "&Status=" + manga.status, form, { headers: { 'content-type': 'multipart/form-data' } });
}
export const getPaginatedManga = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Manga>>("/getPaginatedManga/" + pageNo + "/" + showCount);
}
export const getMangaByID = async (id: number) => {
    return await api().get<ServiceResponse<Manga>>("/getMangaByID/" + id);
}
export const deleteManga = async (mangaID: number) => {
    return await api().delete("/deleteManga/" + mangaID);
}
export const deleteMangas = async (mangas: Array<number>) => {
    return await api().delete("/deleteMangas", {
        data: mangas
    });
}
export const getMangas = async () => {
    return await api().get<ServiceResponse<Manga>>("/getMangas");
}
//Manga Episodes
export const postMangaEpisodes = async (episode: MangaEpisodes) => {
    return await api().post<ServiceResponse<MangaEpisodes>>("/addMangaEpisodes", episode, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const putMangaEpisodes = async (episode: MangaEpisodes) => {
    return await api().put<ServiceResponse<MangaEpisodes>>("/updateMangaEpisodes", episode, {
        headers: {
            'content-type': 'application/json'
        }
    });
}
export const getMangaEpisodes = async (mangaID: number) => {
    return await api().get<ServiceResponse<MangaEpisodes>>("/getMangaEpisodesByMangaID/" + mangaID);
}
export const getMangaEpisode = async (id: number) => {
    return await api().get<ServiceResponse<MangaEpisodes>>("/getMangaEpisode/" + id);
}
export const getFullMangaEpisodes = async () => {
    return await api().get<ServiceResponse<MangaEpisodes>>("/getMangaEpisodes");
}
export const deleteMangaEpisode = async (episodeID: number) => {
    return await api().delete("/deleteMangaEpisode/" + episodeID);
}
export const deleteMangaEpisodes = async (episodes: Array<number>) => {
    return await api().delete("/deleteMangaEpisodes", {
        data: episodes
    });
}
//Manga Episode Content
export const postMangaContentEpisode = async (episodeContent: MangaEpisodeContent) => {
    var form = new FormData();
    return await api().post<ServiceResponse<MangaEpisodeContent>>("/addMangaEpisodeContent?EpisodeID=" + episodeContent.episodeID + "&Description=" + episodeContent.description + "&ContentOrder=" + episodeContent.contentOrder,
        form,
        {
            headers: {
                'content-type': 'application/json'
            }
        });
}
export const putMangaContentEpisode = async (episodeContent: MangaEpisodeContent) => {
    var form = new FormData();
    return await api().put<ServiceResponse<MangaEpisodeContent>>("/updateMangaEpisodeContent?ID=" + episodeContent.id + "&EpisodeID=" + episodeContent.episodeID + "&Description=" + episodeContent.description + "&ContentOrder=" + episodeContent.contentOrder,
        form,
        {
            headers: {
                'content-type': 'application/json'
            }
        });
}
export const getMangaEpisodeContents = async (episodeID: number) => {
    return await api().get<ServiceResponse<MangaEpisodeContent>>("/getMangaEpisodeContents/" + episodeID);
}
export const getMangaEpisodeContent = async (id: number) => {
    return await api().get<ServiceResponse<MangaEpisodeContent>>("/getMangaEpisodeContent/" + id);
}
export const deleteMangaEpisodeContent = async (episodeID: number) => {
    return await api().delete<ServiceResponse<number>>("/deleteMangaEpisodeContent/" + episodeID);
}

//Social Media Account
export const getSocialMediaAccount = async () => {
    return await api().get<ServiceResponse<SocialMediaAccount>>("/getSocialMediaAccount");
}
export const putSocialMediaAccount = async (mediaAccount: SocialMediaAccount) => {
    return await api().put<ServiceResponse<SocialMediaAccount>>("/updateSocialMediaAccount", mediaAccount, { headers: { 'content-type': 'application/json' } });
}

//User Email Vertification
export const postUserEmailVertification = async (email: string) => {
    return await api().post<ServiceResponse<SocialMediaAccount>>("/againUserEmailVertification/" + email);
}

//Rosette 
export const postRosette = async (rosette: Rosette) => {
    var form = new FormData();
    return await api().post<ServiceResponse<Rosette>>("/addRosette?Name=" + rosette.name, form, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
export const putRosette = async (rosette: Rosette) => {
    var form = new FormData();
    return await api().post<ServiceResponse<Rosette>>("/updateRosette?ID=" + rosette.id + "&Name=" + rosette.name, form, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
export const getRosettes = async () => {
    return await api().get<ServiceResponse<Rosette>>("/getRosettes");
}
export const getRosette = async (id: number) => {
    return await api().get<ServiceResponse<RosetteModels>>("/getRosette/" + id);
}
export const deleteRosettes = async (rosettes: Array<number>) => {
    return await api().delete("/deleteRosette", {
        data: rosettes
    });
}
export const putUpdateImage = async (id: number, form: FormData) => {

    return await api().put<ServiceResponse<Rosette>>("/updateRosetteImg/" + id, form, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
// Rosette Content
export const postRosetteContent = async (rosetteContents: Array<RosetteContent>) => {
    return await api().post<ServiceResponse<RosetteContent>>("/addRosetteContent", rosetteContents);
}
export const getRosetteContent = async (rosetteContent: number) => {
    return await api().get<ServiceResponse<RosetteContent>>("/getRosetteContent/" + rosetteContent);
}
export const putRosetteContent = async (rosetteContents: Array<RosetteContent>, rosetteID: number) => {
    return await api().put<ServiceResponse<RosetteContent>>("/updateRosetteContent/" + rosetteID, rosetteContents);
}

export const getDashboardReport = async () => {
    return await api().get<ServiceResponse<ReportModels>>("/getDashboardReport");
}
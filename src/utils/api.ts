

import axios from "axios"
import {
    Anime, AnimeEpisodes, AnimeImages, AnimeModels, AnimeSeason, AnimeSeasonMusic, Announcement, Categories, CategoryType,
    ComplaintContentModels,
    ComplaintList,
    ComplaintListModels,
    Contact,
    ContactSubject,
    Episodes, FanArt, FanArtModels, HomeSlider, Manga, MangaEpisodeContent, MangaEpisodes, MangaImages, MangaModels, MovieTheWeek, MovieTheWeekModels, Notification, ReportModels, Review, ReviewsModels, RoleType, Rosette, RosetteContent,
    RosetteModels,
    SiteDescription,
    SocialMediaAccount, Type, UserModel, Users
} from "../types/Entites";
import { AnimeForm } from "../types/EntitesForm";
import ServiceResponse from "../types/ServiceResponse";
// export const baseUrl = "https://api.lycorisa.com";
export const baseUrl = "http://192.168.1.107:37323";
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
export const getSearchDetailsUser = async (text: string) => {
    return await api().get<ServiceResponse<Users>>("/getSearchDetailsUser/" + text);
}
//Anime
export const getPaginatedAnime = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Anime>>("/getPaginatedAnime/" + pageNo + "/" + showCount);
}
export const postAnime = async (anime: AnimeForm) => {
    var form = new FormData();
    return await api().post<ServiceResponse<Anime>>("/addAnime?AnimeName=" + anime.animeName + "&AnimeDescription=" + anime.animeDescription + "&MalRating=" + anime.malRating + "&AgeLimit=" + anime.ageLimit + "&SeasonCount=" + anime.seasonCount + "&ShowTime=" + anime.showTime + "&Status=" + anime.status + "&VideoType=" + anime.videoType + "&Img=" + anime.img + "&fansub=" + anime.fansub,
        form,
        {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
}
export const putAnime = async (anime: Anime) => {
    var form = new FormData();
    return await api().put<ServiceResponse<Anime>>("/updateAnime?ID=" + anime.id + "&AnimeName=" + anime.animeName + "&AnimeDescription=" + anime.animeDescription + "&MalRating=" + anime.malRating + "&AgeLimit=" + anime.ageLimit + "&SeasonCount=" + anime.seasonCount + "&ShowTime=" + anime.showTime + "&Status=" + anime.status + "&VideoType=" + anime.videoType + "&Img=" + anime.img + "&fansub=" + anime.fansub,
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
    return await api().get<ServiceResponse<AnimeModels>>("/getAdminAnimes");
}
export const getSearchAnimes = async (text: string) => {
    return await api().get<ServiceResponse<Anime>>("/getSearchAnime/" + text);
}
export const putAnimeImage = async (formData: FormData, id: number) => {
    return await api().put("/updateAnimeImage/" + id, formData);
}
// Anime Images
export const postAnimeImages = async (formData: FormData, id: number) => {
    return await api().post<ServiceResponse<AnimeImages>>("/addAnimeImage/" + id, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
export const getAnimeImageList = async (animeID: number) => {
    return await api().get<ServiceResponse<AnimeImages>>("/getAnimeImageList/" + animeID);
}
export const deleteAnimeImage = async (id: number) => {
    return await api().delete<ServiceResponse<AnimeImages>>("/deleteAnimeImage/" + id);
}

//Manga Images
export const postMangaImages = async (formData: FormData, id: number) => {
    return await api().post("/addMangaImage/" + id, formData, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
export const getMangaImageList = async (animeID: number) => {
    return await api().get<ServiceResponse<MangaImages>>("/getMangaImageList/" + animeID);
}
export const deleteMangaImage = async (id: number) => {
    return await api().delete<ServiceResponse<MangaImages>>("/deleteMangaImage/" + id);
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
export const putCategoryType = async (categoryType: Array<CategoryType>) => {
    return await api().post<ServiceResponse<CategoryType>>("/updateCategoryType", categoryType, {
        headers: {
            'content-type': 'application/json'
        }
    })
}
//Manga
export const postManga = async (manga: Manga) => {
    return await api().post<ServiceResponse<Manga>>("/addManga?AnimeID=" + manga.animeID + "&Name=" + manga.name + "&Description=" + manga.description + "&SiteRating=" + manga.siteRating + "&AgeLimit=" + manga.ageLimit + "&Status=" + manga.status + "&MalRating=" + manga.malRating + "&Image=" + manga.image + "&fansub=" + manga.fansub, { headers: { 'content-type': 'multipart/form-data' } });
}
export const putManga = async (manga: Manga) => {
    return await api().put<ServiceResponse<Manga>>("/updateManga?AnimeID=" + manga.animeID + "&ID=" + manga.id + "&Name=" + manga.name + "&Description=" + manga.description + "&SiteRating=" + manga.siteRating + "&AgeLimit=" + manga.ageLimit + "&Status=" + manga.status + "&MalRating=" + manga.malRating + "&Image=" + manga.image + "&fansub=" + manga.fansub, { headers: { 'content-type': 'multipart/form-data' } });
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
    return await api().get<ServiceResponse<MangaModels>>("/getAdminMangas");
}
export const getSearchDetailsMangas = async (text: string) => {
    return await api().get<ServiceResponse<Manga>>("/getSearchDetailsMangas/" + text);
}
export const putMangaImage = async (formData: FormData, id: number) => {
    return await api().put("/updateMangaImage/" + id, formData);
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
    return await api().post<ServiceResponse<MangaEpisodeContent>>("/addMangaEpisodeContent?EpisodeID=" + episodeContent.episodeID + "&Description=" + episodeContent.description + "&ContentOrder=" + episodeContent.contentOrder + "&ContentImage=" + episodeContent.contentImage,
        {
            headers: {
                'content-type': 'application/json'
            }
        });
}
export const putMangaContentEpisode = async (episodeContent: MangaEpisodeContent) => {
    return await api().put<ServiceResponse<MangaEpisodeContent>>("/updateMangaEpisodeContent?ID=" + episodeContent.id + "&EpisodeID=" + episodeContent.episodeID + "&Description=" + episodeContent.description + "&ContentOrder=" + episodeContent.contentOrder + "&ContentImage=" + episodeContent.contentImage,
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
export const postRosette = async (rosette: Rosette, form: FormData) => {

    return await api().post<ServiceResponse<Rosette>>("/addRosette?Name=" + rosette.name, form, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    });
}
export const putRosette = async (rosette: Rosette) => {
    var form = new FormData();
    return await api().put<ServiceResponse<Rosette>>("/updateRosette?ID=" + rosette.id + "&Name=" + rosette.name, form, {
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
//Contact
export const getContacts = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<Contact>>("/getContacts/" + pageNo + "/" + showCount);
}
export const deleteContact = async (id: number) => {
    return await api().delete<ServiceResponse<Contact>>("/deleteContact/" + id);
}

//Contact Subject
export const postContactSubject = async (entity: ContactSubject) => {
    return await api().post<ServiceResponse<ContactSubject>>("/addContactSubject", entity);
}
export const putContactSubject = async (entity: ContactSubject) => {
    return await api().put<ServiceResponse<ContactSubject>>("/updateContactSubject", entity);
}
export const getContactSubjects = async () => {
    return await api().get<ServiceResponse<ContactSubject>>("/getContactSubjects");
}
export const deleteContactSubject = async (id: number) => {
    return await api().delete<ServiceResponse<ContactSubject>>("/deleteContactSubject/" + id);
}

//Home Slider
export const getHomeSliders = async () => {
    return await api().get<ServiceResponse<HomeSlider>>("/getHomeSliders");
}
export const getHomeSlider = async (id: number) => {
    return await api().get<ServiceResponse<HomeSlider>>("/getHomeSlider/" + id);
}
export const postHomeSlider = async (form: FormData) => {
    return await api().post<ServiceResponse<HomeSlider>>("/addHomeSlider", form);
}
export const putHomeSlider = async (form: FormData) => {
    return await api().put<ServiceResponse<HomeSlider>>("/updateHomeSlider", form);
}
export const deleteHomeSlider = async (id: number) => {
    return await api().delete("/deleteHomeSlider/" + id);
}
// Site Description and Announcments
export const getAnnouncements = async () => {
    return await api().get<ServiceResponse<Announcement>>("/getAnnouncements");
}
export const putAnnouncement = async (entity: Announcement) => {
    return await api().put<ServiceResponse<Announcement>>("/updateAnnouncement", entity);
}
export const getSiteDescriptions = async () => {
    return await api().get<ServiceResponse<SiteDescription>>("/getSiteDescriptions");
}
export const putSiteDescription = async (entity: SiteDescription) => {
    return await api().put<ServiceResponse<SiteDescription>>("/updateSiteDescription", entity);
}

//Fan art
export const postFanArt = async (entity: FanArt, formData: FormData) => {
    return await api().post("/addFanArt?UserID=" + entity.userID + "&ContentID=" + entity.contentID + "&Description=" + entity.description + "&Type=" + entity.type + "&Image=" + entity.image, formData, {
        headers: {
            'content-type': 'multiform/form-data'
        }
    });
}
export const getPaginatedFanArtNoType = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<FanArtModels>>("/getPaginatedFanArtNoType/" + pageNo + "/" + showCount)
}
export const deleteFanArt = async (id: number) => {
    return await api().delete<ServiceResponse<FanArt>>("/deleteFanArt/" + id);
}

//Complaint List
export const getComplaints = async () => {
    return await api().get<ServiceResponse<ComplaintListModels>>("/getComplaints");
}
export const deleteComplaints = async (list: Array<number>) => {
    return await api().delete<ServiceResponse<ComplaintList>>("/deleteComplaint", {
        data: list
    });
}

//Notification 
export const addNotification = async (entity: Notification) => {
    return await api().post<ServiceResponse<Notification>>("/addNotification", entity);
}

export const getMovieTheWeeks = async () => {
    return await api().get<ServiceResponse<MovieTheWeekModels>>("/getMovieTheWeeks");
}
export const addMovieTheWeeks = async (lists: Array<MovieTheWeek>) => {
    return await api().post<ServiceResponse<MovieTheWeekModels>>("/addMovieTheWeek", lists);
}
export const deleteMovieTheWeeks = async (lists: Array<Number>) => {
    return await api().delete("/deleteMovieTheWeek", {
        data: lists
    });
}
export const getContentComplaint = async () => {
    return await api().get<ServiceResponse<ComplaintContentModels>>("/getContentComplaint");
}
export const addAutoEpisode = async (start: number, end: number, animeID: number, seasonID: number) => {
    return await api().post<ServiceResponse<AnimeEpisodes>>(`/addAutoEpisodes/${start}/${end}/${animeID}/${seasonID}`)
}
export const getPaginatedReviewsNoType = async (pageNo: number, showCount: number) => {
    return await api().get<ServiceResponse<ReviewsModels>>("/getPaginatedReviewsNoType/" + pageNo + "/" + showCount)
}
export const deleteReview = async (id: number) => {
    return await api().delete<ServiceResponse<Review>>(`/deleteAdminReview/${id}`)
}
export const addAutoMangaEpisodes = async (start: number, end: number, mangaID: number) => {
    return await api().post<ServiceResponse<AnimeEpisodes>>(`/addAutoMangaEpisodes/${start}/${end}/${mangaID}`)
}
export const addAutoMangaEpisodeContents = async (start: number, end: number, episodeID: number) => {
    return await api().post<ServiceResponse<AnimeEpisodes>>(`/addAutoMangaEpisodeContents/${start}/${end}/${episodeID}`)
}
export const deleteMangaEpisodeContents = async (episodes: Array<number>) => {
    return await api().delete("/deleteMangaEpisodeContents", {
        data: episodes
    });
}
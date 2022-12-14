import { Status, VideoType } from "./Entites";

export interface AnimeForm {
    img: string;
    animeName: string;
    animeDescription: string;
    malRating: string;
    siteRating: string;
    ageLimit: string;
    seasonCount: number;
    showTime: string;
    status: Status;
    videoType: VideoType;
    arrangement: string;
    fansub: string;
}
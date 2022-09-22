interface BaseEntity {
    id: number;
    createTime: string;
}
export enum Type {
    Anime = 1,
    Manga = 2,
    FanArt = 3,
    Comment = 4
}

export enum RoleType {
    Admin = 1,
    User = 2,
    Moderator = 3
}

export enum Status {
    Approved = 1,
    NotApproved = 2,
    Continues = 3,
    Completed = 4
}

export enum VideoType {
    AnimeSeries = 1,
    AnimeMovie = 2
}

export enum ComplaintType {
    Video = 1,
    Image = 2
}

export enum AnimeStatus {
    IWatched = 1,
    IWillWatch = 2,
    Watching = 3
}

export enum MangaStatus {
    IRead = 1,
    IWillRead = 2,
    Reading = 3
}

export enum NotificationType {
    Comments = 1,
    Message = 2,
    Rosette = 3,
    Anime = 4,
    Manga = 5,
    UserWarning = 6
}

export interface Anime extends BaseEntity {
    img: string;
    animeName: string;
    animeDescription: string;
    malRating: number;
    siteRating: number;
    ageLimit: string;
    seasonCount: number;
    showTime: string;
    status: Status;
    videoType: VideoType;
    views: number;
    like: number;
    arrangement: string;
    seoUrl: string;
}
export interface AnimeEpisodes extends BaseEntity {
    seasonID: number;
    episodeName: string;
    episodeDescription: string;
}
export interface AnimeList extends BaseEntity {
    userID: number;
    animeID: number;
    animeStatus: AnimeStatus;
}
export interface AnimeOfTheWeek extends BaseEntity {
    animeID: number;
    userID: number;
    description: string;
}
export interface AnimeRating extends BaseEntity {
    userID: number;
    animeID: number;
    rating: number;
}
export interface AnimeSeason extends BaseEntity {
    seasonName: string;
    animeID: number;
}
export interface AnimeSeasonMusic extends BaseEntity {
    seasonID: number;
    musicName: string;
    musicUrl: string;
}
export interface Announcement extends BaseEntity {
    updateInformation: string;
    updateDate: string;
    innovationInformation: string;
    innovationDate: string;
    complaintsInformation: string;
    complaintsDate: string;
    addToInformation: string;
    addDate: string;
    warningInformation: string;
    warningDate: string;
    comingSoonInfo: string;
    comingSoonDate: string;
}
export interface Categories extends BaseEntity {
    name: string;
}
export interface Comments extends BaseEntity {
    userID: number;
    contentID: number;
    comment: string;
    isSpoiler: boolean;
    type: Type;
}
export interface ComplaintList extends BaseEntity {
    complainantID: number;
    userID: number;
    description: string;
}

export interface Contact extends BaseEntity {
    nameSurname: string;
    email: string;
    subject: string;
    message: string;
}
export interface ContactSubject extends BaseEntity {
    subject: string;
}

export interface ContentComplaint extends BaseEntity {
    userID: number;
    contentID: number,
    message: string;
    type: Type,
    complaintType: ComplaintType;
}

export interface Episodes extends BaseEntity {
    episodeID: number;
    alternativeName: string;
    alternativeVideoUrl: string;
    alternativeVideoDownloadUrl: string;
}

export interface FanArt extends BaseEntity {
    userID: number;
    animeID: number;
    image: string;
    description: string;
}

export interface HomeSlider extends BaseEntity {
    image: string;
    sliderTitle: string;
    description: string;
    displayOrder: number;
    isDisplay: boolean;
}

export interface Like extends BaseEntity {
    type: Type;
    userID: number;
    contentID: number;
}

export interface Manga extends BaseEntity {
    image: string;
    name: string;
    description: string;
    arrangement: string;
    views: number;
    ageLimit: string;
    status: Status;
    seoUrl: string;
}

export interface MangaEpisodeContent extends BaseEntity {
    episodeID: number;
    contentImage: string;
    description: string;
    contentOrder: number;
}

export interface MangaEpisodes extends BaseEntity {
    mangaID: number;
    name: string;
    description: string;
}

export interface MangaList extends BaseEntity {
    userID: number;
    episodeID: number;
    status: MangaStatus;
}

export interface Notification extends BaseEntity {
    notificationType: NotificationType;
    userID: number;
    notificationMessage: string;
    isReadInfo: boolean;
}

export interface Review extends BaseEntity {
    animeID: number;
    userID: number;
    message: string;
}

export interface Rosette extends BaseEntity {
    name: string;
    img: string;
}

export interface SiteDescription extends BaseEntity {
    keywords: string;
    description: string;
    instagramUrl: string;
    youtubeUrl: string;
    discordUrl: string;
}

export interface SocialMediaAccount extends BaseEntity {
    userID: number;
    gmailUrl: string;
    instagramUrl: string;
}

export interface UserBlockList extends BaseEntity {
    userID: number;
    blockID: number;
}

export interface UserEmailVertification extends BaseEntity {
    email: string;
    code: string;
}

export interface UserForgotPassword extends BaseEntity {
    userID: number;
    resetLink: string;
}

export interface UserLoginHistory extends BaseEntity {
    userID: number;
    lastSeen: string;
}

export interface UserRosette extends BaseEntity {
    userID: number;
    rosetteID: number;
    status: Status;
}

export interface Users extends BaseEntity {
    image: string;
    nameSurname: string;
    userName: string;
    birthDay: string;
    email: string;
    password: string;
    discover: string;
    gender: string;
    isBanned: boolean;
    seoUrl: string;
    roleType: RoleType;
}
export interface UserModel extends Users {
    token: string;
}
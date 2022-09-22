import { HeadCell } from "../components/TableHelper";
import { Anime, AnimeEpisodes, Categories, ContentComplaint, Episodes, Users } from "../types/Entites";

export const animeCells: HeadCell<Anime>[] = [
    {
        id: 0,
        align: 'center',
        disablePadding: true,
        label: 'Resim',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Anime Adı',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Açıklama',
    },
    {
        id: 3,
        align: 'left',
        disablePadding: false,
        label: 'MAL Rating',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: false,
        label: 'Yaş Sınırı',
    },
    {
        id: 5,
        align: 'left',
        disablePadding: true,
        label: 'Sezon Sayısı',
    },
    {
        id: 6,
        align: 'center',
        disablePadding: false,
        label: 'İzleneme ve Beğeni',
    },
    {
        id: 7,
        align: 'left',
        disablePadding: false,
        label: 'Durumu',
    }
];
export const categoryCells: HeadCell<Categories>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Kategori Adı',
    },
];
export const rosetteCells: HeadCell<Categories>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Rozet',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Roset Adı',
    },
];
export const mangaCells: HeadCell<Anime>[] = [
    {
        id: 0,
        align: 'center',
        disablePadding: true,
        label: 'Resim',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Manga Adı',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Açıklama',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: false,
        label: 'Yaş Sınırı',
    },
    {
        id: 6,
        align: 'center',
        disablePadding: false,
        label: 'Okuma ve Beğeni',
    },
    {
        id: 7,
        align: 'left',
        disablePadding: false,
        label: 'Durumu',
    }
];
export const userCells: HeadCell<Users>[] = [
    {
        id: 1,
        align: 'left',
        disablePadding: false,
        label: 'Ad Soyad',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: false,
        label: 'Kullanıcı Adı',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: false,
        label: 'E-posta',
    },
    {
        id: 6,
        align: 'left',
        disablePadding: false,
        label: 'Cinsiyet',
    },
    {
        id: 7,
        align: 'left',
        disablePadding: false,
        label: 'Durumu',
    },
    {
        id: 8,
        align: 'left',
        disablePadding: false,
        label: 'Kayıt Tarihi',
    },
    {
        id: 9,
        align: 'left',
        disablePadding: false,
        label: 'Rol',
    }
];
export const contentComplaintCells: HeadCell<ContentComplaint>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Ad Soyad',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'E-posta',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Şikayet İçeriği',
    },
    {
        id: 3,
        align: 'left',
        disablePadding: true,
        label: 'İçerik',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: true,
        label: 'İçerik Tipi',
    },
];
export const animeEpisodesCells: HeadCell<AnimeEpisodes>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Bölüm Adı',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Bölüm Açıklaması',
    },
];
export const episodesCells: HeadCell<Episodes>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Alternatif Adı',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Video Url',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'İndirme Url',
    },
]
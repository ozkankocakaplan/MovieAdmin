import { HeadCell } from "../components/TableHelper";
import { Anime, AnimeEpisodes, AnimeSeasonMusic, Categories, Contact, ContactSubject, ContentComplaint, Episodes, FanArt, HomeSlider, Users } from "../types/Entites";

export const animeCells: HeadCell<Anime>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: false,
        label: 'Resim',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Anime Adı',
    },
    {
        id: 3,
        align: 'left',
        disablePadding: true,
        label: 'MAL Rating',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: true,
        label: 'Yaş Sınırı',
    },
    {
        id: 5,
        align: 'left',
        disablePadding: true,
        label: 'Sezon Sayısı',
    },
    // {
    //     id: 6,
    //     align: 'center',
    //     disablePadding: false,
    //     label: 'İzleneme ve Beğeni',
    // },
    {
        id: 7,
        align: 'left',
        disablePadding: true,
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
export const complaintCells: HeadCell<ContentComplaint>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Şikayet Eden',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Şikayet Edilen',
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
        disablePadding: true,
        label: 'Tarih',
    }
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
export const seasonMusicCells: HeadCell<AnimeSeasonMusic>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Müzik Adı',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Müzik Url',
    },
]
export const mangaEpisodesCells: HeadCell<Episodes>[] = [
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
        label: 'Açıklama',
    }
]
export const mangaEpisodeContentCells: HeadCell<Episodes>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: true,
        label: 'Resim',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Açıklama',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Sıralama',
    }
]
export const contactCells: HeadCell<Contact>[] = [
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
        label: 'Eposta',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Konu',
    },
    {
        id: 3,
        align: 'left',
        disablePadding: true,
        label: 'Mesaj',
    }
]
export const contactSubjectCells: HeadCell<ContactSubject>[] = [
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Konu Adı',
    }
]
export const sliderCells: HeadCell<HomeSlider>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: false,
        label: 'Resim',
    },
    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Başlık',
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
        disablePadding: true,
        label: 'Durum',
    }
]
export const fanArtCells: HeadCell<FanArt>[] = [
    {
        id: 0,
        align: 'left',
        disablePadding: false,
        label: 'Resim',
    },

    {
        id: 1,
        align: 'left',
        disablePadding: true,
        label: 'Ad',
    },
    {
        id: 2,
        align: 'left',
        disablePadding: true,
        label: 'Tür',
    },
    {
        id: 3,
        align: 'left',
        disablePadding: true,
        label: 'Açıklama',
    },
    {
        id: 4,
        align: 'left',
        disablePadding: true,
        label: 'Kullanıcı Adı',
    },

]
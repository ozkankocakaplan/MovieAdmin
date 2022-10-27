import { Autocomplete, Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TextField, Toolbar, Typography } from '@mui/material'
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import Loading from '../../components/Loading';
import { Anime, AnimeModels, Categories, CategoryType, Manga, Status, Type } from '../../types/Entites';
import { getAnimes, getCategories, postCategoryType, postManga } from '../../utils/api';

interface SelectedAnime extends AnimeModels {
    firstLetter: string
}
export default function AddManga() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [categoriesService, setCategoriesService] = useState<Array<Categories>>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);



    const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);

    const [animeListService, setAnimeList] = useState<Array<AnimeModels>>([]);

    const [mangaForm, setMangaForm] = useState<Manga>({ animeID: 0, name: '', description: '', arrangement: '', ageLimit: '', status: Status.Continues, siteRating: '', malRating: '' } as Manga);
    const [mangaStatus, setMangaStatus] = useState(Status.Continues);

    useEffect(() => {
        loadAnime();
        loadCategories();
    }, [])
    const loadCategories = async () => {
        await getCategories()
            .then((res) => {
                setCategoriesService(res.data.list);
            }).catch((er) => {
                console.log(er)
            });
        setLoading(false);
    }
    const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
        const { target: { value }, } = event;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    };
    const handleSelectedCategoriesID = (id: number) => {
        var check = selectedCategoriesID.find((i) => i === id);
        if (check != undefined) {
            setSelectedCategoriesID(selectedCategoriesID.filter((y) => y !== id));
        }
        else {
            setSelectedCategoriesID([...selectedCategoriesID, id]);
        }
    }
    const saveButon = async () => {
        await postManga({ ...mangaForm, animeID: selectedAnime != null ? selectedAnime.anime.id : 0 })
            .then(async (res) => {
                if (res.data.isSuccessful) {
                    var categoryTypeArray = new Array<CategoryType>();
                    selectedCategoriesID.map((item: number) => {
                        categoryTypeArray.push({ contentID: res.data.entity.id, type: Type.Manga, categoryID: item } as CategoryType);
                    })
                    await postCategoryType(categoryTypeArray).then((response) => {
                        navigate("/anime/" + res.data.entity.id);
                    })
                        .catch((er: AxiosError) => {
                            console.log(er)
                        })
                    navigate("/manga");
                }

            })
            .catch((er) => {
                console.log(er);
            })
    }
    const loadAnime = async () => {
        await getAnimes().then((res) => {
            setAnimeList(res.data.list);
        }).catch((er) => {
            console.log(er);
        })
    }
    const animeList = animeListService.map((option) => {
        const firstLetter = option.anime.animeName[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });
    const defaultAnimeProps = {
        options: animeListService,
        getOptionLabel: (option: AnimeModels) => option.anime.animeName,
    };
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Paper sx={{ width: '100%', mb: 1 }}>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 }
                        }}
                    >
                        <Typography component="div"
                            color={"inherit"}
                            variant={"h6"}
                            sx={{ flex: '1 1 100%' }}
                        >
                            Yeni Manga Ekle
                        </Typography>
                        <Button onClick={saveButon} variant='outlined'>
                            Kaydet
                        </Button>
                    </Toolbar>
                </Paper>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={12} sm={12} >
                        <Paper sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                            <div style={{ padding: 10 }}>
                                <Grid sx={{ marginTop: '10px' }} item sm={12} md={12} xs={12}>
                                    <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                        <Autocomplete
                                            {...defaultAnimeProps}
                                            value={selectedAnime}
                                            onChange={(event: any, newValue: AnimeModels | null) => {
                                                if (newValue != null) {
                                                    setSelectedAnime(newValue as any)
                                                }
                                            }}
                                            isOptionEqualToValue={(option, value) => option.anime.animeName === value.anime.animeName}
                                            id="grouped-demo"
                                            options={animeList.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                            groupBy={(option) => option.firstLetter}
                                            getOptionLabel={(option) => option.anime.animeName}
                                            renderInput={(params) => <TextField {...params} label="Anime" />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={mangaForm.name}
                                        onChange={(e) => setMangaForm({ ...mangaForm, name: e.target.value })}
                                        label="Manga Adı"
                                        fullWidth
                                    ></TextField>
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={mangaForm.description}
                                        onChange={(e) => setMangaForm({ ...mangaForm, description: e.target.value })}
                                        rows={4}
                                        label="Açıklama"
                                        fullWidth multiline
                                    ></TextField>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                        <InputLabel id="demo-multiple-checkbox-label">Kategoriler</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={selectedCategories}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="Kategoriler" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {
                                                categoriesService != null && categoriesService.length != 0 &&
                                                categoriesService.map((item, index) => {
                                                    return <MenuItem onClick={() => handleSelectedCategoriesID(item.id != null ? item.id : 0)} key={item.id} value={item.name}>
                                                        <Checkbox checked={selectedCategories.indexOf(item.name) > -1} />
                                                        <ListItemText primary={item.name} />
                                                    </MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Durum</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={mangaStatus}
                                            label="Durum"
                                            onChange={(e) => {
                                                setMangaStatus(e.target.value as any);
                                                setMangaForm({ ...mangaForm, status: e.target.value as Status })
                                            }}
                                        >
                                            <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                                            <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Grid item sm={12} md={12} xs={12} >
                                    <TextField
                                        value={mangaForm.ageLimit}
                                        onChange={(e) => setMangaForm({ ...mangaForm, ageLimit: e.target.value })}
                                        label="Yaş Sınırı"
                                        fullWidth
                                    ></TextField>
                                </Grid>
                                <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                                    <Grid item sm={6} md={6} xs={12}>
                                        <TextField
                                            value={mangaForm.siteRating}
                                            onChange={(e) => setMangaForm({ ...mangaForm, siteRating: e.target.value })}
                                            label="Site Rating"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                    <Grid item sm={6} md={6} xs={12}>
                                        <TextField
                                            value={mangaForm.malRating}
                                            onChange={(e) => setMangaForm({ ...mangaForm, malRating: e.target.value })}
                                            label="Mal Rating"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Loading>
    )
}
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};
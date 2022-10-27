import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TextField, Toolbar, Typography } from '@mui/material'
import { getCategories, postAnime, postCategoryType } from '../../utils/api'
import { Anime, Categories, CategoryType, Status, Type, VideoType } from '../../types/Entites';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';



import Loading from '../../components/Loading';
import { AxiosError } from 'axios';
import { AnimeForm } from '../../types/EntitesForm';
import { useNavigate } from 'react-router';



export default function AddAnime() {
    var navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [categoriesService, setCategoriesService] = useState<Array<Categories>>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);

    const [contentType, setContentType] = useState<VideoType>(VideoType.AnimeMovie);
    const [animeStatus, setAnimeStatus] = useState<Status>(Status.Continues);
    const [firstShowDate, setFirstShowDate] = useState<Dayjs | null>(dayjs(new Date()));

    const [animeForm, setAnimeForm] = useState<AnimeForm>({ animeName: '', animeDescription: '', malRating: '', ageLimit: '', seasonCount: 1, showTime: firstShowDate?.toString(), status: animeStatus, videoType: contentType, siteRating: '' } as Anime);

    const [formCheck, setFormCheck] = useState(false);
    useEffect(() => {
        loadCategories();
    }, []);

    const handleSelectedCategoriesID = (id: number) => {
        var check = selectedCategoriesID.find((i) => i === id);
        if (check != undefined) {
            setSelectedCategoriesID(selectedCategoriesID.filter((y) => y !== id));
        }
        else {
            setSelectedCategoriesID([...selectedCategoriesID, id]);
        }
    }

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
    const saveButon = async () => {
        if (animeForm.animeName.length != 0 && animeForm.animeDescription.length != 0 && selectedCategoriesID.length != 0 && animeForm.ageLimit.length != 0 && animeForm.seasonCount != 0 && animeForm.malRating != undefined && animeForm.malRating.length != 0) {
            setFormCheck(false);
            await postAnime(animeForm).then(async (res) => {
                if (res.data.isSuccessful) {
                    var categoryTypeArray = new Array<CategoryType>();
                    selectedCategoriesID.map((item: number) => {
                        categoryTypeArray.push({ contentID: res.data.entity.id, type: Type.Anime, categoryID: item } as CategoryType);
                    })
                    await postCategoryType(categoryTypeArray).then((response) => {
                        navigate("/anime/" + res.data.entity.id);
                    })
                        .catch((er: AxiosError) => {
                            console.log(er)
                        })

                }
            }).catch((er: AxiosError) => {
                console.log(er.message);
            })
        }
        else {
            setFormCheck(true);
        }
    }
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
                            Yeni Anime Ekle
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
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={animeForm.animeName}
                                        onChange={(e) => setAnimeForm({ ...animeForm, animeName: e.target.value })}
                                        label="Film veya Dizi Adı"
                                        fullWidth
                                    ></TextField>
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={animeForm.animeDescription}
                                        onChange={(e) => setAnimeForm({ ...animeForm, animeDescription: e.target.value })}
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
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack>
                                            <DesktopDatePicker
                                                label="Gösterim Tarihi"
                                                inputFormat="DD/MM/YYYY"
                                                value={firstShowDate}
                                                onChange={(e) => {
                                                    setFirstShowDate(dayjs(e));
                                                    setAnimeForm({ ...animeForm, showTime: dayjs(e).format('DD/MM/YYYY') })
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px', marginBottom: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">İçerik Tipi</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={contentType}
                                            label="İçerik Tipi"
                                            onChange={(e) => {
                                                setContentType(e.target.value as any);
                                                setAnimeForm({ ...animeForm, videoType: e.target.value as VideoType })
                                            }}
                                        >
                                            <MenuItem value={VideoType.AnimeMovie}>Film</MenuItem>
                                            <MenuItem value={VideoType.AnimeSeries}>Anime Serisi</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px', marginBottom: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Durum</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={animeStatus}
                                            label="Durum"
                                            onChange={(e) => {
                                                setAnimeStatus(e.target.value as any);
                                                setAnimeForm({ ...animeForm, status: e.target.value as Status })
                                            }}
                                        >
                                            <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                                            <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                                    <Grid item sm={6} md={6} xs={12} >
                                        <TextField
                                            value={animeForm.ageLimit}
                                            onChange={(e) => setAnimeForm({ ...animeForm, ageLimit: e.target.value })}
                                            label="Yaş Sınırı"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                    <Grid item sm={6} md={6} xs={12}>
                                        <TextField
                                            type={"number"}
                                            value={animeForm.seasonCount}
                                            onChange={(e) => setAnimeForm({ ...animeForm, seasonCount: parseInt(e.target.value) })}
                                            label="Sezon Sayısı"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                                    <Grid item sm={6} md={6} xs={12}>
                                        <TextField
                                            value={animeForm.siteRating}
                                            onChange={(e) => setAnimeForm({ ...animeForm, siteRating: e.target.value })}
                                            label="Site Rating"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                    <Grid item sm={6} md={6} xs={12}>
                                        <TextField
                                            value={animeForm.malRating}
                                            onChange={(e) => setAnimeForm({ ...animeForm, malRating: e.target.value })}
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
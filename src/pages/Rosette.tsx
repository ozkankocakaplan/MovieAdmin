import { Add, Delete, Edit, PhotoCamera, Remove } from '@mui/icons-material';
import { alpha, Autocomplete, Avatar, Box, Button, Checkbox, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import DeleteDialog from '../components/DeleteDialog';
import Loading from '../components/Loading'
import ResultSnackbar, { Result } from '../components/ResultSnackbar';
import RightDrawer from '../components/RightDrawer';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { Anime, AnimeEpisodes, Manga, MangaEpisodes, Rosette as Rosettes, RosetteContent, RosetteModels, Type } from '../types/Entites';
import { baseUrl, deleteRosettes, getAnimeEpisodes, getAnimes, getFullMangaEpisodes, getMangas, getRosette, getRosetteContent, getRosettes, postRosette, postRosetteContent, putRosette, putRosetteContent, putUpdateImage } from '../utils/api';
import { rosetteCells } from '../utils/HeadCells';

export default function Rosette() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Rosettes>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<Rosettes>>([]);
    const [loading, setLoading] = useState(true);
    const [addRosetteDrawer, setAddRosetteDrawer] = useState(false);
    const [editRosetteDrawer, setEditRosetteDrawer] = useState(false);

    const [mangaService, setMangaService] = useState<Array<Manga>>([]);
    const [animeService, setAnimeService] = useState<Array<Anime>>([]);

    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        loadAnimeAndManga();
        loadRosette();
        setLoading(false);
        return () => {
            setLoading(true);
        }
    }, [])
    const loadRosette = async () => {
        await getRosettes().then((res) => {
            setServiceResponse(res.data.list);
        })
            .catch((er) => {
                console.log(er);
            })
    }
    const loadAnimeAndManga = async () => {
        await getMangas().then((res) => {
            setMangaService(res.data.list);
        }).catch((er) => {

        })
        await getAnimes().then((res) => {
            setAnimeService(res.data.list);
        }).catch((er) => {
            console.log(er);
        })
    }
    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - serviceResponse.length) : 0;
    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const { numSelected } = props;
        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {/* {numSelected} */}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {props.tableName}
                    </Typography>
                )}
                {numSelected == 0 && <IconButton onClick={props.goAddPage}>
                    <Add />
                </IconButton>}
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Düzenle">
                            <IconButton onClick={props.goEditPage}>
                                <Edit />
                            </IconButton>
                        </Tooltip>}
                        <Tooltip title="Sil">
                            <IconButton onClick={props.handleDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
    const addToggleDrawer = (open: boolean) => {
        setAddRosetteDrawer(open);
    };
    const editToggleDrawer = (open: boolean) => {
        setEditRosetteDrawer(open);
    };
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={rosetteCells}
                            order={order}
                            setOrder={(data) => setOrder(data)}
                            orderBy={orderBy}
                            setOrderBy={(data) => setOrderBy(data)}
                            selected={selected}
                            setSelected={(data) => setSelected(data)}
                            page={page}
                            setPage={(page) => setPage(page)}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={(data) => setRowsPerPage(data)}
                            goAddPage={() => setAddRosetteDrawer(true)}
                            goEditPage={() => {
                                setEditRosetteDrawer(true);
                            }}
                            handleDelete={() => { setDeleteDialog(true) }}
                            tableName="Rozetler"
                            tableBody={!loading && serviceResponse.length != 0 &&
                                <TableBody>
                                    {stableSort(serviceResponse, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id.toString());
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.id.toString())}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.id.toString()}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ padding: '10px' }}
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <img
                                                            style={{ height: '60px', width: '60px' }}
                                                            src={baseUrl + row.img}
                                                            srcSet={baseUrl + row.img}
                                                            alt={row.name}
                                                            loading="lazy"
                                                        />
                                                    </TableCell>
                                                    <TableCell >{row.name}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 53 * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            }
                        />
                    </Paper>
                </Grid>
            </Grid>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteRosettes(selected.map((item) => parseInt(item)));
                        window.location.reload();
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => setDeleteDialog(false)}>
                        Kapat
                    </Button>
                }
            />
            <AddRosetteDrawer mangas={mangaService} animes={animeService} drawerState={addRosetteDrawer} openDrawer={addToggleDrawer} />
            {editRosetteDrawer && <EditRosetteDrawer rosetteID={parseInt(selected[0])} mangas={mangaService} animes={animeService} drawerState={editRosetteDrawer} openDrawer={editToggleDrawer} />}
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
interface SelectedManga extends Manga {
    firstLetter: string
}
interface SelectedAnime extends Anime {
    firstLetter: string
}
export const AddRosetteDrawer = (props: {
    openDrawer: (status: boolean) => void,
    drawerState: boolean,
    animes: Array<Anime>,
    mangas: Array<Manga>
}) => {
    console.log(props);
    const [rosetteForm, setRosetteForm] = useState<Rosettes>({ name: '' } as Rosettes);
    const [selectedImage, setSelectedImage] = useState('');
    const [type, setType] = useState<number>(0);

    const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);
    const [selectedManga, setSelectedManga] = useState<SelectedManga | null>(null);

    const [selectedEpisodes, setSelectedEpisodes] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(true);

    const [animeEpisodes, setAnimeEpisodes] = useState<Array<AnimeEpisodes>>([]);
    const [mangaEpisodes, setMangaEpisodes] = useState<Array<MangaEpisodes>>([]);

    const [episodeLoading, setEpisodeLoading] = useState(true);

    const [selectedEpisodesID, setSelectedEpisodesID] = useState<number[]>([]);

    const [formData, setFormData] = useState(new FormData());
    useEffect(() => {
        setSelectedAnime(null);
        setSelectedManga(null);
        setSelectedEpisodesID([]);
        setSelectedEpisodes([]);
    }, [type]);
    useEffect(() => {
        if (type === 0) {
            loadAnimeEpisode();
            setLoading(false);
        }
        else {
            loadMangaEpisode();
            setLoading(false);

        }
    }, [selectedAnime, selectedManga])

    const handleSelectedEpisodesID = (id: number) => {
        var check = selectedEpisodesID.find((i) => i === id);
        if (check != undefined) {
            setSelectedEpisodesID(selectedEpisodesID.filter((y) => y !== id));
        }
        else {
            setSelectedEpisodesID([...selectedEpisodesID, id]);
        }
    }
    const loadAnimeEpisode = async () => {
        setEpisodeLoading(true);
        await getAnimeEpisodes()
            .then((res) => {
                setAnimeEpisodes(res.data.list.filter((y) => y.animeID === selectedAnime?.id))
            }).catch((er) => {
                console.log(er);
            });
        setEpisodeLoading(false);
    }
    const loadMangaEpisode = async () => {
        setEpisodeLoading(true);
        await getFullMangaEpisodes()
            .then((res) => {
                setMangaEpisodes(res.data.list.filter((y) => y.mangaID === selectedManga?.id));
            }).catch((er) => {
                console.log(er);
            });
        setEpisodeLoading(false);
    }
    const saveButon = async () => {
        await postRosette(rosetteForm, formData)
            .then(async (res) => {
                var rosetteContents = Array<RosetteContent>();
                selectedEpisodesID.map((item) => {
                    rosetteContents.push({ rosetteID: res.data.entity.id, episodesID: item, type: type === 0 ? Type.Anime : Type.Manga, contentID: type === 0 ? selectedAnime?.id : selectedManga?.id } as RosetteContent);
                });
                await postRosetteContent(rosetteContents)
                    .then((response) => {
                        window.location.reload();
                    })
            }).catch((er) => {

            })
    }
    return (
        <RightDrawer {...props} >
            <Loading loading={loading}>
                <Box
                    role="presentation"
                >
                    <Grid container sx={{ padding: '0px 15px' }} >
                        <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex', }} sm={12} md={12} xs={12}>
                            {selectedImage.length != 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute' }}>
                                <Delete />
                            </IconButton>}
                            {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                                <input onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        formData.append("img", e.target.files[0] as any);
                                        setSelectedImage(URL.createObjectURL(e.target.files[0]))
                                    }
                                }}
                                    hidden accept="image/*" type="file" />
                                <PhotoCamera />
                            </IconButton>}
                            {selectedImage.length != 0 && <img src={selectedImage} style={{ height: '125px', width: '125px' }} />}
                        </Grid>
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={rosetteForm.name}
                                    onChange={(e) => setRosetteForm({ ...rosetteForm, name: e.target.value })}
                                    label="Rozet Adı"
                                    fullWidth
                                ></TextField>
                            </Box>
                        </Grid>
                        <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tür</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Tür"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                >
                                    <MenuItem value={0}>Anime</MenuItem>
                                    <MenuItem value={1}>Manga</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid sx={{ marginTop: '10px' }} item sm={12} md={12} xs={12}>
                            <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                {type === 1 ? <Autocomplete

                                    value={selectedManga}
                                    onChange={(event: any, newValue: Manga | null) => {
                                        if (newValue != null) {
                                            setSelectedManga(newValue as any)
                                        }
                                    }}
                                    options={props.mangas}
                                    getOptionLabel={(option) => option.name}
                                    id="grouped-demo"
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    renderInput={(params) => <TextField {...params} label="Manga" />}
                                />
                                    :
                                    <Autocomplete
                                        options={props.animes}
                                        value={selectedAnime}
                                        onChange={(event: any, newValue: Anime | null) => {
                                            if (newValue != null) {
                                                setSelectedAnime(newValue as any)
                                            }
                                        }}
                                        isOptionEqualToValue={(option, value) => option.animeName === value.animeName}
                                        id="grouped-demo"

                                        getOptionLabel={(option) => option.animeName}
                                        renderInput={(params) => <TextField {...params} label="Anime" />}
                                    />
                                }
                            </FormControl>
                        </Grid>
                        {!episodeLoading && <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Bölümler</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={selectedEpisodes}
                                        onChange={(e) => setSelectedEpisodes(e.target.value as any)}
                                        input={<OutlinedInput label="Bölümler" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {
                                            type === 0 ?
                                                animeEpisodes.map((name) => (
                                                    <MenuItem onClick={() => handleSelectedEpisodesID(name.id)} key={name.id} value={name.episodeName}>
                                                        <Checkbox checked={selectedEpisodes.indexOf(name.episodeName) > -1} />
                                                        <ListItemText primary={name.episodeName} />
                                                    </MenuItem>
                                                ))
                                                :
                                                mangaEpisodes.map((name) => (
                                                    <MenuItem onClick={() => handleSelectedEpisodesID(name.id)} key={name.id} value={name.name}>
                                                        <Checkbox checked={selectedEpisodes.indexOf(name.name) > -1} />
                                                        <ListItemText primary={name.name} />
                                                    </MenuItem>
                                                ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>}
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                }}>
                                <Button
                                    onClick={saveButon}
                                    size='medium'
                                    fullWidth variant='contained'>
                                    Kaydet
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Loading>
        </RightDrawer>
    )
}
export const EditRosetteDrawer = (props: {
    openDrawer: (status: boolean) => void,
    drawerState: boolean,
    animes: Array<Anime>,
    mangas: Array<Manga>,
    rosetteID: number
}) => {
    const [rosetteForm, setRosetteForm] = useState<Rosettes>({ name: '' } as Rosettes);
    const [selectedImage, setSelectedImage] = useState('');
    const [type, setType] = useState<number>(0);

    const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);
    const [selectedManga, setSelectedManga] = useState<SelectedManga | null>(null);

    const [selectedEpisodes, setSelectedEpisodes] = useState<Array<string>>([]);
    const [selectedEpisodesID, setSelectedEpisodesID] = useState<Array<number>>([]);
    const [loading, setLoading] = useState(true);

    const [animeEpisodes, setAnimeEpisodes] = useState<Array<AnimeEpisodes>>([]);
    const [mangaEpisodes, setMangaEpisodes] = useState<Array<MangaEpisodes>>([]);

    const [result, setResult] = useState<Result>({ status: false, text: '' });
    const [isResultOpen, setIsResultOpen] = useState(false);
    useEffect(() => {
        loadRosette();
    }, [])
    useEffect(() => {
        setSelectedAnime(null);
        setSelectedManga(null);
        setSelectedEpisodes([]);
    }, [type]);
    useEffect(() => {
        setLoading(true);
        if (type === 0) {
            loadAnimeEpisode();
            setLoading(false);
        }
        else {
            loadMangaEpisode();
            setLoading(false);

        }
    }, [selectedAnime, selectedManga])

    const loadRosette = async () => {
        await getRosette(props.rosetteID)
            .then(async (res) => {
                if (res.data.isSuccessful && res.data.entity != null) {
                    setRosetteForm(res.data.entity.rosette);
                    setSelectedImage(baseUrl + res.data.entity.rosette.img);
                    if (type === 0) {
                        const firstLetter = res.data.entity.anime.animeName.toUpperCase();
                        setSelectedAnime({ ...res.data.entity.anime, firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter } as SelectedAnime);
                        setAnimeEpisodes(res.data.entity.animeEpisodes);
                        setSelectedEpisodes(res.data.entity.animeEpisodes.map((item) => item.episodeName.toString()))
                        setSelectedEpisodesID(res.data.entity.animeEpisodes.map((item) => item.id))
                    }
                    else {
                        const firstLetter = res.data.entity.manga.name.toUpperCase();
                        setSelectedManga({ ...res.data.entity.manga, firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter, } as SelectedManga);
                        setMangaEpisodes(res.data.entity.mangaEpisodes);
                        setSelectedEpisodes(res.data.entity.mangaEpisodes.map((item) => item.name.toString()))
                        setSelectedEpisodesID(res.data.entity.mangaEpisodes.map((item) => item.id))
                    }
                }
            })
            .catch((er) => {
                console.log(er);
            });
        setLoading(false);
    }
    const loadAnimeEpisode = async () => {

        await getAnimeEpisodes()
            .then((res) => {
                setAnimeEpisodes(res.data.list.filter((y) => y.animeID === selectedAnime?.id))
            }).catch((er) => {
                console.log(er);
            });

    }
    const loadMangaEpisode = async () => {

        await getFullMangaEpisodes()
            .then((res) => {
                setMangaEpisodes(res.data.list.filter((y) => y.mangaID === selectedManga?.id));
            }).catch((er) => {
                console.log(er);
            });

    }
    const defaultAnimeProps = {
        options: props.animes,
        getOptionLabel: (option: Anime) => option.animeName,
    };
    const defaultMangaProps = {
        options: props.mangas,
        getOptionLabel: (option: Manga) => option.name,
    };
    const handleSelectedEpisodesID = (id: number) => {
        var check = selectedEpisodesID.find((i) => i === id);
        if (check !== undefined) {
            setSelectedEpisodesID(selectedEpisodesID.filter((y) => y !== id));
        }
        else {
            setSelectedEpisodesID([...selectedEpisodesID, id]);
        }
    }
    const saveButon = async () => {
        await putRosette(rosetteForm)
            .then(async (res) => {
                var rosetteContents = Array<RosetteContent>();
                selectedEpisodesID.map((item) => {
                    rosetteContents.push({ rosetteID: res.data.entity.id, episodesID: item, type: type === 0 ? Type.Anime : Type.Manga, contentID: type === 0 ? selectedAnime?.id : selectedManga?.id } as RosetteContent);
                });
                await putRosetteContent(rosetteContents, res.data.entity.id)
                    .then((response) => {
                        window.location.reload();
                    })
            }).catch((er) => {

            })
    }
    return (
        <RightDrawer {...props} >
            <Loading loading={loading}>
                <Box
                    role="presentation"
                >
                    <Grid container sx={{ padding: '0px 15px' }} >
                        <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
                            {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute', top: 10, marginLeft: '150px' }}>
                                <Delete />
                            </IconButton>}
                            {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                                <input onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        var form = new FormData();
                                        form.append("file", e.target.files[0] as any);
                                        setSelectedImage(URL.createObjectURL(e.target.files[0]));
                                        await putUpdateImage(props.rosetteID, form).then((res) => {
                                            setResult({ status: res.data.isSuccessful, text: res.data.entity != null ? "Başarıyla Güncellendi" : "Hata Oluştu" })
                                        }).catch((er: AxiosError) => {
                                            setResult({ status: false, text: er.message })
                                        });
                                        setIsResultOpen(true);
                                    }
                                }}
                                    hidden accept="image/*" type="file" />
                                <PhotoCamera />
                            </IconButton>}
                            {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '125px', width: '125px' }} />}
                        </Grid>
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={rosetteForm.name}
                                    onChange={(e) => setRosetteForm({ ...rosetteForm, name: e.target.value })}
                                    label="Rozet Adı"
                                    fullWidth
                                ></TextField>
                            </Box>
                        </Grid>
                        <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tür</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Tür"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                >
                                    <MenuItem value={0}>Anime</MenuItem>
                                    <MenuItem value={1}>Manga</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid sx={{ marginTop: '10px' }} item sm={12} md={12} xs={12}>
                            <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                {type === 1 ? <Autocomplete
                                    {...defaultMangaProps}
                                    value={selectedManga}
                                    onChange={(event: any, newValue: Manga | null) => {
                                        if (newValue != null) {
                                            setSelectedManga(newValue as any)
                                        }
                                    }}
                                    id="grouped-demo"
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label="Manga" />}
                                />
                                    :
                                    <Autocomplete
                                        {...defaultAnimeProps}
                                        value={selectedAnime}
                                        onChange={(event: any, newValue: Anime | null) => {
                                            if (newValue != null) {
                                                setSelectedAnime(newValue as any)
                                            }
                                        }}
                                        isOptionEqualToValue={(option, value) => option.animeName === value.animeName}
                                        id="grouped-demo"
                                        getOptionLabel={(option) => option.animeName}
                                        renderInput={(params) => <TextField {...params} label="Anime" />}
                                    />
                                }
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Bölümler</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={selectedEpisodes}
                                        onChange={(e) => setSelectedEpisodes(e.target.value as any)}
                                        input={<OutlinedInput label="Bölümler" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {
                                            type === 0 ?
                                                animeEpisodes.map((name) => (
                                                    <MenuItem onClick={() => handleSelectedEpisodesID(name.id)} key={name.id} value={name.episodeName}>
                                                        <Checkbox checked={selectedEpisodes.indexOf(name.episodeName) > -1} />
                                                        <ListItemText primary={name.episodeName} />
                                                    </MenuItem>
                                                ))
                                                :
                                                mangaEpisodes.map((name) => (
                                                    <MenuItem onClick={() => handleSelectedEpisodesID(name.id)} key={name.id} value={name.name}>
                                                        <Checkbox checked={selectedEpisodes.indexOf(name.name) > -1} />
                                                        <ListItemText primary={name.name} />
                                                    </MenuItem>
                                                ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                }}>
                                <Button
                                    onClick={saveButon}
                                    size='medium'
                                    fullWidth variant='contained'>
                                    Kaydet
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <ResultSnackbar result={result} open={isResultOpen} closeOpen={() => setIsResultOpen(false)} />
            </Loading>
        </RightDrawer>
    )
}

import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { Anime, AnimeModels, Categories, CategoryType, Manga, MangaEpisodeContent, MangaEpisodes, MangaImages, Status, Type } from '../../types/Entites';
import { addAutoMangaEpisodeContents, addAutoMangaEpisodes, deleteManga, deleteMangaEpisode, deleteMangaEpisodeContent, deleteMangaEpisodeContents, deleteMangaEpisodes, getAnimes, getCategories, getCategoryTypes, getMangaByID, getMangaEpisode, getMangaEpisodeContent, getMangaEpisodeContents, getMangaEpisodes, getMangaImageList, postAnimeImages, postMangaContentEpisode, postMangaEpisodes, postMangaImages, putCategoryType, putManga, putMangaContentEpisode, putMangaEpisodes, putMangaImage } from '../../utils/api';
import DataTable, { EnhancedTableToolbarProps } from '../../components/DataTable';
import { Order } from '../../components/TableHelper';
import { Add, Delete, Edit, PhotoCamera } from '@mui/icons-material';
import { mangaEpisodeContentCells, mangaEpisodesCells } from '../../utils/HeadCells';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import FullDialog from '../../components/FullDialog';
import DeleteDialog from '../../components/DeleteDialog';
import { AxiosError } from 'axios';
import MyDropzone from '../../components/MyDropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadImage, setAnimeFiles } from '../../store/features/mainReducers';
import { RootState } from '../../store/index';
import ResultSnackbar, { Result } from '../../components/ResultSnackbar';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};
interface SelectedAnime extends AnimeModels {
    firstLetter: string
}
export default function EditManga() {
    var navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Manga>('id');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const [categoriesServiceResponse, setCategoriesServiceResponse] = useState<Array<Categories>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<Categories>>([]);
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    // const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);


    const [addRightDrawer, setAddRightDrawer] = useState(false);

    const [editDialog, setEditDialog] = useState(false);


    const [mangaForm, setMangaForm] = useState<Manga>({ name: '', description: '', arrangement: '', ageLimit: '', status: Status.Continues, fansub: '', malRating: '' } as Manga);
    const [mangaStatus, setMangaStatus] = useState(Status.Continues);

    const [mangaEpisodeService, setMangaEpisodeService] = useState<Array<MangaEpisodes>>([]);

    const [mangaEpisodeDelete, setMangaEpisodeDelete] = useState(false);

    const [mangaEpisodeDeletes, setMangaEpisodeDeletes] = useState(false);
    const [mangaDelete, setMangaDelete] = useState(false);


    const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);

    const [animeListService, setAnimeList] = useState<Array<AnimeModels>>([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [mangaImages, setMangaImages] = useState<Array<MangaImages>>([]);
    const { animeFiles } = useSelector((x: RootState) => x.mainReducers);
    const dispatch = useDispatch();
    const [result, setResult] = useState<Result>({ status: false, text: '' });
    const [open, setOpen] = useState(false);

    const [episodeCountDialog, setEpisodeCountDialog] = useState(false);
    const [startCount, setStartCount] = useState('');
    const [endCount, setEndCount] = useState('');
    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        var check = animeListService.find((y) => y.anime.id === mangaForm.animeID);
        if (check != null) {
            setSelectedAnime({ ...check, firstLetter: mangaForm.name[0].toUpperCase() });
        }
    }, [animeListService])

    const loadData = async () => {
        await loadMangaInfo();
        await loadAnime();
        await loadCategories();
        await loadMangaImages();
        await loadMangaEpisodes();
        setLoading(false);
    }
    const loadAnime = async () => {
        await getAnimes().then((res) => {
            setAnimeList(res.data.list);
        }).catch((er) => {
            console.log(er);
        })
    }
    const loadMangaEpisodes = async () => {
        await getMangaEpisodes(id as any).then((res) => {
            setMangaEpisodeService(res.data.list);
        }).catch((er) => {
        })
    }
    const loadCategories = async () => {
        await getCategories()
            .then(async (res) => {
                if (res.data.isSuccessful) {
                    setCategoriesServiceResponse(res.data.list);
                    await getCategoryTypes(id as any, Type.Manga).then((response) => {
                        setSelectedCategories(response.data.list.map((item) => item.categories) as any);
                    }).catch((er: AxiosError) => {
                        console.log(er)
                    })
                }
            }).catch((er) => {
                console.log(er)
            });

    }
    const loadMangaInfo = async () => {
        await getMangaByID(id as any).then((res) => {
            if (res.data.isSuccessful && res.data.entity != null) {
                setMangaForm({ ...res.data.entity, fansub: res.data.entity.fansub != null ? res.data.entity.fansub : "" } as Manga);
                setSelectedImage(res.data.entity.image);
            }
            else {
                navigate("/dashboard")
            }
        }).catch((er) => {
            console.log(er);
        })
    }
    const updateButon = async () => {
        setResult({ status: true, text: "Değişiklikler kaydedildi" });
        await putManga({ ...mangaForm, animeID: selectedAnime != null ? selectedAnime.anime.id : 0 });
        await putCategoryType(convertCategoryType());
        var formData = new FormData();
        animeFiles.map((item) => {
            formData.append("files", item as any);
        })
        await postMangaImages(formData, id as any).then((res) => {
            res.data.list.map((item: any) => {
                dispatch(setUploadImage(item))
            })
        });
        setOpen(true);
        dispatch(setAnimeFiles([]));

    }
    const convertCategoryType = () => {
        var newArray = Array<CategoryType>();
        selectedCategories.map((item: any) => {
            newArray.push({ categoryID: item.id, type: Type.Manga, contentID: id as any } as CategoryType);
        })
        return newArray;
    }
    const loadMangaImages = async () => {
        await getMangaImageList(id as any).then((res) => {
            setMangaImages(res.data.list);
        }).catch((er) => {
            console.log(er);
        })
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - mangaEpisodeService.length) : 0;
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
                        {numSelected == 1 && <Tooltip title="Edit">
                            <IconButton onClick={props.goEditPage}>
                                <Edit />
                            </IconButton>
                        </Tooltip>}
                        <Tooltip title="Delete">
                            <IconButton onClick={props.handleDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
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
    const handleDeleteEpisodeItem = () => {
        var newData = Array<MangaEpisodes>();
        newData = mangaEpisodeService.filter((item) => {
            var check = selected.some((y) => parseInt(y) === item.id);
            if (check == false) {
                return item;
            }
        }) as Array<MangaEpisodes>;
        return newData;
    }
    // const animeList = animeListService.map((option) => {
    //     const firstLetter = option.animeName[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });

    const defaultCategoryProps = {
        options: categoriesServiceResponse,
        getOptionLabel: (option: Categories) => option.name,
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
                            {mangaForm.name}
                        </Typography>
                        <Button onClick={updateButon} variant='contained' >
                            Kaydet
                        </Button>
                        <Button onClick={() => setMangaDelete(true)} sx={{ marginLeft: '10px' }} variant='outlined' startIcon={<Delete />}>
                            Sil
                        </Button>
                    </Toolbar>
                </Paper>
                <Grid container>
                    <div style={{ marginBottom: '20px', justifyContent: 'center', display: 'flex', flex: 1 }}>
                        <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
                            {/* {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                                <input onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        var form = new FormData();
                                        form.append("mangaImg", e.target.files[0] as any);
                                        setSelectedImage(URL.createObjectURL(e.target.files[0]));
                                        await putMangaImage(form, id as any);
                                        window.location.reload();
                                    }
                                }}
                                    hidden accept="image/*" type="file" />
                                <PhotoCamera />
                            </IconButton>} */}
                            {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '200px', width: '150px' }} />}
                        </Grid>
                    </div>
                    <Grid item xs={12} md={12} sm={12} sx={{ marginBottom: '20px' }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Manga Görselleri</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={12} sm={12} >
                                        <MyDropzone data={mangaImages} mangaID={id as any} />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} >
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Manga Bilgileri</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                                    <div style={{ padding: 10 }}>
                                        <Grid sx={{ marginTop: '10px' }} item sm={12} md={12} xs={12}>
                                            <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                                <Autocomplete
                                                    value={selectedAnime}
                                                    onChange={(event: any, newValue: AnimeModels | null) => {
                                                        if (newValue != null) {
                                                            setSelectedAnime(newValue as any)

                                                            if (newValue.categories != null && newValue.categories.length !== 0) {
                                                                setSelectedImage(newValue.anime.img != null ? newValue.anime.img : "");
                                                                setSelectedCategories(newValue.categories.map((item) => item.categories));
                                                                setMangaForm({
                                                                    ...mangaForm,
                                                                    name: newValue.anime.animeName,
                                                                    ageLimit: newValue.anime.ageLimit,
                                                                    malRating: newValue.anime.malRating,
                                                                    description: newValue.anime.animeDescription,
                                                                    image: newValue.anime.img != null ? newValue.anime.img : "",
                                                                    fansub: newValue.anime.fansub != null ? newValue.anime.fansub : ""
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.anime.animeName === value.anime.animeName}
                                                    id="grouped-demo"
                                                    options={animeListService}

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
                                                value={mangaForm.image}
                                                onChange={(e) => {
                                                    setMangaForm({ ...mangaForm, image: mangaForm.image != null ? e.target.value : "" });
                                                    setSelectedImage(e.target.value);
                                                }}
                                                label="Kapak Resim"
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
                                                <Autocomplete
                                                    {...defaultCategoryProps}
                                                    multiple
                                                    id="checkboxes-tags-demo"
                                                    disableCloseOnSelect
                                                    value={selectedCategories}
                                                    onChange={(event, newValue) => {
                                                        setSelectedCategories(newValue as Array<Categories>);
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox
                                                                icon={icon}
                                                                checkedIcon={checkedIcon}
                                                                style={{ marginRight: 8 }}
                                                                checked={selected}
                                                            />
                                                            {option.name}
                                                        </li>
                                                    )}
                                                    fullWidth
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Kategoriler" placeholder="Kategori" />
                                                    )}
                                                />
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
                                                    value={mangaStatus}
                                                    label="Durum"
                                                    onChange={(e) => {
                                                        setMangaStatus(e.target.value as any);
                                                        setMangaForm({ ...mangaForm, status: e.target.value as Status })
                                                    }}
                                                >
                                                    <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                                                    <MenuItem value={Status.Abandoned}>Yarıda Bırakıldı</MenuItem>
                                                    <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Yaş Sınırı</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={mangaForm.ageLimit.replace(' ', '')}
                                                label="Yaş Sınırı"
                                                onChange={(e) => {

                                                    setMangaForm({ ...mangaForm, ageLimit: e.target.value })
                                                }}
                                            >
                                                <MenuItem value={"7"}>+7</MenuItem>
                                                <MenuItem value={"13"}>+13</MenuItem>
                                                <MenuItem value={"18"}>+18</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Grid item sm={12} md={12} xs={12} >
                                            <TextField
                                                value={mangaForm.malRating}
                                                onChange={(e) => setMangaForm({ ...mangaForm, malRating: e.target.value })}
                                                label="Mal Rating"
                                                fullWidth
                                            ></TextField>
                                        </Grid>
                                        <Grid item sm={12} md={12} xs={12} >
                                            <TextField
                                                value={mangaForm.fansub}
                                                onChange={(e) => setMangaForm({ ...mangaForm, fansub: e.target.value })}
                                                label="Fansub"
                                                fullWidth
                                            ></TextField>
                                        </Grid>
                                    </div>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                <Grid container sx={{ marginTop: '10px' }}>
                    <Grid item xs={12} md={12} sm={12}>
                        <Accordion>
                            <AccordionSummary
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                                expandIcon={<GridExpandMoreIcon />}>
                                <Typography>Bölüm Bilgileri</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <Button onClick={() => setEpisodeCountDialog(true)} variant='contained' sx={{ marginLeft: '15px' }}>
                                        Otomatik Bölüm Ekle
                                    </Button>
                                </Box>
                                <DataTable
                                    EnhancedTableToolbar={EnhancedTableToolbar}
                                    rows={mangaEpisodeService.map((item) => item.id.toString())}
                                    HeadCell={mangaEpisodesCells}
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
                                    goAddPage={() => {
                                        setAddRightDrawer(true);
                                    }}
                                    goEditPage={() => {

                                        setEditDialog(true);
                                    }}
                                    handleDelete={() => {
                                        setMangaEpisodeDeletes(true);
                                    }}
                                    tableName="Bölümler"
                                    tableBody={!loading && mangaEpisodeService.length != 0 &&
                                        <TableBody>
                                            {mangaEpisodeService
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
                                                            key={row.id}
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
                                                            <TableCell>{row.name}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
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
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Grid>
            <FullDialog extraData={
                <IconButton
                    onClick={() => setMangaEpisodeDelete(true)}
                    edge="start"
                    color="inherit"
                    aria-label="close"
                >
                    <Delete />
                </IconButton>
            } open={editDialog} handleClose={() => setEditDialog(false)}>
                <EditEpisode
                    handleCloseDialog={() => setEditDialog(false)}
                    handleUpdateEntity={(entity: MangaEpisodes) => {
                        setMangaEpisodeService(mangaEpisodeService.map((item) => item.id == entity.id ? entity : item));
                    }}
                    id={parseInt(selected[0])} />
            </FullDialog>
            <AddEpisodesRightDrawer mangaID={id as any} handleUpdateEpisode={(entity: MangaEpisodes) => { setMangaEpisodeService([...mangaEpisodeService, entity]) }} drawerState={addRightDrawer} handleCloseDrawer={() => setAddRightDrawer(false)} />
            <DeleteDialog
                open={mangaEpisodeDelete}
                handleClose={() => { setMangaEpisodeDelete(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        setMangaEpisodeService(mangaEpisodeService.filter((item) => item.id !== parseInt(selected[0])))
                        await deleteMangaEpisode(selected[0] as any);
                        setSelected([]);
                        setMangaEpisodeDelete(false);
                        setEditDialog(false);
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setMangaEpisodeDelete(false)
                    }}>
                        Kapat
                    </Button>
                }
            />
            <DeleteDialog
                open={mangaEpisodeDeletes}
                handleClose={() => { setMangaEpisodeDeletes(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteMangaEpisodes(selected.map((item) => parseInt(item)))
                            .then((res) => {

                            })
                            .catch((er) => {

                            })
                        setMangaEpisodeService(handleDeleteEpisodeItem());
                        setSelected([]);
                        setMangaEpisodeDeletes(false);
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setMangaEpisodeDeletes(false)
                    }}>
                        Kapat
                    </Button>
                }
            />
            <DeleteDialog
                open={mangaDelete}
                handleClose={() => { setMangaDelete(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteManga(id as any);
                        navigate("/manga");
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setMangaDelete(false)
                    }}>
                        Kapat
                    </Button>
                }
            />
            <Dialog fullWidth open={episodeCountDialog} onClose={() => setEpisodeCountDialog(false)}>
                <DialogTitle>Otomatik Bölüm Oluştur</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Aşağıya girdiğiniz değer aralığında bölüm eklenecektir.
                    </DialogContentText>
                    <TextField
                        onChange={(e) => setStartCount(e.target.value)}
                        value={startCount.toString()}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Başlangıç Sayısı"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={(e) => setEndCount(e.target.value)}
                        value={endCount.toString()}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Bitiş Sayısı"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        await addAutoMangaEpisodes(parseInt(startCount), parseInt(endCount), id as any)
                            .then((res) => {
                                if (res.data.count != 0) {
                                    setMangaEpisodeService(mangaEpisodeService.concat(res.data.list as any));
                                }
                            })
                        setEpisodeCountDialog(false);
                    }}>Oluştur</Button>
                </DialogActions>
            </Dialog>
            <ResultSnackbar
                props={{ anchorOrigin: { horizontal: 'center', vertical: 'bottom' }, autoHideDuration: 700 }}
                result={result} open={open} closeOpen={() => setOpen(false)} />
        </Loading>
    )
}
const AddEpisodesRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, mangaID: number, handleUpdateEpisode: (entity: MangaEpisodes) => void }) => {
    const [episodeForm, setEpisodeForm] = useState<MangaEpisodes>({ name: '', mangaID: props.mangaID, description: '' } as MangaEpisodes);
    const saveButon = async () => {
        await postMangaEpisodes(episodeForm)
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleUpdateEpisode(res.data.entity);
                    props.handleCloseDrawer();
                }
            })
            .catch((er) => {

            })
    }
    return (
        <Drawer
            sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
            anchor={'right'}
            open={props.drawerState}
            onClose={props.handleCloseDrawer}
        >
            <Box
                role="presentation"
                sx={{
                    marginTop: '30px'
                }}
            >
                <Grid container sx={{ padding: '0px 15px' }} >
                    <Grid item sm={12} md={12} xs={12}>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={episodeForm.name}
                                onChange={(e) => setEpisodeForm({ ...episodeForm, name: e.target.value })}
                                label="Bölüm Adı"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={episodeForm.description}
                                onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                                label="Bölüm Açıklaması"
                                fullWidth
                            ></TextField>
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
        </Drawer>
    )
}
const EditEpisode = (props: { id: number, handleUpdateEntity: (entity: MangaEpisodes) => void, handleCloseDialog: () => void }) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof MangaEpisodeContent>('contentOrder');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<MangaEpisodeContent>>([]);

    const [mangaEpisodeForm, setMangaEpisodeForm] = useState<MangaEpisodes>({ name: '', description: '', mangaID: props.id } as MangaEpisodes);
    const [editLoading, setEditLoading] = useState(true);

    const [editRightDrawer, setEditRightDrawer] = useState(false);
    const [addContentDrawer, setAddContentDrawer] = useState(false);

    const [mangaContentDeleteDialog, setMangaContentDeleteDialog] = useState(false);
    const [episodeCountDialog, setEpisodeCountDialog] = useState(false);
    const [startCount, setStartCount] = useState('');
    const [endCount, setEndCount] = useState('');
    useEffect(() => {
        loadMangaEpisode();
        loadMangaContentEpisode();
        return () => {
            setEditLoading(true);
        }
    }, [])
    const loadMangaEpisode = async () => {
        await getMangaEpisode(props.id)
            .then((res) => {
                if (res.data.isSuccessful) {
                    setMangaEpisodeForm(res.data.entity);
                }
            }).catch((er) => {

            })
        setEditLoading(false);
    }
    const loadMangaContentEpisode = async () => {
        await getMangaEpisodeContents(props.id).then((res) => {
            setServiceResponse(res.data.list);
        })
            .catch((er) => {
                console.log(er)
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
    const saveButon = async () => {
        await putMangaEpisodes(mangaEpisodeForm)
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleUpdateEntity(res.data.entity as MangaEpisodes);
                    props.handleCloseDialog();
                }
            })
            .catch((er) => {
                console.log(er);
            })
    }
    const handleDeleteContentItem = (array: Array<number>) => {
        var newData = Array<MangaEpisodeContent>();
        newData = serviceResponse.filter((item) => {
            var check = array.some((y) => y === item.id);
            if (check == false) {
                return item;
            }
        }) as Array<MangaEpisodeContent>;
        return newData;
    }
    return (
        <Loading loading={editLoading}>
            <Box
                sx={{ marginTop: '30px' }}
                role="presentation"
            >
                <Grid container sx={{ padding: '0px 15px' }} >
                    <Grid item sm={12} md={12} xs={12}>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={mangaEpisodeForm.name}
                                onChange={(e) => setMangaEpisodeForm({ ...mangaEpisodeForm, name: e.target.value })}
                                label="Bölüm Adı"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={mangaEpisodeForm.description}
                                onChange={(e) => setMangaEpisodeForm({ ...mangaEpisodeForm, description: e.target.value })}
                                multiline={true}
                                rows={4}
                                label="Bölüm Hakkında"
                                fullWidth
                            >
                            </TextField>
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
                <Grid container>

                    <DataTable
                        EnhancedTableToolbar={EnhancedTableToolbar}
                        rows={serviceResponse.map((item) => item.id.toString())}
                        HeadCell={mangaEpisodeContentCells}
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
                        goAddPage={() => {
                            setAddContentDrawer(true);
                        }}
                        goEditPage={() => {
                            setEditRightDrawer(true)
                        }}
                        handleDelete={() => {
                            setMangaContentDeleteDialog(true);
                        }}
                        extraData={
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Button onClick={() => setEpisodeCountDialog(true)} variant='contained' sx={{ marginLeft: '15px' }}>
                                    Otomatik Bölüm Ekle
                                </Button>
                            </Box>
                        }
                        tableName="İçerikler"
                        tableBody={!editLoading && serviceResponse.length != 0 &&
                            <TableBody>
                                {serviceResponse
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
                                                key={row.id}
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
                                                        src={row.contentImage}
                                                        srcSet={row.contentImage}
                                                        alt={"Manga"}
                                                        loading="lazy"
                                                    />
                                                </TableCell>
                                                <TableCell>{row.description !== null && row.description.length !== 0 && row.description}</TableCell>
                                                <TableCell>{row.contentOrder}</TableCell>
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
                </Grid>
            </Box>
            <Dialog fullWidth open={episodeCountDialog} onClose={() => setEpisodeCountDialog(false)}>
                <DialogTitle>Otomatik İçerik Oluştur</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Aşağıya girdiğiniz değer aralığında içerik eklenecektir.
                    </DialogContentText>
                    <TextField
                        onChange={(e) => setStartCount(e.target.value)}
                        value={startCount.toString()}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Başlangıç Sayısı"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        onChange={(e) => setEndCount(e.target.value)}
                        value={endCount.toString()}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Bitiş Sayısı"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={async () => {
                        await addAutoMangaEpisodeContents(parseInt(startCount), parseInt(endCount), props.id as any)
                            .then((res) => {
                                if (res.data.count != 0) {
                                    setServiceResponse(serviceResponse.concat(res.data.list as any));
                                }
                            })
                        setEpisodeCountDialog(false);
                    }}>Oluştur</Button>
                </DialogActions>
            </Dialog>
            <AddEpisodesContentRightDrawer
                episodeID={props.id}
                handleUpdateEpisode={(entity: MangaEpisodeContent) => {
                    setServiceResponse([...serviceResponse, entity])
                }}
                drawerState={addContentDrawer}
                handleCloseDrawer={() => setAddContentDrawer(false)} />
            {editRightDrawer && <EditEpisodesContentRightDrawer
                episodeID={props.id} id={parseInt(selected[0])}
                handleUpdateEpisode={(entity: MangaEpisodeContent) => {
                    setServiceResponse(serviceResponse.map((item) => item.id == entity.id ? entity : item))
                }}
                drawerState={editRightDrawer}
                handleCloseDrawer={() => setEditRightDrawer(false)} />}
            <DeleteDialog
                open={mangaContentDeleteDialog}
                handleClose={() => { setMangaContentDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        selected.map(async (item) => {
                            var toConvertInt = selected.map((item) => parseInt(item));
                            await deleteMangaEpisodeContents(toConvertInt).then((res) => {
                                setServiceResponse(handleDeleteContentItem(toConvertInt));
                            });
                        })
                        setSelected([]);
                        setMangaContentDeleteDialog(false);
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => setMangaContentDeleteDialog(false)}>
                        Kapat
                    </Button>
                }
            />
        </Loading>
    )
}
const AddEpisodesContentRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, episodeID: number, handleUpdateEpisode: (entity: MangaEpisodeContent) => void }) => {
    const [episodeForm, setEpisodeForm] = useState<MangaEpisodeContent>({ description: '', episodeID: props.episodeID, contentOrder: 1 } as MangaEpisodeContent);
    const [selectedImage, setSelectedImage] = useState('');
    const [form, setForm] = useState<FormData>(new FormData());
    const saveButon = async () => {
        await postMangaContentEpisode(episodeForm)
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleUpdateEpisode(res.data.entity);
                    props.handleCloseDrawer();
                }
            }).catch((er) => {

            })
    }
    return (
        <Drawer
            sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
            anchor={'right'}
            open={props.drawerState}
            onClose={props.handleCloseDrawer}
        >
            <Box
                role="presentation"
                sx={{
                    marginTop: '30px'
                }}
            >
                <Grid container sx={{ padding: '0px 15px' }} >
                    <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex', }} sm={12} md={12} xs={12}>
                        {selectedImage.length != 0 && <IconButton onClick={() => {
                            setSelectedImage('')
                            setEpisodeForm({ ...episodeForm, contentImage: '' })
                        }} sx={{ position: 'absolute' }}>
                            <Delete />
                        </IconButton>}
                        {/* {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                            <input onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    var formData = new FormData();
                                    formData.append("img", e.target.files[0] as any);
                                    setForm(formData);
                                    setSelectedImage(URL.createObjectURL(e.target.files[0]))
                                }
                            }}
                                hidden accept="image/*" type="file" />
                            <PhotoCamera />
                        </IconButton>} */}
                        {selectedImage.length != 0 && <img src={selectedImage} style={{ height: '125px', width: '125px' }} />}
                    </Grid>
                    <Grid item sm={12} md={12} xs={12}>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={episodeForm.contentImage}
                                onChange={(e) => {
                                    setEpisodeForm({ ...episodeForm, contentImage: e.target.value })
                                    setSelectedImage(e.target.value);
                                }}
                                label="Embed Link"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                rows={4}
                                multiline
                                value={episodeForm.description}
                                onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                                label="İçerik Açıklaması"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                type={"number"}
                                value={episodeForm.contentOrder}
                                onChange={(e) => setEpisodeForm({ ...episodeForm, contentOrder: parseInt(e.target.value) })}
                                label="İçerik Sırası"
                                fullWidth
                            ></TextField>
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
        </Drawer>
    )
}
const EditEpisodesContentRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, id: number, episodeID: number, handleUpdateEpisode: (entity: MangaEpisodeContent) => void }) => {
    const [episodeForm, setEpisodeForm] = useState<MangaEpisodeContent>({ description: '', episodeID: props.episodeID, contentOrder: 1 } as MangaEpisodeContent);
    const [selectedImage, setSelectedImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>(new FormData());
    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        await getMangaEpisodeContent(props.id)
            .then((res) => {
                if (res.data.isSuccessful) {
                    setEpisodeForm(res.data.entity);
                    setSelectedImage(res.data.entity.contentImage != null ? res.data.entity.contentImage : "");
                }
            }).catch((er) => {
                console.log(er);
            })
        setLoading(false);
    }
    const saveButon = async () => {
        await putMangaContentEpisode(episodeForm)
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleUpdateEpisode(res.data.entity);
                    props.handleCloseDrawer();
                }
            }).catch((er) => {

            })
    }
    console.log(selectedImage)
    return (
        <Loading loading={loading}>
            <Drawer
                sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
                anchor={'right'}
                open={props.drawerState}
                onClose={props.handleCloseDrawer}
            >
                <Box
                    role="presentation"
                    sx={{
                        marginTop: '30px'
                    }}
                >
                    <Grid container sx={{ padding: '0px 15px' }} >
                        <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex', }} sm={12} md={12} xs={12}>
                            {selectedImage.length != 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute' }}>
                                <Delete />
                            </IconButton>}
                            {/* {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                                <input onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        var formData = new FormData();
                                        formData.append("img", e.target.files[0] as any);
                                        setFormData(formData);
                                        setSelectedImage(URL.createObjectURL(e.target.files[0]))
                                    }
                                }}
                                    hidden accept="image/*" type="file" />
                                <PhotoCamera />
                            </IconButton>} */}
                            {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '125px', width: '125px' }} />}
                        </Grid>
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={episodeForm.contentImage}
                                    onChange={(e) => {
                                        setEpisodeForm({ ...episodeForm, contentImage: e.target.value })
                                        setSelectedImage(e.target.value);
                                    }}
                                    label="Embed Link"
                                    fullWidth
                                ></TextField>
                            </Box>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    rows={4}
                                    multiline
                                    value={episodeForm.description}
                                    onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                                    label="İçerik Açıklaması"
                                    fullWidth
                                ></TextField>
                            </Box>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    type={"number"}
                                    value={episodeForm.contentOrder}
                                    onChange={(e) => setEpisodeForm({ ...episodeForm, contentOrder: parseInt(e.target.value) })}
                                    label="İçerik Sırası"
                                    fullWidth
                                ></TextField>
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
            </Drawer>
        </Loading>
    )
}
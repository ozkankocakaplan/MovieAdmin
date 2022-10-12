import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Autocomplete, Box, Button, Checkbox, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';
import { Anime, Categories, CategoryType, Manga, MangaEpisodeContent, MangaEpisodes, Status, Type } from '../../types/Entites';
import { deleteManga, deleteMangaEpisode, deleteMangaEpisodeContent, deleteMangaEpisodes, getAnimes, getCategories, getCategoryTypes, getMangaByID, getMangaEpisode, getMangaEpisodeContent, getMangaEpisodeContents, getMangaEpisodes, postMangaContentEpisode, postMangaEpisodes, putCategoryType, putManga, putMangaContentEpisode, putMangaEpisodes } from '../../utils/api';
import DataTable, { EnhancedTableToolbarProps } from '../../components/DataTable';
import { Order } from '../../components/TableHelper';
import { Add, Delete, Edit, PhotoCamera } from '@mui/icons-material';
import { mangaEpisodeContentCells, mangaEpisodesCells } from '../../utils/HeadCells';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import FullDialog from '../../components/FullDialog';
import DeleteDialog from '../../components/DeleteDialog';
import { AxiosError } from 'axios';
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};
interface SelectedAnime extends Anime {
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
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);


    const [addRightDrawer, setAddRightDrawer] = useState(false);

    const [editDialog, setEditDialog] = useState(false);


    const [mangaForm, setMangaForm] = useState<Manga>({ name: '', description: '', arrangement: '', ageLimit: '', status: Status.Continues } as Manga);
    const [mangaStatus, setMangaStatus] = useState(Status.Continues);

    const [mangaEpisodeService, setMangaEpisodeService] = useState<Array<MangaEpisodes>>([]);

    const [mangaEpisodeDelete, setMangaEpisodeDelete] = useState(false);

    const [mangaEpisodeDeletes, setMangaEpisodeDeletes] = useState(false);
    const [mangaDelete, setMangaDelete] = useState(false);


    const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);

    const [animeListService, setAnimeList] = useState<Array<Anime>>([]);

    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        var check = animeListService.find((y) => y.id === mangaForm.animeID);
        if (check != null) {
            setSelectedAnime({ ...check, firstLetter: mangaForm.name[0].toUpperCase() });
        }
    }, [animeListService])

    const loadData = async () => {
        await loadMangaInfo();
        await loadAnime();
        await loadCategories();
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
                        setSelectedCategories(response.data.list.map((item) => {
                            if (res.data.list.length != 0) {
                                var check = res.data.list.find((x) => x.id === item.categoryID);
                                if (check != null) {
                                    return check.name;
                                }
                            }
                            return "";
                        }))
                        setSelectedCategoriesID(response.data.list.map((i) => i.categoryID as any));
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
                setMangaForm(res.data.entity as Manga);
            }
            else {
                navigate("/dashboard")
            }
        }).catch((er) => {
            console.log(er);
        })
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
    const updateButon = async () => {
        if (selectedAnime != null) {
            await putManga({ ...mangaForm, animeID: selectedAnime.id });
            await putCategoryType(convertCategoryType());
            window.location.reload();
        }

    }
    const convertCategoryType = () => {
        var newArray = Array<CategoryType>();
        selectedCategoriesID.map((item) => {
            newArray.push({ categoryID: item, type: Type.Manga, contentID: id as any } as CategoryType);
        })
        return newArray;
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
    const animeList = animeListService.map((option) => {
        const firstLetter = option.animeName[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });
    const defaultAnimeProps = {
        options: animeListService,
        getOptionLabel: (option: Anime) => option.animeName,
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
                        <Button onClick={() => setMangaDelete(true)} sx={{ marginLeft: '10px' }} variant='outlined' startIcon={<Delete />}>
                            Sil
                        </Button>
                    </Toolbar>
                </Paper>
                <Grid container>
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
                                                    {...defaultAnimeProps}
                                                    value={selectedAnime}
                                                    onChange={(event: any, newValue: Anime | null) => {
                                                        if (newValue != null) {
                                                            setSelectedAnime(newValue as any)
                                                        }
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.animeName === value.animeName}
                                                    id="grouped-demo"
                                                    options={animeList.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                                    groupBy={(option) => option.firstLetter}
                                                    getOptionLabel={(option) => option.animeName}
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
                                                        categoriesServiceResponse != null && categoriesServiceResponse.length != 0 &&
                                                        categoriesServiceResponse.map((item, index) => {
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
                                        <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '10px' }} >
                                            <Button onClick={updateButon} variant='contained' fullWidth>
                                                Kaydet
                                            </Button>
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
                                                        src={`https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format`}
                                                        srcSet={`https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                        alt={"deneme"}
                                                        loading="lazy"
                                                    />
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
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
                        await deleteMangaEpisodeContent(props.id)
                            .then((res) => {
                                setServiceResponse(handleDeleteContentItem(res.data.list));

                            }).catch((er) => {
                                console.log(er)
                            });
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
                        {selectedImage.length != 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute' }}>
                            <Delete />
                        </IconButton>}
                        {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                            <input onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
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
                            {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                                <input onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
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
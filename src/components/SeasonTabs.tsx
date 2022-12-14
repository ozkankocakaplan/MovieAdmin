import React, { useEffect, useState } from 'react'
import { Add, Delete, Edit } from '@mui/icons-material';
import { alpha, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, Grid, IconButton, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DataTable, { EnhancedTableToolbarProps } from './DataTable';
import { Order } from './TableHelper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AnimeEpisodes, AnimeSeason, AnimeSeasonMusic } from '../types/Entites';
import { deleteAnimeEpisode, deleteAnimeSeason, deleteAnimeSeasonMusic, getAnimeEpisodesBySeasonID, getAnimeSeason, getAnimeSeasonMusic, getAnimeSeasonMusics, postAnimeSeasonMusic, putAnimeSeason, putAnimeSeasonMusic } from '../utils/api';
import { animeEpisodesCells, seasonMusicCells } from '../utils/HeadCells';
import DeleteDialog from './DeleteDialog';
import FullDialog from './FullDialog';
import Loading from './Loading';
import { AxiosError } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAnimeEpisodes } from '../store/features/episodeReducers';
import { setAnimeSeasons } from '../store/features/seasonReducers';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ISeasonTabsProps {
    tabsHeader: Array<AnimeSeason>,
    addShowDrawer?: (data: number) => void,
    editShowDrawer?: (data: number, seasonID: number) => void,
    deleteShowModal?: () => void,
    addEpisodeCountModal: () => void
}
const SeasonTabs = (props: ISeasonTabsProps) => {
    const [tabsHeader, setTabsHeader] = useState<Array<AnimeSeason>>([]);

    const [value, setValue] = React.useState(0);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AnimeSeason>('seasonName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const dispatch = useDispatch();

    const [seasonEditDialog, setSeasonEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteSeasonDialog, setDeleteSeasonDialog] = useState(false);

    const { animeEpisodes } = useSelector((x: RootState) => x.episodeReducers);
    const { animeSeasons } = useSelector((x: RootState) => x.seasonReducers);

    useEffect(() => {
        setTabsHeader(props.tabsHeader);
        if (props.tabsHeader.length != 0) {
            loadAnimeEpisodesBySeasonID();
        }
    }, [value]);
    useEffect(() => {
        setTabsHeader(props.tabsHeader);
    }, [animeSeasons])

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - animeEpisodes.length) : 0;
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
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const loadAnimeEpisodesBySeasonID = async () => {
        await getAnimeEpisodesBySeasonID(props.tabsHeader[value].id)
            .then((res) => {
                dispatch(setAnimeEpisodes(res.data.list));
            }).catch((er) => {
                console.log(er);
            });
        setLoading(false);
    }
    const handleDeleteItem = () => {
        setSelected([]);
        var newData = Array<AnimeEpisodes>();
        newData = animeEpisodes.filter((item) => {
            var check = selected.some((y) => parseInt(y) === item.id);
            if (check == false) {
                return item;
            }
        }) as Array<AnimeEpisodes>;
        return newData;
    }
    const handleDeleteSeasonItem = () => {
        var newData = Array<AnimeSeason>();
        newData = tabsHeader.filter((item) => {
            if (item.id !== props.tabsHeader[value].id) {
                return item;
            }
        }) as Array<AnimeSeason>;
        return newData;
    }


    return (
        <Loading loading={loading}>
            {tabsHeader != null && props.tabsHeader.length != 0 && <Grid item sm={12} xs={12} md={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', '& .MuiBox-root ': { padding: 0 } }}>
                    <Tabs
                        sx={{ width: '100%' }}
                        value={value} onChange={handleChange} aria-label="basic tabs example">
                        {
                            tabsHeader.map((item, index) => {
                                return <Tab key={index} label={item.seasonName} {...a11yProps(index)} />
                            })
                        }
                    </Tabs>
                </Box>

                {
                    tabsHeader.map((item, index) => {
                        return <TabPanel key={index} value={value} index={index}>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Button onClick={() => props.addEpisodeCountModal()} variant='contained' sx={{ marginLeft: '15px' }}>
                                    Otomatik Bölüm Ekle
                                </Button>
                                <Button onClick={() => setSeasonEditDialog(true)} variant='contained'>
                                    {item.seasonName} düzenle
                                </Button>
                            </Box>
                            <DataTable
                                EnhancedTableToolbar={EnhancedTableToolbar}
                                rows={animeEpisodes.map((item) => item.id.toString())}
                                HeadCell={animeEpisodesCells}
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
                                    if (props.addShowDrawer != undefined) {
                                        props.addShowDrawer(props.tabsHeader[value].id);
                                    }
                                }}
                                goEditPage={() => {
                                    if (props.editShowDrawer != undefined) {
                                        props.editShowDrawer(parseInt(selected[0]), props.tabsHeader[value].id);
                                    }
                                }}
                                handleDelete={() => {
                                    setDeleteDialog(true);
                                }}
                                tableName="Bölümler"
                                tableBody={!loading && animeEpisodes.length != 0 &&
                                    <TableBody>
                                        {animeEpisodes
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
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.episodeName}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.episodeDescription}
                                                        </TableCell>
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
                        </TabPanel>
                    })
                }
                <DeleteDialog
                    open={deleteDialog}
                    handleClose={() => { setDeleteDialog(false) }}
                    dialogTitle={"Silmek istiyor musunuz"}
                    dialogContentText={"Bu işlem geri alınamaz"}
                    yesButon={
                        <Button onClick={async () => {
                            await deleteAnimeEpisode(selected.map((item) => parseInt(item))).then((res) => {
                                dispatch(setAnimeEpisodes(handleDeleteItem()));
                            }).catch((er) => {

                            });
                            setDeleteDialog(false);
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
                <FullDialog extraData={
                    <IconButton
                        onClick={() => setDeleteSeasonDialog(true)}
                        edge="start"
                        color="inherit"
                        aria-label="close"
                    >
                        <Delete />
                    </IconButton>
                } open={seasonEditDialog} handleClose={() => setSeasonEditDialog(false)}>
                    <EditSeason
                        handleUpdateEntity={(entity: AnimeSeason) => {
                            setTabsHeader(tabsHeader.map((item) => item.id == entity.id ? entity : item));
                        }}
                        id={props.tabsHeader[value].id}
                        handleCloseDialog={() => setSeasonEditDialog(false)}
                    />
                    <DeleteDialog
                        open={deleteSeasonDialog}
                        handleClose={() => { setDeleteSeasonDialog(false) }}
                        dialogTitle={"Silmek istiyor musunuz"}
                        dialogContentText={"Bu işlem geri alınamaz"}
                        yesButon={
                            <Button onClick={async () => {
                                setValue(0);
                                dispatch(setAnimeSeasons(handleDeleteSeasonItem()));
                                await deleteAnimeSeason(props.tabsHeader[value].id).then((res) => {
                                    setTabsHeader(handleDeleteSeasonItem());
                                    dispatch(setAnimeSeasons(handleDeleteSeasonItem()))
                                })
                                    .catch((er) => {

                                    })
                                setDeleteSeasonDialog(false);
                                setSeasonEditDialog(false);
                            }}>
                                Sil
                            </Button>
                        }
                        noButon={
                            <Button onClick={() => setDeleteSeasonDialog(false)}>
                                Kapat
                            </Button>
                        }
                    />
                </FullDialog>

            </Grid>}
        </Loading>

    );
}
export default SeasonTabs;
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const EditSeason = (props: { id: number, handleCloseDialog: () => void, handleUpdateEntity: (entity: AnimeSeason) => void }) => {
    const [seasonForm, setSeasonForm] = useState({ seasonName: '' } as AnimeSeason);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AnimeSeason>('seasonName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [animeSeasonService, setAnimeSeasonService] = useState<Array<AnimeSeasonMusic>>([]);

    const [addRightMusic, setAddRightMusic] = useState(false);
    const [editRightMusic, setEditRightMusic] = useState(false);

    const [selectedSeasonMusic, setSelectedSeasonMusic] = useState<number>(0);

    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        loadData();
    }, [props.id])

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - animeSeasonService.length) : 0;
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
    const loadData = async () => {
        await loadSeason();
        await loadSeasonMusic();
        setLoading(false);
    }
    const loadSeason = async () => {
        await getAnimeSeason(props.id)
            .then((res) => {
                if (res.data.isSuccessful) {
                    setSeasonForm(res.data.entity);
                }
            }).catch((er: AxiosError) => {
                console.log(er)
            })
    }
    const loadSeasonMusic = async () => {
        await getAnimeSeasonMusics(props.id)
            .then((res) => {
                if (res.data.isSuccessful) {
                    setAnimeSeasonService(res.data.list);
                }

            }).catch((er: AxiosError) => {

            })
    }
    const saveButon = async () => {
        await putAnimeSeason(seasonForm).then((res) => {
            if (res.data.isSuccessful) {
                props.handleUpdateEntity(res.data.entity);
                props.handleCloseDialog();
            }

        }).catch((er) => {
            console.log(er);
        })
    }
    const handleDeleteItem = () => {
        setSelected([]);
        var newData = Array<AnimeSeasonMusic>();
        newData = animeSeasonService.filter((item) => {
            var check = selected.some((y) => parseInt(y) === item.id);
            if (check == false) {
                return item;
            }
        }) as Array<AnimeSeasonMusic>;
        return newData;
    }
    return (
        <Loading loading={loading}>
            <Grid sx={{
                marginTop: '30px'
            }}
                item sm={12} md={12} xs={12}>
                <Grid container sx={{ padding: '0px 15px' }} >
                    <Grid item sm={12} md={12} xs={12}>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={seasonForm.seasonName}
                                onChange={(e) => setSeasonForm({ ...seasonForm, seasonName: e.target.value })}
                                label="Sezon Adı"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
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
                        rows={animeSeasonService.map((item) => item.id.toString())}
                        HeadCell={seasonMusicCells}
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
                            setAddRightMusic(true);
                        }}
                        goEditPage={() => {
                            setEditRightMusic(true);
                            setSelectedSeasonMusic(parseInt(selected[0]))
                        }}
                        handleDelete={() => {
                            setDeleteDialog(true);
                        }}
                        tableName="Müzikler"
                        tableBody={!loading && animeSeasonService.length != 0 &&
                            <TableBody>
                                {animeSeasonService
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
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.musicName}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.musicUrl}
                                                </TableCell>
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
                <AddAnimeSeasonMusicRightDrawer handleAddSeasonMusic={(entity: AnimeSeasonMusic) => { setAnimeSeasonService([...animeSeasonService, entity]) }} seasonID={props.id} drawerState={addRightMusic} handleCloseDrawer={() => setAddRightMusic(false)} />
                <EditAnimeSeasonMusicRightDrawer
                    handleUpdateSeasonMusic={(entity: AnimeSeasonMusic) => {
                        setAnimeSeasonService(animeSeasonService.map((item) => item.id == entity.id ? entity : item))
                    }}
                    id={selectedSeasonMusic}
                    drawerState={editRightMusic}
                    handleCloseDrawer={() => setEditRightMusic(false)} />
            </Grid>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteAnimeSeasonMusic(selected.map((i) => parseInt(i)))
                            .then((res) => {
                                setAnimeSeasonService(handleDeleteItem());
                            })
                            .catch((er) => {
                                console.log(er)
                            })
                        setDeleteDialog(false);
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
        </Loading>
    )
}

const AddAnimeSeasonMusicRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, seasonID: number, handleAddSeasonMusic: (entity: AnimeSeasonMusic) => void }) => {
    const [seasonMusicForm, setSeasonMusicForm] = useState<AnimeSeasonMusic>({ musicName: '', musicUrl: '' } as AnimeSeasonMusic);
    const saveButon = async () => {
        await postAnimeSeasonMusic({ ...seasonMusicForm, seasonID: props.seasonID })
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleAddSeasonMusic(res.data.entity);
                    props.handleCloseDrawer();
                }
            }).catch((er: AxiosError) => {
                console.log(er);
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
                                value={seasonMusicForm.musicName}
                                onChange={(e) => setSeasonMusicForm({ ...seasonMusicForm, musicName: e.target.value })}
                                label="Müzik Adı"
                                fullWidth
                            ></TextField>
                        </Box>
                        <Box
                            sx={{
                                marginTop: '10px',
                                maxWidth: '100%',
                            }}>
                            <TextField
                                value={seasonMusicForm.musicUrl}
                                onChange={(e) => setSeasonMusicForm({ ...seasonMusicForm, musicUrl: e.target.value })}
                                label="Embed Linki"
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
const EditAnimeSeasonMusicRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, id: number, handleUpdateSeasonMusic: (entity: AnimeSeasonMusic) => void }) => {
    const [loading, setLoading] = useState(true);
    const [seasonMusicForm, setSeasonMusicForm] = useState<AnimeSeasonMusic>({ musicName: '', musicUrl: '' } as AnimeSeasonMusic);
    useEffect(() => {
        if (props.id !== 0) {
            loadAnimeSeasonMusic();
        }
        else {
            setLoading(false);
        }
        return () => {
            setLoading(true);
        }
    }, [props.id])

    const loadAnimeSeasonMusic = async () => {
        await getAnimeSeasonMusic(props.id).then((res) => {
            if (res.data.isSuccessful) {
                setSeasonMusicForm(res.data.entity);
            }
        }).catch((er: AxiosError) => {
            console.log(er);
        });
        setLoading(false);
    }
    const saveButon = async () => {
        await putAnimeSeasonMusic(seasonMusicForm)
            .then((res) => {
                if (res.data.isSuccessful) {
                    props.handleUpdateSeasonMusic(res.data.entity);
                    props.handleCloseDrawer();
                }
            }).catch((er: AxiosError) => {
                console.log(er);
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
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={seasonMusicForm.musicName}
                                    onChange={(e) => setSeasonMusicForm({ ...seasonMusicForm, musicName: e.target.value })}
                                    label="Müzik Adı"
                                    fullWidth
                                ></TextField>
                            </Box>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={seasonMusicForm.musicUrl}
                                    onChange={(e) => setSeasonMusicForm({ ...seasonMusicForm, musicUrl: e.target.value })}
                                    label="Müzik Url"
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

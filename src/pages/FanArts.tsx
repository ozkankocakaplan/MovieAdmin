import React, { useEffect, useRef, useState } from 'react'
import { alpha, Autocomplete, AutocompleteProps, Button, Checkbox, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import Loading from '../components/Loading'
import { Anime, FanArt, FanArtModels, Manga, Review, ReviewsModels, Type, Users } from '../types/Entites';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { Add, Delete, Edit, PhotoCamera } from '@mui/icons-material';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import { fanArtCells } from '../utils/HeadCells';
import FullDialog from '../components/FullDialog';
import { Box } from '@mui/system';
import { baseUrl, deleteFanArt, deleteReview, getPaginatedFanArtNoType, getPaginatedReviewsNoType, getSearchAnimes, getSearchDetailsMangas, getSearchDetailsUser, postFanArt } from '../utils/api';
import DeleteDialog from '../components/DeleteDialog';

export default function FanArts() {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof FanArt>('id');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<FanArtModels>>([]);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [addFanArtDialog, setAddFanArtDialog] = useState(false);
    //#region 
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
                {numSelected == 1 &&
                    <Tooltip title="Sil">
                        <IconButton onClick={props.handleDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
        );
    };
    //#endregion
    useEffect(() => {
        setLoading(true);
        loadData();
    }, [rowsPerPage, page])

    const loadData = async () => {
        await getPaginatedFanArtNoType(page + 1, rowsPerPage).then((res) => {
            setServiceResponse(res.data.list);
        }).catch((er) => {
            console.log(er)
        });
        setLoading(false);
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={fanArtCells}
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
                            goAddPage={() => { setAddFanArtDialog(true) }}
                            goEditPage={() => { }}
                            handleDelete={() => { setDeleteDialog(true) }}
                            tableName="FanArt"
                            tableBody={
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
                                                            src={row.image}
                                                            srcSet={row.image}
                                                            alt={row.description}
                                                            loading="lazy"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.users.userName}</TableCell>
                                                    <TableCell>{
                                                        row.type === Type.Anime ? row.anime.animeName : row.manga.name
                                                    }</TableCell>
                                                    <TableCell>{row.type === Type.Anime ? "Anime" : "Manga"}</TableCell>
                                                    <TableCell>{row.description.substring(0, 20)} ...</TableCell>

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
            <Reviews />
            <FullDialog open={addFanArtDialog} handleClose={() => { setAddFanArtDialog(false) }}>
                <AddFanArtDialog />
            </FullDialog>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteFanArt(parseInt(selected[0]));
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
        </Loading>
    )
}
function Reviews() {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Review>('id');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<ReviewsModels>>([]);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [addFanArtDialog, setAddFanArtDialog] = useState(false);
    //#region 
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
                {numSelected == 1 &&
                    <Tooltip title="Sil">
                        <IconButton onClick={props.handleDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
        );
    };
    //#endregion
    useEffect(() => {
        setLoading(true);
        loadData();
    }, [rowsPerPage, page])

    const loadData = async () => {
        await getPaginatedReviewsNoType(page + 1, rowsPerPage).then((res) => {
            console.log(res.data);
            setServiceResponse(res.data.list);
        }).catch((er) => {
            console.log(er)
        });
        setLoading(false);
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={fanArtCells}
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
                            goAddPage={() => { setAddFanArtDialog(true) }}
                            goEditPage={() => { }}
                            handleDelete={() => { setDeleteDialog(true) }}
                            tableName="Eleştiriler"
                            tableBody={
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
                                                            src={row.anime != null ? row.anime.img : row.manga.image}
                                                            srcSet={row.anime != null ? row.anime.img : row.manga.image}
                                                            alt={row.anime != null ? row.anime.animeName : row.manga.name}
                                                            loading="lazy"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.user.userName}</TableCell>
                                                    <TableCell>{
                                                        row.type === Type.Anime ? row.anime.animeName : row.manga.name
                                                    }</TableCell>
                                                    <TableCell>{row.type === Type.Anime ? "Anime" : "Manga"}</TableCell>
                                                    <TableCell>{row.message.substring(0, 20)} ...</TableCell>

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
            <FullDialog open={addFanArtDialog} handleClose={() => { setAddFanArtDialog(false) }}>
                <AddFanArtDialog />
            </FullDialog>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteReview(parseInt(selected[0]));
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
        </Loading>
    )
}
const AddFanArtDialog = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const [formData, setFormData] = useState<FormData>(new FormData());

    const [form, setForm] = useState<FanArt>({ userID: 0, contentID: 0, image: '', description: '', type: Type.FanArt } as FanArt);


    const [type, setType] = useState(0);

    const [usersList, setUsersList] = useState<Array<Users>>([]);
    const [animeList, setAnimeList] = useState<Array<Anime>>([]);
    const [mangaList, setMangaList] = useState<Array<Manga>>([]);
    useEffect(() => {
        setAnimeList([]);
        setMangaList([]);
    }, [type])

    const saveButon = async () => {
        await postFanArt(form, formData);
        window.location.reload();
    }
    return (
        <Grid container sx={{ padding: '0px 15px' }} >
            <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
                {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute', background: '#33333380', zIndex: 200 }}>
                    <Delete sx={{ color: '#fff' }} />
                </IconButton>}
                {/* {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                    <input onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                            formData.append("img", e.target.files[0] as any);
                            setSelectedImage(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                        hidden accept="image/*" type="file" />
                    <PhotoCamera />
                </IconButton>} */}
                {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '500px' }} />}
            </Grid>
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    <Autocomplete
                        onChange={(event: any, newValue: Users | null) => {
                            if (newValue != null) {
                                setForm({ ...form, userID: newValue.id })
                            }
                        }}
                        isOptionEqualToValue={(option, value) => option.userName === value.userName}
                        options={usersList}
                        noOptionsText={"Kullanıcı Bulunamadı"}
                        getOptionLabel={(option) => option.userName}
                        renderInput={(params) => <TextField
                            onChange={async (e) => {
                                if (e.target.value.length >= 2) {
                                    await getSearchDetailsUser(e.target.value).then((res) => {
                                        setUsersList(res.data.list);
                                    })
                                }
                                else {
                                    setUsersList([])
                                }
                            }}
                            {...params} label="Kullanıcı" />}
                    />
                </Box>
            </Grid>
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    <TextField
                        value={form.image}
                        onChange={(e) => {
                            setForm({ ...form, image: e.target.value });
                            setSelectedImage(e.target.value);
                        }}
                        label="Görsel Embed Link"
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
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    {
                        type === 0 ?
                            <Autocomplete
                                onChange={(event: any, newValue: Anime | null) => {
                                    if (newValue != null) {
                                        setForm({ ...form, contentID: newValue.id, type: Type.Anime })
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.animeName === value.animeName}
                                getOptionLabel={(option) => option.animeName}
                                options={animeList}
                                noOptionsText={"Anime Bulunamadı"}
                                renderInput={(params) => <TextField {...params}
                                    onChange={async (e) => {
                                        if (e.target.value.length >= 2) {
                                            await getSearchAnimes(e.target.value).then((res) => {
                                                setAnimeList(res.data.list);
                                            })
                                        }
                                        else {
                                            setAnimeList([]);
                                        }

                                    }}
                                    label="Anime" />}
                            />
                            : <Autocomplete
                                onChange={(event: any, newValue: Manga | null) => {
                                    if (newValue != null) {
                                        setForm({ ...form, contentID: newValue.id, type: Type.Manga })
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                getOptionLabel={(option) => option.name}
                                options={mangaList}
                                noOptionsText={"Manga Bulunamadı"}
                                renderInput={(params) => <TextField {...params}
                                    onChange={async (e) => {
                                        if (e.target.value.length >= 2) {
                                            await getSearchDetailsMangas(e.target.value).then((res) => {
                                                setMangaList(res.data.list);
                                            });
                                        }
                                        else {
                                            setMangaList([]);
                                        }

                                    }}
                                    label="Manga" />}
                            />
                    }
                </Box>
            </Grid>
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    <TextField
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        multiline={true}
                        rows={5}
                        label="Açıklama"
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
    )
}
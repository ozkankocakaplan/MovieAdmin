import React, { useEffect, useState } from 'react'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import { alpha, Button, Grid, IconButton, Paper, Toolbar, Tooltip, Typography } from '@mui/material';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { useNavigate } from 'react-router';
import { animeCells, movieTheWeekCells } from '../utils/HeadCells';
import { Anime as Animes, MovieTheWeek, MovieTheWeekModels, Status, Type } from '../types/Entites';
import { addMovieTheWeeks, baseUrl, deleteAnimes, deleteMovieTheWeeks, getMovieTheWeeks, getPaginatedAnime } from '../utils/api';
import Loading from '../components/Loading';
import { Add, Delete, Edit } from '@mui/icons-material';
import DeleteDialog from '../components/DeleteDialog';
import { useAuth } from '../hooks/useAuth';
export default function Anime() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Animes>('animeName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<Animes>>([]);
    const [loading, setLoading] = useState(true);

    const [deleteAnimeDialog, setDeleteAnimeDialog] = useState(false);
    useEffect(() => {
        loadAnime();
        return () => {
            setLoading(true);
        }
    }, [])
    const loadAnime = async () => {
        await getPaginatedAnime(page + 1, rowsPerPage).then((res) => {
            if (res.data.hasExceptionError == false && res.data.exceptionMessage == null) {
                setServiceResponse(res.data.list);
            }
            else {
                console.log(res.data.exceptionMessage)
            }
        })
            .catch((er) => {
                console.log(er)
            });
        setLoading(false);
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
                        <Tooltip title="Haftanın Animesine Ekle">
                            <IconButton onClick={saveButon}>
                                <Add />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                            <IconButton onClick={() => {
                                setDeleteAnimeDialog(true);
                            }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
    const saveButon = async () => {
        var newArray = new Array<MovieTheWeek>();
        selected.map((item) => {
            newArray.push({ contentID: parseInt(item), type: Type.Anime, description: '', userID: user.id } as MovieTheWeek);
        });
        await addMovieTheWeeks(newArray);
        window.location.reload();
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={animeCells}
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
                            goAddPage={() => navigate("/anime/add")}
                            goEditPage={() => navigate("/anime/" + selected[0])}
                            handleDelete={() => { console.log("delete") }}
                            tableName="Animeler"
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
                                                    key={row.seoUrl}
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
                                                        {row.img !== null && row.img.length !== 0 && <img
                                                            style={{ height: '60px', width: '60px' }}
                                                            src={row.img}
                                                            srcSet={row.img}
                                                            alt={row.animeName}
                                                            loading="lazy"
                                                        />}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {row.animeName}
                                                    </TableCell>
                                                    <TableCell padding='none' >{row.malRating}</TableCell>
                                                    <TableCell padding='none'>{row.ageLimit}</TableCell>
                                                    <TableCell padding='none'>{row.seasonCount}</TableCell>
                                                    <TableCell padding='none'>{
                                                        row.status === Status.Completed ? "Tamamlandı" : "Devam Ediyor"
                                                    }</TableCell>
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
                <Grid item xs={12}>
                    <WeekAnime />
                </Grid>
            </Grid>
            <DeleteDialog
                open={deleteAnimeDialog}
                handleClose={() => { setDeleteAnimeDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteAnimes(selected.map((item) => parseInt(item)))
                            .then((res) => {

                            }).catch((er) => {
                                console.log(er)
                            })
                        window.location.reload();
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => setDeleteAnimeDialog(false)}>
                        Kapat
                    </Button>
                }
            />
        </Loading>
    )
}
const WeekAnime = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof MovieTheWeekModels>('id');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<MovieTheWeekModels>>([]);
    const [loading, setLoading] = useState(true);

    const [deleteAnimeDialog, setDeleteAnimeDialog] = useState(false);
    useEffect(() => {
        loadMovieTheWeeks();
        return () => {
            setLoading(true);
        }
    }, [])
    const loadMovieTheWeeks = async () => {
        await getMovieTheWeeks().then((res) => {
            setServiceResponse(res.data.list.filter((y) => y.type === Type.Anime));
        })
            .catch((er) => {

            });
        setLoading(false);
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
                {numSelected > 0 && (
                    <>
                        <Tooltip title="Sil">
                            <IconButton onClick={() => {
                                setDeleteAnimeDialog(true);
                            }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
    return (
        <Grid item xs={12} >
            <Paper sx={{ width: '100%', mb: 2 }}>
                <DataTable
                    EnhancedTableToolbar={EnhancedTableToolbar}
                    rows={serviceResponse.map((item) => item.id.toString())}
                    HeadCell={movieTheWeekCells}
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
                    goAddPage={() => { }}
                    goEditPage={() => { }}
                    handleDelete={() => { console.log("delete") }}
                    tableName="Haftanın Animesi"
                    tableBody={!loading && serviceResponse.length != 0 &&
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
                                                {
                                                    row.anime.img !== null && row.anime.img.length !== 0 &&
                                                    <img
                                                        style={{ height: '60px', width: '60px' }}
                                                        src={row.anime.img}
                                                        srcSet={row.anime.img}
                                                        alt={row.anime.animeName}
                                                        loading="lazy"
                                                    />
                                                }


                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.anime.animeName}
                                            </TableCell>

                                            <TableCell padding='none'>{row.users.nameSurname}</TableCell>
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
            <DeleteDialog
                open={deleteAnimeDialog}
                handleClose={() => { setDeleteAnimeDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteMovieTheWeeks(selected.map((item) => parseInt(item)));
                        window.location.reload();
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => setDeleteAnimeDialog(false)}>
                        Kapat
                    </Button>
                }
            />
        </Grid>
    )
}
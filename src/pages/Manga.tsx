import { Add, Delete, Edit } from '@mui/icons-material';
import { alpha, Button, Checkbox, Grid, IconButton, Paper, TableBody, TableCell, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import DeleteDialog from '../components/DeleteDialog';
import Loading from '../components/Loading';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { useAuth } from '../hooks/useAuth';
import { Manga as Mangas, MovieTheWeek, MovieTheWeekModels, Status, Type } from '../types/Entites';
import { addMovieTheWeeks, baseUrl, deleteMangas, deleteMovieTheWeeks, getMovieTheWeeks, getPaginatedManga } from '../utils/api';
import { mangaCells, mangaTheWeekCells } from '../utils/HeadCells';

export default function Manga() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Mangas>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<Mangas>>([]);
    const [loading, setLoading] = useState(true);

    const [deleteManga, setDeleteManga] = useState(false);

    useEffect(() => {
        loadManga();
        return () => {
            setLoading(true);
        }
    }, [])

    const loadManga = async () => {
        await getPaginatedManga(page + 1, rowsPerPage)
            .then((res) => {
                setServiceResponse(res.data.list);
            }).catch((er) => {

            })
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
                        <Tooltip title="Haftanın Mangasını Ekle">
                            <IconButton onClick={saveButon}>
                                <Add />
                            </IconButton>
                        </Tooltip>
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
    const saveButon = async () => {
        var newArray = new Array<MovieTheWeek>();
        selected.map((item) => {
            newArray.push({ contentID: parseInt(item), type: Type.Manga, description: '', userID: user.id } as MovieTheWeek);
        });
        await addMovieTheWeeks(newArray);
        window.location.reload();
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} >
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={mangaCells}
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
                            goAddPage={() => navigate("/manga/add")}
                            goEditPage={() => navigate("/manga/" + selected[0])}
                            handleDelete={() => { setDeleteManga(true) }}
                            tableName="Mangalar"
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

                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                    >
                                                        {
                                                            row.image != null && row.image.length !== 0 &&
                                                            <img
                                                                style={{ height: '60px', width: '60px' }}
                                                                src={row.image}
                                                                srcSet={row.image}
                                                                alt={row.name}
                                                                loading="lazy"
                                                            />
                                                        }
                                                    </TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.description}</TableCell>
                                                    <TableCell>{row.ageLimit}</TableCell>
                                                    <TableCell>{
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
                <WeekAnime />
            </Grid>
            <DeleteDialog
                open={deleteManga}
                handleClose={() => { setDeleteManga(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteMangas(selected.map((item) => parseInt(item)));
                        window.location.reload();
                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setDeleteManga(false)
                    }}>
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
            setServiceResponse(res.data.list.filter((y) => y.type === Type.Manga));
            console.log(res.data.list);
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
                    HeadCell={mangaTheWeekCells}
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
                    tableName="Haftanın Mangası"
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
                                                    row.manga.image !== null && row.manga.image.length !== 0 &&
                                                    <img
                                                        style={{ height: '60px', width: '60px' }}
                                                        src={row.manga.image}
                                                        srcSet={row.manga.image}
                                                        alt={row.manga.name}
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
                                                {row.manga.name}
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
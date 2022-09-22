import React, { useEffect, useState } from 'react'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import { alpha, Grid, IconButton, Paper, Toolbar, Tooltip, Typography } from '@mui/material';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { useNavigate } from 'react-router';
import { animeCells } from '../utils/HeadCells';
import { Anime as Animes } from '../types/Entites';
import { getPaginatedAnime } from '../utils/api';
import Loading from '../components/Loading';
import { Add, Delete, Edit } from '@mui/icons-material';

export default function Anime() {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Animes>('siteRating');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [serviceResponse, setServiceResponse] = useState<Array<Animes>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnime();
        return () => {
            setLoading(true);
        }
    }, [])
    const loadAnime = async () => {
        await getPaginatedAnime(page + 1, rowsPerPage).then((res) => {
            console.log(res.data);
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
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
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
                                            const isItemSelected = isSelected(row.seoUrl);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.animeName)}
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
                                                        <img
                                                            style={{ height: '100px', width: '100px' }}
                                                            src={`https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format`}
                                                            srcSet={`https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                            alt={"deneme"}
                                                            loading="lazy"
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {row.animeName}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        {row.animeName}
                                                    </TableCell>
                                                    <TableCell >{row.animeName}</TableCell>
                                                    <TableCell>{row.animeName}</TableCell>
                                                    <TableCell align='center'>{row.animeName}</TableCell>
                                                    <TableCell component="th" align='center'>{row.animeName}</TableCell>
                                                    <TableCell>{row.animeName}</TableCell>
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
            </Grid >
        </Loading>
    )
}

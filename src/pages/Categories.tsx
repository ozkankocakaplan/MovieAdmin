import { Add, Edit } from '@mui/icons-material';
import { alpha, Button, Checkbox, Grid, IconButton, Paper, TableBody, TableCell, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import DeleteDialog from '../components/DeleteDialog';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { Categories as Category } from '../types/Entites';
import { deleteCategories, getCategories } from '../utils/api';
import { categoryCells } from '../utils/HeadCells';

export default function Categories() {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Category>('name');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [serviceResponse, setServiceResponse] = useState<Array<Category>>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        loadCategories();
        return () => {
            setLoading(true);
        }
    }, [])

    const loadCategories = async () => {
        await getCategories().then((res) => {
            setServiceResponse(res.data.list);
        })
            .catch((er) => {

            });
        setLoading(false)
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

                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
    return (
        <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <DataTable
                        EnhancedTableToolbar={EnhancedTableToolbar}
                        rows={serviceResponse.map((item) => item.id.toString())}
                        HeadCell={categoryCells}
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
                        goAddPage={() => navigate("/category/add")}
                        goEditPage={() => navigate("/category/" + selected[0])}
                        handleDelete={() => { setDeleteDialog(true) }}
                        tableName="Kategoriler"
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
                                                key={row.name}
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
                                                    {row.name}
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
                </Paper>
            </Grid>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteCategories(selected.map((item) => parseInt(item)))
                            .then((res) => {

                            })
                            .catch((er) => {

                            })
                        setDeleteDialog(false);
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

        </Grid >
    )
}

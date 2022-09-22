import React, { useState } from 'react'

import { useNavigate } from 'react-router';
import { Block, Delete, Edit } from '@mui/icons-material';
import { alpha, Checkbox, Grid, IconButton, Paper, TableBody, TableCell, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import Loading from '../components/Loading'
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { ContentComplaint } from '../types/Entites';
import { contentComplaintCells } from '../utils/HeadCells';

export default function Complaint() {
    const navigate = useNavigate();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ContentComplaint>('createTime');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [serviceResponse, setServiceResponse] = useState<Array<ContentComplaint>>([]);
    const [loading, setLoading] = useState(false);

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
    return (
        <Loading loading={loading}>
            <Grid md={12} sm={12} xs={12} container sx={{ padding: "10px" }}>
                <Grid item xs={12} sx={{ maxHeight: 400, outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={contentComplaintCells}
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
                            goEditPage={() => {

                            }}
                            handleDelete={() => { }}
                            tableName="İçerik Şikayetleri"
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
                <Grid md={12} sm={12} xs={12} container>
                    <Grid item xs={12} sx={{ maxHeight: 400, outline: 0 }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <DataTable
                                EnhancedTableToolbar={EnhancedTableToolbar}
                                rows={serviceResponse.map((item) => item.id.toString())}
                                HeadCell={contentComplaintCells}
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
                                goEditPage={() => {

                                }}
                                handleDelete={() => { }}
                                tableName="Kullanıcı Şikayetleri"
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
            </Grid>

        </Loading>
    )
}

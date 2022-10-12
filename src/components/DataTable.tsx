import * as React from 'react';

import { visuallyHidden } from '@mui/utils';
import { Add, Edit } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { HeadCell, Order } from './TableHelper';

interface EnhancedTableProps<T> {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell<T>[]
}
export interface EnhancedTableToolbarProps {
    numSelected: number;
    tableName: string,
    goEditPage: () => void,
    goAddPage: () => void,
    handleDelete: () => void
}
interface IDataTableProps<T> {
    order: Order,
    setOrder: (data: Order) => void,
    orderBy: string,
    setOrderBy: (data: any) => void,
    selected: any,
    setSelected: (selected: any) => void,
    page: number,
    setPage: (data: number) => void,
    rowsPerPage: number,
    setRowsPerPage: (data: number) => void,
    tableName: string,
    tableBody: any,
    HeadCell: HeadCell<T>[],
    rows: Array<string>,
    goEditPage: () => void,
    goAddPage: () => void,
    handleDelete: () => void,
    EnhancedTableToolbar: any
}
const EnhancedTableHead = <T extends object>(props: EnhancedTableProps<T>) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof string) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all',
                        }}
                    />
                </TableCell>
                {props.headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id.toString()}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


const DataTable = <T extends object>(props: IDataTableProps<T>) => {
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof string,
    ) => {
        const isAsc = props.orderBy === property && props.order === 'asc';
        props.setOrder(isAsc ? 'desc' : 'asc');
        props.setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = props.rows.map((n) => n);
            props.setSelected(newSelected);
            return;
        }
        props.setSelected([]);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        props.setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setRowsPerPage(parseInt(event.target.value, 10));
        props.setPage(0);
    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <props.EnhancedTableToolbar
                tableName={props.tableName}
                goAddPage={props.goAddPage}
                goEditPage={props.goEditPage}
                handleDelete={props.handleDelete}
                numSelected={props.selected.length} />
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'medium'}
                >
                    {props.tableBody && <EnhancedTableHead
                        headCells={props.HeadCell}
                        numSelected={props.selected.length}
                        order={props.order}
                        orderBy={props.orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={props.rows.length}
                    />}
                    {
                        props.tableBody
                    }
                </Table>
            </TableContainer>
            {props.tableBody && <TablePagination
                labelRowsPerPage="Sayfa başına"
                rowsPerPageOptions={[10, 50, 100]}
                component="div"
                count={props.rows.length}
                rowsPerPage={props.rowsPerPage}
                page={props.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />}
        </Box>
    )
}
export default DataTable;
import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router';
import { Block, Delete, Edit, Visibility } from '@mui/icons-material';
import { alpha, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import Loading from '../components/Loading'
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { ComplaintContentModels, ComplaintListModels, ContentComplaint, Notification, NotificationType } from '../types/Entites';
import { complaintCells, contentComplaintCells } from '../utils/HeadCells';
import { Box } from '@mui/system';
import { addNotification, deleteComplaints, getComplaints, getContentComplaint } from '../utils/api';
import DeleteDialog from '../components/DeleteDialog';

export default function Complaint() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ContentComplaint>('createTime');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<ComplaintContentModels>>([]);
    const [loading, setLoading] = useState(false);

    const [viewDialog, setViewDialog] = useState(false);
    const [description, setDescription] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintContentModels>({} as ComplaintContentModels);
    useEffect(() => {
        loadContentComplaint();
        return () => {
            setServiceResponse([]);
        }
    }, [])
    const loadContentComplaint = async () => {
        await getContentComplaint().then((res) => {
            setServiceResponse(res.data.list)
        }).then((res) => {

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
                                <Visibility />
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
            <Box sx={{ padding: "10px" }}>
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
                                var entity = serviceResponse.find((y) => y.id === parseInt(selected[0]));
                                setSelectedComplaint(entity as ComplaintContentModels);
                                setViewDialog(true);
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
                                                    <TableCell>{row.user.nameSurname}</TableCell>
                                                    <TableCell>{row.user.email}</TableCell>
                                                    <TableCell>{row.message}</TableCell>
                                                    {
                                                        row.anime !== null ?
                                                            <TableCell>
                                                                {row.anime.animeName}  <br />
                                                                {row.animeEpisode !== null && row.animeEpisode.episodeName}
                                                            </TableCell>
                                                            :
                                                            row.manga !== null &&
                                                            <TableCell>
                                                                {row.manga.name} <br />
                                                                {row.mangaEpisode !== null && row.mangaEpisode.name}
                                                            </TableCell>
                                                    }
                                                    <TableCell>
                                                        {new Date(row.createTime).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            }
                        />
                    </Paper>
                </Grid>
                <Dialog fullWidth open={viewDialog} onClose={() => setViewDialog(false)}>
                    <DialogTitle>Uyarı Mesajı</DialogTitle>
                    <DialogContent>
                        <TextField
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoFocus
                            multiline={true}
                            rows={4}
                            margin="dense"
                            id="name"
                            label="Açıklama"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewDialog(false)}>İptal</Button>
                        <Button onClick={async () => {
                            var entity = {
                                notificationMessage: description,
                                userID: selectedComplaint.userID,
                                notificationType: NotificationType.UserWarning,
                                isReadInfo: false
                            } as Notification;
                            await addNotification(entity).then((res) => {
                                console.log(res.data)
                            }).catch((er) => {
                                console.log(er)
                            });
                            setViewDialog(false);
                        }}>Gönder</Button>
                    </DialogActions>
                </Dialog>
                <UserComplaintList />
            </Box>
        </Loading>
    )
}
const UserComplaintList = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ContentComplaint>('createTime');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [serviceResponse, setServiceResponse] = useState<Array<ComplaintListModels>>([]);
    const [loading, setLoading] = useState(true);

    const [viewDialog, setViewDialog] = useState(false);

    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintListModels>({} as ComplaintListModels);
    const [description, setDescription] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        loadComplaintList();
    }, [])
    const loadComplaintList = async () => {
        await getComplaints().then((res) => {
            setServiceResponse(res.data.list);
        }).catch((er) => {
            console.log(er);
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
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Göster">
                            <IconButton onClick={props.goEditPage}>
                                <Visibility />
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
            <Grid md={12} sm={12} xs={12} item>
                <Grid item xs={12} sx={{ maxHeight: 400, outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={serviceResponse.map((item) => item.id.toString())}
                            HeadCell={complaintCells}
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

                            }}
                            goEditPage={() => {
                                var entity = serviceResponse.find((y) => y.id === parseInt(selected[0]));
                                setSelectedComplaint(entity as ComplaintListModels);
                                setViewDialog(true);
                            }}
                            handleDelete={() => { setDeleteDialog(true) }}
                            tableName="Kullanıcı Şikayetleri"
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
                                                    <TableCell padding='none'>{row.complainantUser.nameSurname}</TableCell>
                                                    <TableCell padding='none'>{row.users.nameSurname}</TableCell>
                                                    <TableCell padding='none'>{row.description}</TableCell>
                                                    <TableCell padding='none'>{new Date(row.createTime).toLocaleString().substring(0, 16)}</TableCell>
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
            <Dialog fullWidth open={viewDialog} onClose={() => setViewDialog(false)}>
                <DialogTitle>Uyarı Mesajı</DialogTitle>
                <DialogContent>
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoFocus
                        multiline={true}
                        rows={4}
                        margin="dense"
                        id="name"
                        label="Açıklama"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialog(false)}>İptal</Button>
                    <Button onClick={async () => {
                        var entity = {
                            notificationMessage: description,
                            userID: selectedComplaint.userID,
                            notificationType: NotificationType.UserWarning,
                            isReadInfo: false
                        } as Notification;
                        await addNotification(entity).then((res) => {
                            console.log(res.data)
                        }).catch((er) => {
                            console.log(er)
                        });
                        setViewDialog(false);
                    }}>Gönder</Button>
                </DialogActions>
            </Dialog>
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteComplaints(selected.map((item) => parseInt(item)));
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

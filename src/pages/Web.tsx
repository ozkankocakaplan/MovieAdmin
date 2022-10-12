import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Avatar, Box, Button, Checkbox, Drawer, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TableBody, TableCell, TableRow, TextField, ThemeProvider, Toolbar, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Edit, PhotoCamera, Visibility } from '@mui/icons-material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { Announcement, Contact, ContactSubject, HomeSlider, SiteDescription } from '../types/Entites';
import { baseUrl, deleteContact, deleteContactSubject, deleteHomeSlider, getAnnouncements, getContacts, getContactSubjects, getHomeSlider, getHomeSliders, getSiteDescriptions, postContactSubject, postHomeSlider, putAnnouncement, putContactSubject, putHomeSlider, putSiteDescription } from '../utils/api';
import { contactCells, contactSubjectCells, sliderCells } from '../utils/HeadCells';


import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import DeleteDialog from '../components/DeleteDialog';
import Loading from '../components/Loading'
import ServiceResponse from '../types/ServiceResponse';
import FullDialog from '../components/FullDialog';
import ResultSnackbar, { Result } from '../components/ResultSnackbar';
import { AxiosError } from 'axios';

export default function Web() {
    const [loading, setLoading] = useState(false);

    return (
        <Loading loading={loading}>
            <WebSettings />
            <Slider />
            <WebContact />
        </Loading>
    )
}
const Slider = () => {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('createTime');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [addSliderDialog, setAddSliderDialog] = useState(false);
    const [editSliderDialog, setEditSliderDialog] = useState(false);

    const [sliderService, setSliderService] = useState<ServiceResponse<HomeSlider>>({} as ServiceResponse<HomeSlider>);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedSliderId, setSelectedSliderId] = useState(0);

    useEffect(() => {
        loadContacts();
    }, [])
    const loadContacts = async () => {
        await getHomeSliders().then((res) => {
            setSliderService(res.data);
        }).catch((er) => {

        });
        setLoading(false);

    }
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sliderService.list.length) : 0;
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
                {numSelected === 0 && <Tooltip title="Ekle">
                    <IconButton onClick={props.goAddPage}>
                        <Add />
                    </IconButton>
                </Tooltip>}
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Düzenle">
                            <IconButton onClick={props.goEditPage}>
                                <Edit />
                            </IconButton>
                        </Tooltip>}
                    </>
                )}
            </Toolbar>
        );
    };
    //#endregion

    const sliderList = sliderService.list !== undefined ? sliderService.list as Array<HomeSlider> : new Array<HomeSlider>;
    return (
        <Grid container>
            <Grid item sm={12} md={12} xs={12} sx={{ marginLeft: '20px', marginRight: '20px', marginTop: '20px', marginBottom: '10px' }}>
                <Grid item xs={12} sx={{ maxHeight: 400, outline: 0 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <DataTable
                            EnhancedTableToolbar={EnhancedTableToolbar}
                            rows={sliderList.map((item) => item.id.toString())}
                            HeadCell={sliderCells}
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
                                setAddSliderDialog(true);
                            }}
                            goEditPage={() => {
                                setEditSliderDialog(true);

                            }}
                            handleDelete={() => { console.log("delete") }}
                            tableName="Anasayfa Otomatik Geçiş"
                            tableBody={sliderList.length !== 0 &&
                                <TableBody>
                                    {sliderList
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.id.toString());
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            if (selected.length === 1 && selectedSliderId === 0) {
                                                setSelectedSliderId(row.id);
                                            }
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
                                                            src={baseUrl + row.image}
                                                            srcSet={baseUrl + row.image}
                                                            alt={row.sliderTitle}
                                                            loading="lazy"
                                                        />
                                                    </TableCell>
                                                    <TableCell padding='none' >{row.sliderTitle}</TableCell>
                                                    <TableCell padding='none' >{row.description.substring(0, 120)}...</TableCell>
                                                    <TableCell padding='none' >{row.isDisplay === true ? "Aktif" : "Pasif"}</TableCell>
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
            <FullDialog open={addSliderDialog} handleClose={() => { setAddSliderDialog(false) }}>
                <AddHomeSlider />
            </FullDialog>
            <FullDialog open={editSliderDialog} handleClose={() => { setEditSliderDialog(false) }}
                extraData={
                    <IconButton
                        onClick={() => setDeleteDialog(true)}
                        edge="start"
                        color="inherit"
                        aria-label="close"
                    >
                        <Delete />
                    </IconButton>
                }
            >
                {editSliderDialog && <EditHomeSlider id={selectedSliderId} />}
                <DeleteDialog
                    open={deleteDialog}
                    handleClose={() => { setDeleteDialog(false) }}
                    dialogTitle={"Silmek istiyor musunuz"}
                    dialogContentText={"Bu işlem geri alınamaz"}
                    yesButon={
                        <Button onClick={async () => {
                            await deleteHomeSlider(selectedSliderId);
                            window.location.reload();
                        }}>
                            Sil
                        </Button>
                    }
                    noButon={
                        <Button onClick={() => {
                            setDeleteDialog(false);
                        }}>
                            Kapat
                        </Button>
                    }
                />
            </FullDialog>
        </Grid>
    )
}
const WebSettings = () => {
    const [loading, setLoading] = useState(true);
    const [formAnnouncement, setFormAnnouncement] = useState({} as Announcement);
    const [formSiteDescription, setFormSiteDescription] = useState({ instagramUrl: '', youtubeUrl: '', description: '', keywords: '' } as SiteDescription);

    const [putResult, setPutResult] = useState<Result>({ text: '', status: false } as Result);
    const [resultIsOpen, setResultIsOpen] = useState(false);
    useEffect(() => {
        loadData();
        loadSiteDescription();
    }, [])

    const loadData = async () => {
        await loadAnnouncement();
        setLoading(false);
    }
    const loadSiteDescription = async () => {
        await getSiteDescriptions().then((res) => {
            if (res.data.count === 1) {
                setFormSiteDescription(res.data.list[0]);
            }
        }).catch((er) => {

        })
    }
    const loadAnnouncement = async () => {
        await getAnnouncements().then((res) => {
            if (res.data.count === 1) {
                setFormAnnouncement(res.data.list[0]);
            }
        }).catch((er) => {
            console.log(er);
        })
    }
    const updateDescriptionButon = async () => {
        await putSiteDescription(formSiteDescription)
            .then((res) => {
                setPutResult({ text: "Değişiklik Kaydedildi", status: true });
            }).catch((er: AxiosError) => {
                setPutResult({ text: er.message, status: false });
            });
        setResultIsOpen(true)
    }
    const updateAnnouncementButon = async () => {
        await putAnnouncement(formAnnouncement)
            .then((res) => {
                setPutResult({ text: "Değişiklik Kaydedildi", status: true });
            }).catch((er: AxiosError) => {
                setPutResult({ text: er.message, status: false });
            });
        setResultIsOpen(true)
    }
    return (
        <Loading loading={loading}>
            <Grid container>
                <Grid item sm={12} md={12} xs={12} sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px', marginTop: '20px' }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>
                                Web
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formSiteDescription.instagramUrl}
                                        onChange={(e) => setFormSiteDescription({ ...formSiteDescription, instagramUrl: e.target.value })}
                                        label="Instagram Url"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formSiteDescription.youtubeUrl}
                                        onChange={(e) => setFormSiteDescription({ ...formSiteDescription, youtubeUrl: e.target.value })}
                                        label="Youtube Url"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formSiteDescription.keywords}
                                        onChange={(e) => setFormSiteDescription({ ...formSiteDescription, keywords: e.target.value })}
                                        multiline={true}
                                        rows={4}
                                        label="Anahtar Kelime"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formSiteDescription.description}
                                        onChange={(e) => setFormSiteDescription({ ...formSiteDescription, description: e.target.value })}
                                        multiline={true}
                                        rows={4}
                                        label="Web sitesi hakkında"
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
                                        onClick={updateDescriptionButon}
                                        size='medium'
                                        fullWidth variant='contained'>
                                        Kaydet
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '20px' }}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.about}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, about: e.target.value })}
                                        multiline={true}
                                        rows={4}
                                        label="Hakkında"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.updateInformation}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, updateInformation: e.target.value, updateDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Güncelleme"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.innovationInformation}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, innovationInformation: e.target.value, innovationDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Yenilikler"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.complaintsInformation}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, complaintsInformation: e.target.value, complaintsDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Şikayetler"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.addToInformation}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, addToInformation: e.target.value, addDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Eklenecekler"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.warningInformation}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, warningInformation: e.target.value, warningDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Uyarı"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <Box
                                    sx={{
                                        marginTop: '10px',
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={formAnnouncement.comingSoonInfo}
                                        onChange={(e) => setFormAnnouncement({ ...formAnnouncement, comingSoonInfo: e.target.value, comingSoonDate: new Date().toLocaleString() })}
                                        multiline={true}
                                        rows={4}
                                        label="Yakında"
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
                                        onClick={updateAnnouncementButon}
                                        size='medium'
                                        fullWidth variant='contained'>
                                        Kaydet
                                    </Button>
                                </Box>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <ResultSnackbar result={putResult} open={resultIsOpen} closeOpen={() => setResultIsOpen(false)} />
        </Loading>
    )
}
const WebContact = () => {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Contact>('createTime');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [contactService, setContactService] = useState<ServiceResponse<Contact>>({} as ServiceResponse<Contact>);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact>({} as Contact);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [subjectFullDialog, setSubjectFullDialog] = useState(false);
    useEffect(() => {
        loadContacts();
    }, [])
    const loadContacts = async () => {
        await getContacts(page + 1, rowsPerPage).then((res) => {
            setContactService(res.data);
        }).catch((er) => {

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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contactService.list.length) : 0;
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
                {numSelected === 0 &&
                    <Tooltip title="Konu Ekle">
                        <IconButton onClick={props.goAddPage}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                }
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Göster">
                            <IconButton onClick={props.goEditPage}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>}
                    </>
                )}
            </Toolbar>
        );
    };
    const contacsList = contactService.list !== undefined ? contactService.list as Array<Contact> : new Array<Contact>;
    return (
        <Loading loading={loading}>
            <Grid container>
                <Grid item sm={12} md={12} xs={12} sx={{ marginLeft: '20px', marginRight: '20px', marginBottom: '10px' }}>
                    <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <DataTable
                                EnhancedTableToolbar={EnhancedTableToolbar}
                                rows={contacsList.map((item) => item.id.toString())}
                                HeadCell={contactCells}
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
                                goAddPage={() => { setSubjectFullDialog(true) }}
                                goEditPage={() => {
                                    setDetailsOpen(true);
                                }}
                                handleDelete={() => { console.log("delete") }}
                                tableName="İletişim"
                                tableBody={contacsList.length !== 0 &&
                                    <TableBody>
                                        {stableSort(contacsList, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.id.toString());
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                if (selected.length === 1 && Object.keys(selectedContact).length === 0) {
                                                    setSelectedContact(row);
                                                }
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
                                                            {row.nameSurname}
                                                        </TableCell>
                                                        <TableCell padding='none'>{row.email}</TableCell>
                                                        <TableCell padding='none'>{row.subject}</TableCell>
                                                        <TableCell padding='none'>{row.message}</TableCell>
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
            <FullDialog open={subjectFullDialog} handleClose={() => { setSubjectFullDialog(false) }}>
                <ContactSubjects />
            </FullDialog>
            <ContactDetails
                handleDelete={() => {
                    setDeleteDialog(true);
                }}
                selectedContact={selectedContact} openDrawer={(status) => setDetailsOpen(status)} drawerState={detailsOpen} />
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteContact(selectedContact.id).then((res) => {
                            if (res.data.isSuccessful) {
                                setContactService({ ...contactService, list: contactService.list.filter((i) => i.id !== selectedContact.id) })
                                setSelected([]);
                                setDetailsOpen(false);
                                setDeleteDialog(false);
                            }
                        })

                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setDeleteDialog(false);
                    }}>
                        Kapat
                    </Button>
                }
            />
        </Loading>
    )
}


const ContactSubjects = () => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ContactSubject>('id');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [contactSubjectService, setContactSubjectService] = useState<ServiceResponse<ContactSubject>>({} as ServiceResponse<ContactSubject>);

    const [addContactSubjectDialog, setAddContactSubjectDialog] = useState(false);
    const [editContactSubjectDialog, setEditContactSubjectDialog] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [contactSubjectID, setContactSubjectID] = useState(0);
    useEffect(() => {
        loadContactSubject();
    }, [])


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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contactSubjectService.list.length) : 0;
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
                {numSelected === 0 &&
                    <Tooltip title="Konu Ekle">
                        <IconButton onClick={props.goAddPage}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                }
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Göster">
                            <IconButton onClick={props.goEditPage}>
                                <Visibility />
                            </IconButton>
                        </Tooltip>}
                    </>
                )}
            </Toolbar>
        );
    };
    //#endregion
    const contactList = contactSubjectService.list !== undefined ? contactSubjectService.list as Array<ContactSubject> : new Array<ContactSubject>;


    const loadContactSubject = async () => {
        await getContactSubjects().then((res) => {
            setContactSubjectService(res.data);
        })
    }
    return (
        <Grid container sx={{ padding: '0px 15px' }} >
            <Grid item xs={12} sx={{ maxHeight: 400, outline: 0, marginTop: '30px' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <DataTable
                        EnhancedTableToolbar={EnhancedTableToolbar}
                        rows={contactList.map((item) => item.id.toString())}
                        HeadCell={contactSubjectCells}
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
                            setAddContactSubjectDialog(true);
                        }}
                        goEditPage={() => {
                            setEditContactSubjectDialog(true);
                        }}
                        handleDelete={() => { console.log("delete") }}
                        tableName="İletişim Konuları"
                        tableBody={
                            <TableBody>
                                {contactList
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(index.toString());
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, index.toString())}
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
                                                <TableCell padding='none' >{row.subject}</TableCell>
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
            <AddContactSubject handleAdd={async (entity: ContactSubject) => {
                await postContactSubject(entity).then((res) => {
                    setContactSubjectService({ ...contactSubjectService, list: [...contactSubjectService.list, res.data.entity] });
                    setAddContactSubjectDialog(false);
                });

            }} openDrawer={(status: boolean) => setAddContactSubjectDialog(status)} drawerState={addContactSubjectDialog} />
            {editContactSubjectDialog && <EditContactSubject
                handleDelete={async (id: number) => {
                    setContactSubjectID(id);
                    setEditContactSubjectDialog(false);
                    setDeleteDialog(true);
                }}
                handleUpdate={async (entity: ContactSubject) => {
                    await putContactSubject(entity).then((res) => {
                        setContactSubjectService({ ...contactSubjectService, list: contactSubjectService.list.map((i) => i.id === entity.id ? entity : i) });
                        setEditContactSubjectDialog(false);
                        setSelected([]);
                    })
                }}
                selectedData={contactSubjectService.list[parseInt(selected[0])]} drawerState={editContactSubjectDialog} openDrawer={(status: boolean) => setEditContactSubjectDialog(status)} />}
            <DeleteDialog
                open={deleteDialog}
                handleClose={() => { setDeleteDialog(false) }}
                dialogTitle={"Silmek istiyor musunuz"}
                dialogContentText={"Bu işlem geri alınamaz"}
                yesButon={
                    <Button onClick={async () => {
                        await deleteContactSubject(contactSubjectID).then((res) => {
                            if (res.data.isSuccessful) {
                                setContactSubjectService({ ...contactSubjectService, list: contactSubjectService.list.filter((e) => e.id !== contactSubjectID) });

                                setSelected([]);
                                setDeleteDialog(false);
                            }
                        })

                    }}>
                        Sil
                    </Button>
                }
                noButon={
                    <Button onClick={() => {
                        setDeleteDialog(false);
                    }}>
                        Kapat
                    </Button>
                }
            />
        </Grid>
    )
}
const AddContactSubject = (props: { openDrawer: (status: boolean) => void, drawerState: boolean, handleAdd: (entity: ContactSubject) => void }) => {
    const [form, setForm] = useState({ subject: '' } as ContactSubject);
    return (
        <React.Fragment>
            <Drawer
                sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
                anchor={'right'}
                open={props.drawerState}
                onClose={() => props.openDrawer(false)}
            >
                <Box
                    sx={{ width: 400 }}
                    role="presentation"
                >
                    <Grid container sx={{ padding: '15px' }}>
                        <Grid container sx={{ marginTop: '20px' }}>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Konu Adı"

                                />
                            </Grid>
                            <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '20px' }}>
                                <Button
                                    onClick={() => props.handleAdd(form)}
                                    variant='outlined' fullWidth>
                                    Kaydet
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </React.Fragment>
    )
}
const EditContactSubject = (props: { openDrawer: (status: boolean) => void, drawerState: boolean, selectedData: ContactSubject, handleUpdate: (entity: ContactSubject) => void, handleDelete: (id: number) => void }) => {
    const [form, setForm] = useState(props.selectedData as ContactSubject)
    return (
        <React.Fragment>
            <Drawer
                sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
                anchor={'right'}
                open={props.drawerState}
                onClose={() => props.openDrawer(false)}
            >
                <Box
                    sx={{ width: 400 }}
                    role="presentation"
                >
                    <Grid container sx={{ padding: '15px' }}>
                        <Grid container sx={{ marginTop: '20px' }}>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Konu Adı"
                                />
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6} md={6} xs={12} sx={{ marginTop: '20px' }}>
                                    <Button onClick={() => props.handleUpdate(form)} variant='outlined' fullWidth>
                                        Kaydet
                                    </Button>
                                </Grid>
                                <Grid item sm={6} md={6} xs={12} sx={{ marginTop: '20px' }}>
                                    <Button onClick={() => props.handleDelete(form.id)} variant='outlined' fullWidth>
                                        <Delete />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </React.Fragment>
    )
}











const ContactDetails = (props: { openDrawer: (status: boolean) => void, drawerState: boolean, selectedContact: Contact, handleDelete: () => void }) => {
    return (
        <React.Fragment>
            <Drawer
                sx={{ '& .MuiDrawer-paper': { top: '65px' } }}
                anchor={'right'}
                open={props.drawerState}
                onClose={() => props.openDrawer(false)}
            >
                <Box
                    sx={{ width: 400 }}
                    role="presentation"
                >
                    <Grid container sx={{ padding: '15px' }}>
                        <Grid container sx={{ marginTop: '20px' }}>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    disabled
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Ad Soyad"
                                    defaultValue={props.selectedContact.nameSurname}
                                />
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    disabled
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Eposta"
                                    defaultValue={props.selectedContact.email}
                                />
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    disabled
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Konu"
                                    defaultValue={props.selectedContact.subject}
                                />
                            </Grid>
                            <Grid item sm={12} md={12} xs={12}>
                                <TextField
                                    multiline={true}
                                    rows={5}
                                    sx={{ marginTop: '10px' }}
                                    size='small'
                                    disabled
                                    fullWidth
                                    id="outlined-disabled"
                                    label="Mesaj"
                                    defaultValue={props.selectedContact.message}
                                />
                            </Grid>
                            <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '20px' }}>
                                <Button onClick={props.handleDelete} variant='outlined' fullWidth>
                                    <Delete />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </React.Fragment>
    );
}
const EditHomeSlider = (props: { id: number }) => {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [status, setStatus] = useState('0');
    const [formData, setFormData] = useState<FormData>(new FormData());
    const [form, setForm] = useState<HomeSlider>({ url: '', description: '', sliderTitle: '', isDisplay: true } as HomeSlider);
    useEffect(() => {
        loadData();
    }, [props.id])
    const loadData = async () => {
        await getHomeSlider(props.id)
            .then((res) => {
                if (res.data.entity !== null && res.data.isSuccessful) {
                    setSelectedImage(baseUrl + res.data.entity.image);
                    setForm(res.data.entity);
                    setStatus(res.data.entity.isDisplay === true ? "0" : "1");
                }
            }).catch((er) => {
                console.log(er)
            });
        setLoading(false);
    }
    const saveButon = async () => {
        formData.append("id", props.id.toString());
        formData.append("description", form.description);
        formData.append("isDisplay", form.isDisplay as any);
        formData.append("sliderTitle", form.sliderTitle);
        formData.append("url", form.url);
        formData.append("image", form.image);
        await putHomeSlider(formData as FormData)
            .then((res) => {
                console.log(res.data)
            }).catch((er) => {
                console.log(er)
            });
        window.location.reload();
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: '0px 15px' }} >
                <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
                    {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute', background: '#33333380', zIndex: 200 }}>
                        <Delete sx={{ color: '#fff' }} />
                    </IconButton>}
                    {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute', top: 10, marginLeft: '150px' }}>
                        <Delete />
                    </IconButton>}
                    {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                        <input onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                                formData.append("img", e.target.files[0] as any);
                                setSelectedImage(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                            hidden accept="image/*" type="file" />
                        <PhotoCamera />
                    </IconButton>}
                    {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '500px', width: '100%' }} />}
                </Grid>
                <Grid item sm={12} md={12} xs={12}>
                    <Box
                        sx={{
                            marginTop: '10px',
                            maxWidth: '100%',
                        }}>
                        <TextField
                            value={form.sliderTitle}
                            onChange={(e) => setForm({ ...form, sliderTitle: e.target.value })}
                            label="Başlık"
                            fullWidth
                        ></TextField>
                    </Box>
                </Grid>
                <Grid item sm={12} md={12} xs={12}>
                    <Box
                        sx={{
                            marginTop: '10px',
                            maxWidth: '100%',
                        }}>
                        <TextField
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                            label="Url"
                            fullWidth
                        ></TextField>
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
                <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '10px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Durum</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Durum"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value as any)
                                setForm({ ...form, isDisplay: e.target.value === '0' ? true : false })
                            }}
                        >
                            <MenuItem value={0}>Aktif</MenuItem>
                            <MenuItem value={1}>Pasif</MenuItem>
                        </Select>
                    </FormControl>
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
        </Loading>
    )
}
const AddHomeSlider = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const [status, setStatus] = useState('0');
    const [formData, setFormData] = useState<FormData>({} as any);
    const [form, setForm] = useState<HomeSlider>({ url: '', description: '', sliderTitle: '', isDisplay: true } as HomeSlider);

    const saveButon = async () => {
        formData.append("description", form.description);
        formData.append("isDisplay", form.isDisplay as any);
        formData.append("sliderTitle", form.sliderTitle);
        formData.append("url", form.url);
        formData.append("image", "");
        await postHomeSlider(formData as FormData);
        window.location.reload();
    }
    return (
        <Grid container sx={{ padding: '0px 15px' }} >
            <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
                {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'absolute', background: '#33333380', zIndex: 200 }}>
                    <Delete sx={{ color: '#fff' }} />
                </IconButton>}
                {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
                    <input onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                            var form = new FormData();
                            form.append("img", e.target.files[0] as any);
                            setFormData(form);
                            setSelectedImage(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                        hidden accept="image/*" type="file" />
                    <PhotoCamera />
                </IconButton>}
                {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '500px', width: '100%' }} />}
            </Grid>
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    <TextField
                        value={form.sliderTitle}
                        onChange={(e) => setForm({ ...form, sliderTitle: e.target.value })}
                        label="Başlık"
                        fullWidth
                    ></TextField>
                </Box>
            </Grid>
            <Grid item sm={12} md={12} xs={12}>
                <Box
                    sx={{
                        marginTop: '10px',
                        maxWidth: '100%',
                    }}>
                    <TextField
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        label="Url"
                        fullWidth
                    ></TextField>
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
            <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '10px' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Durum</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Durum"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value as any)
                            setForm({ ...form, isDisplay: e.target.value === '0' ? true : false })
                        }}
                    >
                        <MenuItem value={0}>Aktif</MenuItem>
                        <MenuItem value={1}>Pasif</MenuItem>
                    </Select>
                </FormControl>
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
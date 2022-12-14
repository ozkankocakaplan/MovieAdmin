import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import { Accordion, AccordionDetails, AccordionSummary, alpha, Autocomplete, Box, Button, Checkbox, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Tab, TableBody, TableCell, TableRow, Tabs, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { getCategories, postAnime, postCategoryType } from '../../../utils/api'
import { Anime, AnimeEpisodes, AnimeSeason, Categories, CategoryType, Status, Type, VideoType } from '../../../types/Entites';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';



import Loading from '../../../components/Loading';
import { AxiosError } from 'axios';
import { AnimeForm } from '../../../types/EntitesForm';
import { useNavigate } from 'react-router';

import { GridExpandMoreIcon } from '@mui/x-data-grid';
import DataTable, { EnhancedTableToolbarProps } from '../../../components/DataTable';
import { animeEpisodesCells } from '../../../utils/HeadCells';
import { Order } from '../../../components/TableHelper';
import { Add, Delete, Edit } from '@mui/icons-material';
import MyDropzone from '../../../components/MyDropzone';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FullDialog from '../../../components/FullDialog';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export default function AddAnime() {
    var navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [categoriesService, setCategoriesService] = useState<Array<Categories>>([]);
    const [selectedCategories, setSelectedCategories] = useState<Array<Categories>>([]);

    const [contentType, setContentType] = useState<VideoType>(VideoType.AnimeMovie);
    const [animeStatus, setAnimeStatus] = useState<Status>(Status.Continues);
    const [firstShowDate, setFirstShowDate] = useState<Dayjs | null>(dayjs(new Date()));

    const [animeForm, setAnimeForm] = useState<AnimeForm>({ animeName: '', animeDescription: '', malRating: '', ageLimit: '', seasonCount: 1, showTime: firstShowDate?.toString(), status: animeStatus, videoType: contentType, siteRating: '' } as Anime);
    const [addDialog, setAddDialog] = useState(false);
    const [animeEpisodeForm, setAnimeEpisodeForm] = useState<AnimeEpisodes>({ episodeDescription: '', episodeName: '' } as AnimeEpisodes);
    const [selectedSeasonID, setSelectedSeasonID] = useState(0);
    const [formCheck, setFormCheck] = useState(false);
    useEffect(() => {
        loadCategories();
    }, []);
    console.log(selectedCategories)
    const loadCategories = async () => {
        await getCategories()
            .then((res) => {
                setCategoriesService(res.data.list);
            }).catch((er) => {
                console.log(er)
            });
        setLoading(false);
    }
    const saveButon = async () => {
        if (animeForm.animeName.length != 0 && animeForm.animeDescription.length != 0 && selectedCategories.length != 0 && animeForm.ageLimit.length != 0 && animeForm.seasonCount != 0 && animeForm.malRating != undefined && animeForm.malRating.length != 0) {
            setFormCheck(false);
            await postAnime(animeForm).then(async (res) => {
                if (res.data.isSuccessful) {
                    var categoryTypeArray = new Array<CategoryType>();
                    selectedCategories.map((item: any) => {
                        categoryTypeArray.push({ contentID: res.data.entity.id, type: Type.Anime, categoryID: item } as CategoryType);
                    })
                    await postCategoryType(categoryTypeArray).then((response) => {
                        navigate("/anime/" + res.data.entity.id);
                    })
                        .catch((er: AxiosError) => {
                            console.log(er)
                        })

                }
            }).catch((er: AxiosError) => {
                console.log(er.message);
            })
        }
        else {
            setFormCheck(true);
        }
    }
    const defaultCategoryProps = {
        options: categoriesService,
        getOptionLabel: (option: Categories) => option.name,
    };
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: "10px" }}>
                <Paper sx={{ width: '100%', mb: 1 }}>
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 }
                        }}
                    >
                        <Typography component="div"
                            color={"inherit"}
                            variant={"h6"}
                            sx={{ flex: '1 1 100%' }}
                        >
                            Yeni Anime Ekle
                        </Typography>
                        <Button onClick={saveButon} variant='outlined'>
                            Kaydet
                        </Button>
                    </Toolbar>
                </Paper>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={12} sm={12} >
                        <Paper sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                            <div style={{ padding: 10 }}>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={animeForm.animeName}
                                        onChange={(e) => setAnimeForm({ ...animeForm, animeName: e.target.value })}
                                        label="Film veya Dizi Adı"
                                        fullWidth
                                    ></TextField>
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={animeForm.animeName}
                                        onChange={(e) => setAnimeForm({ ...animeForm, img: e.target.value })}
                                        label="Kapak Resim"
                                        fullWidth
                                    ></TextField>
                                </Box>
                                <Box
                                    sx={{
                                        maxWidth: '100%',
                                    }}>
                                    <TextField
                                        value={animeForm.animeDescription}
                                        onChange={(e) => setAnimeForm({ ...animeForm, animeDescription: e.target.value })}
                                        rows={4}
                                        label="Açıklama"
                                        fullWidth multiline
                                    ></TextField>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl sx={{ minWidth: 'calc(100%)', maxWidth: 300 }}>
                                        <Autocomplete
                                            {...defaultCategoryProps}
                                            multiple
                                            id="checkboxes-tags-demo"
                                            disableCloseOnSelect
                                            onChange={(event, newValue) => {
                                                setSelectedCategories(newValue as Array<Categories>);
                                            }}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox

                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.name}
                                                </li>
                                            )}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField {...params} label="Kategoriler" placeholder="Kategori" />
                                            )}
                                        />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack>
                                            <DesktopDatePicker
                                                label="Başlangıç Tarihi"
                                                inputFormat="DD/MM/YYYY"
                                                value={firstShowDate}
                                                onChange={(e) => {
                                                    setFirstShowDate(dayjs(e));
                                                    setAnimeForm({ ...animeForm, showTime: dayjs(e).format('DD/MM/YYYY') })
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px', marginBottom: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">İçerik Tipi</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={contentType}
                                            label="İçerik Tipi"
                                            onChange={(e) => {
                                                setContentType(e.target.value as any);
                                                setAnimeForm({ ...animeForm, videoType: e.target.value as VideoType })
                                            }}
                                        >
                                            <MenuItem value={VideoType.AnimeMovie}>Film</MenuItem>
                                            <MenuItem value={VideoType.AnimeSeries}>Anime Serisi</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{
                                    marginTop: '10px', marginBottom: '10px',
                                    maxWidth: '100%',
                                }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label1">Durum</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label1"
                                            id="demo-simple-select1"
                                            value={animeStatus}
                                            label="Durum"
                                            onChange={(e) => {
                                                setAnimeStatus(e.target.value as any);
                                                setAnimeForm({ ...animeForm, status: e.target.value as Status })
                                            }}
                                        >
                                            <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                                            <MenuItem value={Status.Abandoned}>Yarıda Bırakıldı</MenuItem>
                                            <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label2">Yaş Sınırı</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label2"
                                        id="demo-simple-select2"
                                        value={animeForm.ageLimit}
                                        label="Yaş Sınırı"
                                        onChange={(e) => {
                                            setAnimeForm({ ...animeForm, ageLimit: e.target.value })
                                        }}
                                    >
                                        <MenuItem value={"+7"}>+7</MenuItem>
                                        <MenuItem value={"+13"}>+13</MenuItem>
                                        <MenuItem value={"+18"}>+18</MenuItem>
                                    </Select>
                                </FormControl>

                                <Grid container spacing={2}>
                                    <Grid item sm={12} md={12} xs={12}>
                                        <TextField
                                            value={animeForm.malRating}
                                            onChange={(e) => setAnimeForm({ ...animeForm, malRating: e.target.value })}
                                            label="Mal Rating"
                                            fullWidth
                                        ></TextField>
                                    </Grid>
                                </Grid>
                                <Box>
                                    <TextField
                                        type={"number"}
                                        value={animeForm.seasonCount}
                                        onChange={(e) => setAnimeForm({ ...animeForm, seasonCount: parseInt(e.target.value) })}
                                        label="Sezon Sayısı"
                                        fullWidth
                                    ></TextField>
                                </Box>
                            </div>
                        </Paper>
                    </Grid>
                    <AnimeImageInfo />
                    <Grid item xs={12} md={12} sm={12}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Sezon Bilgileri</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <SeasonTabs
                                    addShowDrawer={(seasonID: number) => {
                                        setAnimeEpisodeForm({ episodeName: '', episodeDescription: '' } as AnimeEpisodes);
                                        setAddDialog(true);
                                        setSelectedSeasonID(seasonID);
                                    }}
                                    tabsHeader={10}
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </Grid>
            <FullDialog open={addDialog} handleClose={() => setAddDialog(false)}>
                <Box
                    sx={{ marginTop: '30px' }}
                    role="presentation"
                >
                    <Grid container sx={{ padding: '0px 15px' }} >
                        <Grid item sm={12} md={12} xs={12}>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={animeEpisodeForm.episodeName}
                                    onChange={(e) => setAnimeEpisodeForm({ ...animeEpisodeForm, episodeName: e.target.value })}
                                    label="Bölüm Adı"
                                    fullWidth
                                ></TextField>
                            </Box>
                            <Box
                                sx={{
                                    marginTop: '10px',
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    value={animeEpisodeForm.episodeDescription}
                                    onChange={(e) => setAnimeEpisodeForm({ ...animeEpisodeForm, episodeDescription: e.target.value })}
                                    multiline={true}
                                    rows={4}
                                    label="Bölüm Hakkında"
                                    fullWidth
                                >
                                </TextField>
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
            </FullDialog>
        </Loading>
    )
}



interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ISeasonTabsProps {
    tabsHeader: number,
    addShowDrawer?: (data: number) => void,
    editShowDrawer?: (data: number, seasonID: number) => void,
    deleteShowModal?: () => void,
}
const SeasonTabs = (props: ISeasonTabsProps) => {
    const [tabsHeader, setTabsHeader] = useState<Array<AnimeSeason>>([]);

    const [value, setValue] = React.useState(0);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AnimeSeason>('seasonName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    const [seasonEditDialog, setSeasonEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteSeasonDialog, setDeleteSeasonDialog] = useState(false);

    const [animeEpisodesService, setAnimeEpisodesService] = useState<Array<AnimeEpisodes>>([]);
    useEffect(() => {
        loadTabs();
    }, [value]);
    const loadTabs = () => {
        var tabs = new Array<AnimeSeason>();
        for (let index = 1; index <= props.tabsHeader; index++) {
            tabs.push({ seasonName: `${index}.Sezon` } as AnimeSeason)
        }
        setTabsHeader(tabs);
    }
    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - animeEpisodesService.length) : 0;
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
    return (
        <Loading loading={loading}>
            {tabsHeader != null && props.tabsHeader != 0 && <Grid item sm={12} xs={12} md={12}>
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
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <Button onClick={() => setSeasonEditDialog(true)} variant='contained'>
                                    {item.seasonName} düzenle
                                </Button>
                            </Box>
                            <DataTable
                                EnhancedTableToolbar={EnhancedTableToolbar}
                                rows={animeEpisodesService.map((item) => item.id.toString())}
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
                                        props.addShowDrawer(tabsHeader[value].id);
                                    }
                                }}
                                goEditPage={() => {
                                    if (props.editShowDrawer != undefined) {
                                        props.editShowDrawer(parseInt(selected[0]), tabsHeader[value].id);
                                    }
                                }}
                                handleDelete={() => {
                                    setDeleteDialog(true);
                                }}
                                tableName="Bölümler"
                                tableBody={!loading && animeEpisodesService.length != 0 &&
                                    <TableBody>
                                        {animeEpisodesService
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


            </Grid>}
        </Loading>
    );
}
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
const AnimeImageInfo = () => {
    return (
        <Grid item xs={12} md={12} sm={12} sx={{ marginBottom: '20px' }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Anime Görselleri</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={12} sm={12} >

                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    )
}
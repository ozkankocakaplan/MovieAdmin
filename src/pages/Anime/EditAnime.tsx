import React, { useCallback, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';



import { Add, Delete, Edit, PhotoCamera } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Box, Button, Checkbox, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { baseUrl, deleteAnime, deleteAnimeEpisode, getAnimeByID, getAnimeEpisodeContent, getAnimeEpisodeContentByEpisodeID, getAnimeEpisodesByID, getAnimeImageList, getAnimeSeasonsByAnimeID, getCategories, getCategoryTypes, postAnimeEpisode, postAnimeEpisodeContent, postAnimeSeason, putAnime, putAnimeEpisode, putAnimeEpisodeContent, putAnimeImage, putCategoryType } from '../../utils/api'
import { Anime, AnimeEpisodes, AnimeImages, AnimeSeason, Categories, CategoryType, Episodes, Status, Type, VideoType } from '../../types/Entites';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { GridExpandMoreIcon } from '@mui/x-data-grid';

import SeasonTabs from '../../components/SeasonTabs';
import DeleteDialog from '../../components/DeleteDialog';
import Loading from '../../components/Loading';
import FullDialog from '../../components/FullDialog';
import DataTable, { EnhancedTableToolbarProps } from '../../components/DataTable';
import { getComparator, Order, stableSort } from '../../components/TableHelper';
import { episodesCells } from '../../utils/HeadCells';
import { useNavigate, useParams } from 'react-router';
import { AxiosError } from 'axios';
import { useDropzone } from 'react-dropzone';
import MyDropzone from '../../components/MyDropzone';



const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

export default function EditAnime() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [deleteAnimeDialog, setDeleteAnimeDialog] = useState(false);

  const [categoriesServiceResponse, setCategoriesServiceResponse] = useState<Array<Categories>>([]);
  const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);

  const [contentType, setContentType] = useState<VideoType>(VideoType.AnimeMovie);
  const [animeStatus, setAnimeStatus] = useState<Status>(Status.Continues);
  const [firstShowDate, setFirstShowDate] = useState<Dayjs | null>(dayjs(new Date()));

  const [animeImages, setAnimeImages] = useState<Array<AnimeImages>>([]);

  const [animeForm, setAnimeForm] = useState<Anime>({ animeName: '', animeDescription: '', malRating: '', ageLimit: '', seasonCount: 1, showTime: firstShowDate?.toString(), siteRating: '', status: animeStatus, videoType: contentType } as Anime);
  const [animeSeasonServiceResponse, setAnimeSeasonServiceResponse] = useState<Array<AnimeSeason>>([]);

  const [animeEpisodeForm, setAnimeEpisodeForm] = useState<AnimeEpisodes>({ episodeDescription: '', episodeName: '' } as AnimeEpisodes);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const [selectedSeasonID, setSelectedSeasonID] = useState(0);
  const [selectedEpisodeID, setSelectedEpisodeID] = useState(0);

  const [seasonAddDialog, setSeasonAddDialog] = useState(false);

  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    loadData();

  }, []);

  useEffect(() => {
    if (selectedEpisodeID != 0) {
      loadAnimeEpisode();
    }
  }, [selectedEpisodeID])

  const loadData = async () => {
    await loadCategories();
    await loadAnimeInfo();
    await loadAnimeSeasons();
    await loadAnimeImages();
    setLoading(false);
  }
  const loadAnimeEpisode = async () => {
    await getAnimeEpisodesByID(selectedEpisodeID)
      .then((res) => {
        setAnimeEpisodeForm(res.data.entity);
      }).catch((er: AxiosError) => {
        console.log(er)
      })
  }
  const loadCategories = async () => {
    await getCategories()
      .then(async (res) => {
        if (res.data.isSuccessful) {
          setCategoriesServiceResponse(res.data.list);
          await getCategoryTypes(id as any, Type.Anime).then((response) => {
            setSelectedCategories(response.data.list.map((item) => {
              if (res.data.list.length != 0) {
                var check = res.data.list.find((x) => x.id === item.categoryID);
                if (check != null) {
                  return check.name;
                }
              }
              return "";
            }))
            setSelectedCategoriesID(response.data.list.map((i) => i.categoryID as any));
          }).catch((er: AxiosError) => {
            console.log(er)
          })
        }
      }).catch((er) => {
        console.log(er)
      });

  }
  const loadAnimeInfo = async () => {
    await getAnimeByID(id as any).then((res) => {
      if (res.data.isSuccessful) {
        setSelectedImage(baseUrl + res.data.entity.img);
        setAnimeForm(res.data.entity);
        setFirstShowDate(dayjs(res.data.entity.showTime));
        setAnimeStatus(res.data.entity.status);
        setContentType(res.data.entity.videoType);
      }
    }).catch((er: AxiosError) => {
      console.log(er)
    })
  }
  const loadAnimeSeasons = async () => {
    await getAnimeSeasonsByAnimeID(id as any)
      .then((res) => {
        setAnimeSeasonServiceResponse(res.data.list);
      })
      .catch((er: AxiosError) => {
        console.log(er)
      })
  }
  const loadAnimeImages = async () => {
    await getAnimeImageList(id as any).then((res) => {
      setAnimeImages(res.data.list);
    }).catch((er) => {
      console.log(er);
    })
  }
  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const { target: { value }, } = event;
    setSelectedCategories(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleSelectedCategoriesID = (id: number) => {
    var check = selectedCategoriesID.find((i) => i === id);
    if (check != undefined) {
      setSelectedCategoriesID(selectedCategoriesID.filter((y) => y !== id));
    }
    else {
      setSelectedCategoriesID([...selectedCategoriesID, id]);
    }
  }
  const updateAnime = async () => {
    await putAnime(animeForm);
    await putCategoryType(convertCategoryType());
    window.location.reload();
  }
  const convertCategoryType = () => {
    var newArray = Array<CategoryType>();
    selectedCategoriesID.map((item) => {
      newArray.push({ categoryID: item, type: Type.Anime, contentID: id as any } as CategoryType);
    })
    return newArray;
  }
  const updateButon = async () => {
    await putAnimeEpisode({ ...animeEpisodeForm, seasonID: selectedSeasonID })
      .then((res) => {
        window.location.reload();
      }).catch((er: AxiosError) => {
        console.log(er)
      })
  }
  const saveButon = async () => {
    setAddDialog(false);
    await postAnimeEpisode({ ...animeEpisodeForm, seasonID: selectedSeasonID, animeID: id as any })
      .then((res) => {
        window.location.reload();
      }).catch((er: AxiosError) => {
        console.log(er)
      })
  }

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
              {animeForm.animeName}
            </Typography>
            <Button onClick={() => setDeleteAnimeDialog(true)} sx={{ marginLeft: '10px' }} variant='outlined' startIcon={<Delete />}>
              Sil
            </Button>
          </Toolbar>
        </Paper>
        <div style={{ marginBottom: '20px', justifyContent: 'center', display: 'flex', flex: 1 }}>
          <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
            {selectedImage.length === 0 && <IconButton color="primary" aria-label="upload picture" component="label">
              <input onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  var form = new FormData();
                  form.append("animeImg", e.target.files[0] as any);
                  setSelectedImage(URL.createObjectURL(e.target.files[0]));
                  await putAnimeImage(form, id as any);
                  window.location.reload();
                }
              }}
                hidden accept="image/*" type="file" />
              <PhotoCamera />
            </IconButton>}
            {selectedImage.length !== 0 && <img src={selectedImage} style={{ height: '200px', width: '150px' }} />}
            {selectedImage.length !== 0 && <IconButton onClick={() => setSelectedImage('')} sx={{ position: 'relative', marginTop: '-180px', marginLeft: '0px' }}>
              <Delete />
            </IconButton>}
          </Grid>
        </div>
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
                  <MyDropzone data={animeImages} animeID={id as any} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} sm={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<GridExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Anime Bilgileri</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                          <InputLabel id="demo-multiple-checkbox-label">Kategoriler</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleChange}
                            input={<OutlinedInput label="Kategoriler" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                          >
                            {
                              categoriesServiceResponse.length != 0 &&
                              categoriesServiceResponse.map((item, index) => {
                                return <MenuItem onClick={() => handleSelectedCategoriesID(item.id != null ? item.id : 0)} key={item.id} value={item.name}>
                                  <Checkbox checked={selectedCategories.indexOf(item.name) > -1} />
                                  <ListItemText primary={item.name} />
                                </MenuItem>
                              })
                            }
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Stack>
                            <DesktopDatePicker
                              label="Gösterim Tarihi"
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
                          <InputLabel id="demo-simple-select-label">Durum</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={animeStatus}
                            label="Durum"
                            onChange={(e) => {
                              setAnimeStatus(e.target.value as any);
                              setAnimeForm({ ...animeForm, status: e.target.value as Status })
                            }}
                          >
                            <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                            <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                        <Grid item sm={6} md={6} xs={12} >
                          <TextField
                            value={animeForm.ageLimit}
                            onChange={(e) => setAnimeForm({ ...animeForm, ageLimit: e.target.value })}
                            label="Yaş Sınırı"
                            fullWidth
                          ></TextField>
                        </Grid>
                        <Grid item sm={6} md={6} xs={12}>
                          <TextField
                            type={"number"}
                            value={animeForm.seasonCount}
                            onChange={(e) => setAnimeForm({ ...animeForm, seasonCount: parseInt(e.target.value) })}
                            label="Sezon Sayısı"
                            fullWidth
                          ></TextField>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                        <Grid item sm={6} md={6} xs={12}>
                          <TextField
                            value={animeForm.malRating.toString()}
                            onChange={(e) => setAnimeForm({ ...animeForm, siteRating: e.target.value })}
                            label="Site Rating"
                            fullWidth
                          ></TextField>
                        </Grid>
                        <Grid item sm={6} md={6} xs={12}>
                          <TextField
                            value={animeForm.malRating.toString()}
                            onChange={(e) => setAnimeForm({ ...animeForm, malRating: e.target.value })}
                            label="Mal Rating"
                            fullWidth
                          ></TextField>
                        </Grid>
                      </Grid>
                    </div>
                  </Paper>
                  <Box sx={{ margin: '15px 0px' }}>
                    <Button onClick={updateAnime} fullWidth variant='contained'>
                      Kaydet
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} sm={12}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', margin: '5px 0px' }}>
            <Button onClick={() => setSeasonAddDialog(true)} variant='contained'>
              Sezon Ekle
            </Button>
          </Box>
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
                editShowDrawer={(episodeID: number, seasonID: number) => {
                  setSelectedEpisodeID(episodeID);
                  setSelectedSeasonID(seasonID);
                  setEditDialog(true)
                }}
                addShowDrawer={(seasonID: number) => {
                  setAnimeEpisodeForm({ episodeName: '', episodeDescription: '' } as AnimeEpisodes);
                  setAddDialog(true);
                  setSelectedSeasonID(seasonID);
                }}
                tabsHeader={animeSeasonServiceResponse}
              />
            </AccordionDetails>
          </Accordion>
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
        <FullDialog open={editDialog} handleClose={() => setEditDialog(false)}>
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
                    onClick={updateButon}
                    size='medium'
                    fullWidth variant='contained'>
                    Kaydet
                  </Button>
                </Box>
              </Grid>
              <Grid item sm={12} md={12} xs={12}>
                <EpisodesTable episodeID={selectedEpisodeID} />
              </Grid>
            </Grid>
          </Box>
        </FullDialog>
        <DeleteDialog
          open={deleteAnimeDialog}
          handleClose={() => { setDeleteAnimeDialog(false) }}
          dialogTitle={"Silmek istiyor musunuz"}
          dialogContentText={"Bu işlem geri alınamaz"}
          yesButon={
            <Button onClick={async () => {
              await deleteAnime(id as any)
                .then((res) => {
                  navigate("/anime")
                }).catch((er: AxiosError) => {
                  console.log(er);
                })
            }}>
              Sil
            </Button>
          }
          noButon={
            <Button onClick={() => { setDeleteAnimeDialog(false) }}>
              Kapat
            </Button>
          }
        />
        <AddSeason animeID={id as any} drawerState={seasonAddDialog} handleCloseDrawer={() => setSeasonAddDialog(false)} />
      </Grid>
    </Loading >
  )
}



const AddSeason = (props: { drawerState: boolean, animeID: number, handleCloseDrawer: () => void }) => {
  const [seasonForm, setSeasonForm] = useState({ seasonName: '', } as AnimeSeason);
  const saveButon = async () => {

    await postAnimeSeason({ ...seasonForm, animeID: props.animeID })
      .then((res) => {
        if (res.data.isSuccessful) {
          window.location.reload();
        }

      }).catch((er) => {
        console.log(er)
      })
  }
  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
      anchor={'right'}
      open={props.drawerState}
      onClose={props.handleCloseDrawer}
    >
      <Box
        role="presentation"
        sx={{
          marginTop: '10px'
        }}
      >
        <Grid container>
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
                    value={seasonForm.seasonName}
                    onChange={(e) => setSeasonForm({ ...seasonForm, seasonName: e.target.value })}
                    label="Sezon Adı"
                    fullWidth
                  ></TextField>
                </Box>
                <Box
                  sx={{
                    marginTop: '10px',
                    maxWidth: '100%',
                  }}>
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
        </Grid>
      </Box>
    </Drawer>
  )
}

const EpisodesTable = (props: { episodeID: number }) => {
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [addEpidoes, setAddEpisodes] = useState(false);
  const [editEpisodes, setEditEpisodes] = useState(false);


  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Episodes>('alternativeName');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [serviceResponse, setServiceResponse] = useState<Array<Episodes>>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEpisodeID, setSelectedEpisodeID] = useState(0);

  useEffect(() => {
    loadEpisodes();
    return () => {
      setLoading(true);
    }
  }, [props.episodeID])


  const loadEpisodes = async () => {
    await getAnimeEpisodeContentByEpisodeID(props.episodeID)
      .then((res) => {
        setServiceResponse(res.data.list);
      }).catch((er: AxiosError) => {
        console.log(er)
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
  const handleDeleteItem = () => {
    setSelected([]);
    var newData = Array<Episodes>();
    newData = serviceResponse.filter((item) => {
      var check = selected.some((y) => parseInt(y) === item.id);
      if (check == false) {
        return item;
      }
    }) as Array<Episodes>;
    return newData;
  }
  return (
    <React.Fragment>
      <DataTable
        EnhancedTableToolbar={EnhancedTableToolbar}
        rows={serviceResponse.map((item) => item.id.toString())}
        HeadCell={episodesCells}
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
        goAddPage={() => { setAddEpisodes(true) }}
        goEditPage={() => {
          setEditEpisodes(true);
          setSelectedEpisodeID(parseInt(selected[0]));
        }}
        handleDelete={() => { setDeleteDialog(true) }}
        tableName="Videolar"
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
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.alternativeName}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.alternativeVideoUrl}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.alternativeVideoDownloadUrl}
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
      <DeleteDialog
        open={deleteDialog}
        handleClose={() => { setDeleteDialog(false) }}
        dialogTitle={"Silmek istiyor mususnuz"}
        dialogContentText={"Bu işlem geri alınamaz"}
        yesButon={
          <Button onClick={async () => {
            await deleteAnimeEpisode(selected.map((item) => parseInt(item)))
              .then((res) => {
                setServiceResponse(handleDeleteItem());
              })
              .catch((er) => {
                console.log(er);
              })
            setDeleteDialog(false);
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
      <AddEpisodesRightDrawer handleAddEpisode={(entity: Episodes) => {
        setServiceResponse([...serviceResponse, entity]);
      }} episodeID={props.episodeID} drawerState={addEpidoes} handleCloseDrawer={() => setAddEpisodes(false)} />
      <EditEpisodesRightDrawer handleUpdateEpisode={(entity: Episodes) => {
        setServiceResponse(serviceResponse.map((item) => item.id === entity.id ? entity : item));
      }} id={selectedEpisodeID} drawerState={editEpisodes} handleCloseDrawer={() => setEditEpisodes(false)} />
    </React.Fragment>
  )
}
const AddEpisodesRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, episodeID: number, handleAddEpisode: (entity: Episodes) => void }) => {
  const [episodeForm, setEpisodeForm] = useState<Episodes>({ episodeID: props.episodeID, alternativeName: '', alternativeVideoUrl: '', alternativeVideoDownloadUrl: '' } as Episodes);

  const saveButon = async () => {
    await postAnimeEpisodeContent(episodeForm).then((res) => {
      if (res.data.isSuccessful) {
        setEpisodeForm({ episodeID: props.episodeID, alternativeName: '', alternativeVideoDownloadUrl: '', alternativeVideoUrl: '' } as Episodes);
        props.handleCloseDrawer();
        props.handleAddEpisode(res.data.entity);
      }
    }).catch((er: AxiosError) => {
      console.log(er)
    })
  }
  return (
    <Drawer
      sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
      anchor={'right'}
      open={props.drawerState}
      onClose={props.handleCloseDrawer}
    >
      <Box
        role="presentation"
        sx={{
          marginTop: '30px'
        }}
      >
        <Grid container sx={{ padding: '0px 15px' }} >
          <Grid item sm={12} md={12} xs={12}>
            <Box
              sx={{
                marginTop: '10px',
                maxWidth: '100%',
              }}>
              <TextField
                value={episodeForm.alternativeName}
                onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeName: e.target.value })}
                label="Alternatif Adı"
                fullWidth
              ></TextField>
            </Box>
            <Box
              sx={{
                marginTop: '10px',
                maxWidth: '100%',
              }}>
              <TextField
                value={episodeForm.alternativeVideoUrl}
                onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeVideoUrl: e.target.value })}
                label="Video Url"
                fullWidth
              ></TextField>
            </Box>
            <Box
              sx={{
                marginTop: '10px',
                maxWidth: '100%',
              }}>
              <TextField
                value={episodeForm.alternativeVideoDownloadUrl}
                onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeVideoDownloadUrl: e.target.value })}
                label="İndirme Url"
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
      </Box>
    </Drawer>
  )
}
const EditEpisodesRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void, id: number, handleUpdateEpisode: (entity: Episodes) => void }) => {
  const [loading, setLoading] = useState(true);
  const [episodeForm, setEpisodeForm] = useState<Episodes>({ alternativeName: '', alternativeVideoUrl: '', alternativeVideoDownloadUrl: '' } as Episodes);
  useEffect(() => {
    if (props.id != 0) {
      loadEpisode();
    }
    else {
      setLoading(false);
    }
    return () => {
      setLoading(true);
    }
  }, [props.id])


  const loadEpisode = async () => {
    await getAnimeEpisodeContent(props.id)
      .then((res) => {
        if (res.data.isSuccessful) {
          setEpisodeForm(res.data.entity as Episodes);
        }
      }).catch((er) => {
        console.log(er)
      });
    setLoading(false);
  }
  const saveButon = async () => {
    await putAnimeEpisodeContent(episodeForm).then((res) => {
      if (res.data.isSuccessful) {
        setEpisodeForm({ alternativeName: '', alternativeVideoDownloadUrl: '', alternativeVideoUrl: '' } as Episodes);
        props.handleCloseDrawer();
        props.handleUpdateEpisode(res.data.entity);
      }
    }).catch((er: AxiosError) => {
      console.log(er)
    })
  }

  return (
    <Loading loading={loading}>
      <Drawer
        sx={{ '& .MuiDrawer-paper': { top: '0px' }, zIndex: 1500 }}
        anchor={'right'}
        open={props.drawerState}
        onClose={props.handleCloseDrawer}
      >
        <Box
          role="presentation"
          sx={{
            marginTop: '30px'
          }}
        >
          <Grid container sx={{ padding: '0px 15px' }} >
            <Grid item sm={12} md={12} xs={12}>
              <Box
                sx={{
                  marginTop: '10px',
                  maxWidth: '100%',
                }}>
                <TextField
                  value={episodeForm.alternativeName}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeName: e.target.value })}
                  label="Alternatif Adı"
                  fullWidth
                ></TextField>
              </Box>
              <Box
                sx={{
                  marginTop: '10px',
                  maxWidth: '100%',
                }}>
                <TextField
                  value={episodeForm.alternativeVideoUrl}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeVideoUrl: e.target.value })}
                  label="Video Url"
                  fullWidth
                ></TextField>
              </Box>
              <Box
                sx={{
                  marginTop: '10px',
                  maxWidth: '100%',
                }}>
                <TextField
                  value={episodeForm.alternativeVideoDownloadUrl}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, alternativeVideoDownloadUrl: e.target.value })}
                  label="İndirme Url"
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
        </Box>
      </Drawer>
    </Loading>
  )
}

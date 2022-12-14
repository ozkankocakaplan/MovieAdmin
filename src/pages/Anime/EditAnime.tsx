import React, { useCallback, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';



import { Add, Delete, Edit, PhotoCamera } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { addAutoEpisode, baseUrl, deleteAnime, deleteAnimeEpisode, getAnimeByID, getAnimeEpisodeContent, getAnimeEpisodeContentByEpisodeID, getAnimeEpisodesByID, getAnimeImageList, getAnimeSeasonsByAnimeID, getCategories, getCategoryTypes, postAnimeEpisode, postAnimeEpisodeContent, postAnimeImages, postAnimeSeason, putAnime, putAnimeEpisode, putAnimeEpisodeContent, putAnimeImage, putCategoryType } from '../../utils/api'
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
import { useDispatch, useSelector } from 'react-redux';
import { setAnimeEpisode, setAnimeEpisodeByID, setAnimeEpisodes } from '../../store/features/episodeReducers';
import { setAnimeSeason, setAnimeSeasons } from '../../store/features/seasonReducers';
import { RootState } from '../../store';
import { setAnimeFiles, setUploadImage } from '../../store/features/mainReducers';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



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
  const { animeSeasons } = useSelector((x: RootState) => x.seasonReducers);
  const [loading, setLoading] = useState(true);
  const [deleteAnimeDialog, setDeleteAnimeDialog] = useState(false);

  const [categoriesServiceResponse, setCategoriesServiceResponse] = useState<Array<Categories>>([]);
  // const [selectedCategoriesID, setSelectedCategoriesID] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Array<Categories>>([]);

  const [contentType, setContentType] = useState<VideoType>(VideoType.AnimeMovie);
  const [animeStatus, setAnimeStatus] = useState<Status>(Status.Continues);
  const [firstShowDate, setFirstShowDate] = useState<Dayjs | null>(dayjs(new Date()));

  const [animeImages, setAnimeImages] = useState<Array<AnimeImages>>([]);

  const [animeForm, setAnimeForm] = useState<Anime>({ animeName: '', animeDescription: '', malRating: '', ageLimit: '', seasonCount: 1, showTime: firstShowDate?.toString(), siteRating: '', status: animeStatus, videoType: contentType, fansub: '' } as Anime);

  const [animeEpisodeForm, setAnimeEpisodeForm] = useState<AnimeEpisodes>({ episodeDescription: '', episodeName: '' } as AnimeEpisodes);

  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const [selectedSeasonID, setSelectedSeasonID] = useState(0);
  const [selectedEpisodeID, setSelectedEpisodeID] = useState(0);

  const [seasonAddDialog, setSeasonAddDialog] = useState(false);

  const [selectedImage, setSelectedImage] = useState('');

  const [episodeCountDialog, setEpisodeCountDialog] = useState(false);
  const [startCount, setStartCount] = useState('');
  const [endCount, setEndCount] = useState('');
  const { animeFiles } = useSelector((x: RootState) => x.mainReducers);
  const dispatch = useDispatch();

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
            if (response.data.count != 0) {
              setSelectedCategories(response.data.list.map((item) => item.categories) as any);
            }

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
        setSelectedImage(res.data.entity.img);
        setAnimeForm({ ...res.data.entity, img: res.data.entity.img != null ? res.data.entity.img : "", fansub: res.data.entity.fansub != null ? res.data.entity.fansub : "" });
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
        dispatch(setAnimeSeasons(res.data.list));
        if (res.data.list.length != 0) {
          setSelectedSeasonID(res.data.list[0].id);
        }
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
  const updateAnime = async () => {
    await putAnime(animeForm);
    await putCategoryType(convertCategoryType());
    var formData = new FormData();
    animeFiles.map((item) => {
      formData.append("files", item as any);
    })
    await postAnimeImages(formData, id as any).then((res) => {
      res.data.list.map((item) => {
        dispatch(setUploadImage(item))
      })
    });
    dispatch(setAnimeFiles([]));
    setEditDialog(false);
  }
  const convertCategoryType = () => {
    var newArray = Array<CategoryType>();
    selectedCategories.map((item: any) => {
      newArray.push({ categoryID: item.id, type: Type.Anime, contentID: id as any } as CategoryType);
    })
    return newArray;
  }
  const updateButon = async () => {
    await putAnimeEpisode({ ...animeEpisodeForm, seasonID: selectedSeasonID })
      .then((res) => {
        dispatch(setAnimeEpisodeByID(res.data.entity));
      }).catch((er: AxiosError) => {
        console.log(er)
      });
  }
  const saveButon = async () => {
    setAddDialog(false);
    await postAnimeEpisode({ ...animeEpisodeForm, seasonID: selectedSeasonID, animeID: id as any })
      .then((res) => {
        dispatch(setAnimeEpisode(res.data.entity));
        setSelectedEpisodeID(res.data.entity.id);
        setSelectedSeasonID(res.data.entity.seasonID);
      }).catch((er: AxiosError) => {
        console.log(er)
      });
    setEditDialog(true);
  }
  const defaultCategoryProps = {
    options: categoriesServiceResponse,
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
              {animeForm.animeName}
            </Typography>
            <Button onClick={updateAnime} variant='contained'>
              Kaydet
            </Button>
            <Button onClick={() => setDeleteAnimeDialog(true)} sx={{ marginLeft: '10px' }} variant='outlined' startIcon={<Delete />}>
              Sil
            </Button>
          </Toolbar>
        </Paper>
        <div style={{ marginBottom: '20px', justifyContent: 'center', display: 'flex', flex: 1 }}>
          <Grid item sx={{ marginTop: '20px', justifyContent: 'center', alignItems: 'center', display: 'flex' }} sm={12} md={12} xs={12}>
            {/* {selectedImage === null ? <IconButton color="primary" aria-label="upload picture" component="label">
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
            </IconButton>
              :
              <img src={selectedImage} style={{ height: '200px', width: '150px' }} />
            } */}
            {selectedImage !== null && <img src={selectedImage} style={{ height: '200px', width: '150px' }} />}
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
                  <Box sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
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
                          value={animeForm.img}
                          onChange={(e) => setAnimeForm({ ...animeForm, img: animeForm.img != null ? e.target.value : "" })}
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
                            value={selectedCategories}
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
                            <MenuItem value={Status.Abandoned}>Yarıda Bırakıldı</MenuItem>
                            <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Yaş Sınırı</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={animeForm.ageLimit.replace(' ', '')}
                          label="Yaş Sınırı"
                          onChange={(e) => {

                            setAnimeForm({ ...animeForm, ageLimit: e.target.value })
                          }}
                        >
                          <MenuItem value={"7"}>+7</MenuItem>
                          <MenuItem value={"13"}>+13</MenuItem>
                          <MenuItem value={"18"}>+18</MenuItem>
                        </Select>
                      </FormControl>
                      <Grid item sm={12} md={12} xs={12}>
                        <TextField
                          value={animeForm.malRating.toString()}
                          onChange={(e) => setAnimeForm({ ...animeForm, malRating: e.target.value })}
                          label="Mal Rating"
                          fullWidth
                        ></TextField>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item sm={12} md={12} xs={12}>
                          <TextField
                            value={animeForm.fansub}
                            onChange={(e) => setAnimeForm({ ...animeForm, fansub: e.target.value })}
                            label="Fansub"
                            fullWidth
                          ></TextField>
                        </Grid>
                      </Grid>
                    </div>
                  </Box>

                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} sm={12} sx={{ marginTop: '20px', }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', margin: '5px 0px', }}>
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
                addEpisodeCountModal={() => setEpisodeCountDialog(true)}
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
                tabsHeader={animeSeasons}
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
        <Dialog fullWidth open={episodeCountDialog} onClose={() => setEpisodeCountDialog(false)}>
          <DialogTitle>Otomatik Bölüm Oluştur</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aşağıya girdiğiniz değer aralığında sezona bölüm eklenecektir.
            </DialogContentText>
            <TextField
              onChange={(e) => setStartCount(e.target.value)}
              value={startCount.toString()}
              autoFocus
              margin="dense"
              id="name"
              label="Başlangıç Sayısı"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              onChange={(e) => setEndCount(e.target.value)}
              value={endCount.toString()}
              autoFocus
              margin="dense"
              id="name"
              label="Bitiş Sayısı"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => {
              await addAutoEpisode(parseInt(startCount), parseInt(endCount), id as any, selectedSeasonID)
                .then((res) => {
                  if (res.data.count != 0) {
                    res.data.list.map((el) => {
                      dispatch(setAnimeEpisode(el));
                    })
                  }
                })
              setEpisodeCountDialog(false);
            }}>Oluştur</Button>
          </DialogActions>
        </Dialog>
        <AddSeason animeID={id as any} drawerState={seasonAddDialog} handleCloseDrawer={() => setSeasonAddDialog(false)} />
      </Grid>

    </Loading >
  )
}



const AddSeason = (props: { drawerState: boolean, animeID: number, handleCloseDrawer: () => void }) => {
  const [seasonForm, setSeasonForm] = useState({ seasonName: '', } as AnimeSeason);
  const dispatch = useDispatch();
  const saveButon = async () => {

    await postAnimeSeason({ ...seasonForm, animeID: props.animeID })
      .then((res) => {
        if (res.data.isSuccessful) {
          dispatch(setAnimeSeason(res.data.entity));
        }

      }).catch((er) => {
        console.log(er)
      });
    props.handleCloseDrawer();
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
                label="Embed Link"
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
                label="İndirme Link"
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
                  label="Embed Link"
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
                  label="İndirme Link"
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

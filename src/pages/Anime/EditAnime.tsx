import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';



import { Add, Delete, Edit, Save } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, alpha, Box, Button, Checkbox, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TableBody, TableCell, TableRow, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { getCategories } from '../../utils/api'
import { Categories, Status } from '../../types/Entites';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { GridExpandMoreIcon } from '@mui/x-data-grid';

import SeasonTabs from '../../components/SeasonTabs';
import DeleteDialog from '../../components/DeleteDialog';
import ServiceResponse from '../../types/ServiceResponse';
import Loading from '../../components/Loading';
import RightDrawer from '../../components/RightDrawer';
import FullDialog from '../../components/FullDialog';
import DataTable, { EnhancedTableToolbarProps } from '../../components/DataTable';
import { getComparator, Order, stableSort } from '../../components/TableHelper';
import { categoryCells, episodesCells } from '../../utils/HeadCells';



const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

export default function EditAnime() {

  const [loading, setLoading] = useState(true);
  const [deleteAnime, setDeleteAnime] = useState(false);

  const [categoriesServiceResponse, setCategoriesServiceResponse] = useState<ServiceResponse<Categories>>({} as ServiceResponse<Categories>);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);



  const [age, setAge] = React.useState('');
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54'),
  );
  useEffect(() => {
    loadCategories();
  }, [])
  const loadCategories = async () => {
    await getCategories()
      .then((res) => {
        setCategoriesServiceResponse(res.data);
      }).catch((er) => {
        console.log(er)
      });
    setLoading(false);
  }
  const handleSelectChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const { target: { value }, } = event;
    setSelectedCategories(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
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
              Anime Adı
            </Typography>
            <Button onClick={() => setDeleteAnime(true)} sx={{ marginLeft: '10px' }} variant='outlined' startIcon={<Delete />}>
              Sil
            </Button>
          </Toolbar>
        </Paper>
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
                <Grid item xs={12} md={12} sm={12} sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                  <div style={{ padding: 5 }}>
                    <Box
                      sx={{
                        maxWidth: '100%',
                      }}>
                      <TextField
                        label="Film veya Dizi Adı"
                        fullWidth
                      ></TextField>
                    </Box>
                    <Box
                      sx={{
                        maxWidth: '100%',
                      }}>
                      <TextField
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
                          {categoriesServiceResponse.list != null && categoriesServiceResponse.list.map((item) => (
                            <MenuItem key={item.id} value={item.name.toString()}>
                              <Checkbox checked={selectedCategories.indexOf(item.name.toString()) > -1} />
                              <ListItemText primary={item.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                          <DesktopDatePicker
                            label="Gösterim Tarihi"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleDateChange}
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
                          value={age}
                          label="İçerik Tipi"
                          onChange={handleSelectChange}
                        >
                          <MenuItem value={Status.Continues}>Film</MenuItem>
                          <MenuItem value={Status.Completed}>Anime Serisi</MenuItem>
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
                          value={age}
                          label="Durum"
                          onChange={handleSelectChange}
                        >
                          <MenuItem value={Status.Continues}>Devam Ediyor</MenuItem>
                          <MenuItem value={Status.Completed}>Tamamlandı</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Grid container spacing={2} sx={{ '& .MuiGrid-item': { paddingTop: 0 } }}>
                      <Grid item sm={4} md={4} xs={12} >
                        <TextField
                          label="Yaş Sınırı"
                          fullWidth
                        ></TextField>
                      </Grid>
                      <Grid item sm={4} md={4} xs={12}>
                        <TextField
                          type="number"
                          label="Sezon Sayısı"
                          fullWidth
                        ></TextField>
                      </Grid>
                      <Grid item sm={4} md={4} xs={12}>
                        <TextField
                          label="Mal Rating"
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Box sx={{
                      marginTop: '10px', marginBottom: '10px',
                      maxWidth: '100%',
                    }}>
                      <Button fullWidth variant='outlined'>
                        Kaydet
                      </Button>
                    </Box>
                  </div>

                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={12} sm={12} sx={{ marginTop: '10px' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<GridExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Sezon Bilgileri</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SeasonTabs
                editShowDrawer={() => setEditDialog(true)}
                addShowDrawer={() => setAddDialog(true)}
                tabsHeader={[
                  {
                    id: 1,
                    animeID: 1,
                    seasonName: 'Sezon 1',
                    createTime: new Date().toString()
                  },
                  {
                    id: 2,
                    animeID: 2,
                    seasonName: 'Sezon 2',
                    createTime: new Date().toString()
                  },
                  {
                    id: 3,
                    animeID: 3,
                    seasonName: 'Sezon 3',
                    createTime: new Date().toString()
                  }
                ]}
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
                    multiline={true}
                    rows={4}
                    label="Bölüm Hakkında"
                    fullWidth
                  >
                  </TextField>
                </Box>
              </Grid>
              <Grid item sm={12} md={12} xs={12}>
                <EpisodesTable />
              </Grid>
              <Grid item sm={12} md={12} xs={12}>
                <Box
                  sx={{
                    marginTop: '10px',
                  }}>
                  <Button
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
                    multiline={true}
                    rows={4}
                    label="Bölüm Hakkında"
                    fullWidth
                  >
                  </TextField>
                </Box>
              </Grid>
              <Grid item sm={12} md={12} xs={12}>
                <EpisodesTable />
              </Grid>
              <Grid item sm={12} md={12} xs={12}>
                <Box
                  sx={{
                    marginTop: '10px',
                  }}>
                  <Button
                    size='medium'
                    fullWidth variant='contained'>
                    Kaydet
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </FullDialog>
        <DeleteDialog
          open={deleteAnime}
          handleClose={() => { setDeleteAnime(false) }}
          dialogTitle={"Silmek istiyor musunuz"}
          dialogContentText={"Bu işlem geri alınamaz"}
          yesButon={
            <Button onClick={async () => {
              window.location.reload();
            }}>
              Sil
            </Button>
          }
          noButon={
            <Button onClick={() => { setDeleteAnime(false) }}>
              Kapat
            </Button>
          }
        />
      </Grid>
    </Loading >
  )
}

const EpisodesTable = () => {

  const [addEpidoes, setAddEpisodes] = useState(false);
  const [editEpisodes, setEditEpisodes] = useState(false);


  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Categories>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [serviceResponse, setServiceResponse] = useState<Array<Categories>>([]);
  const [loading, setLoading] = useState(true);

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
        goEditPage={() => { setEditEpisodes(true) }}
        handleDelete={() => { }}
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
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
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
      <AddEpisodesRightDrawer drawerState={addEpidoes} handleCloseDrawer={() => setAddEpisodes(false)} />
      <EditEpisodesRightDrawer drawerState={editEpisodes} handleCloseDrawer={() => setEditEpisodes(false)} />
    </React.Fragment>
  )
}
const AddEpisodesRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void }) => {
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
const EditEpisodesRightDrawer = (props: { drawerState: boolean, handleCloseDrawer: () => void }) => {
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

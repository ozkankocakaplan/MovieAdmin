import React, { useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';

import { Add } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, TextField, Toolbar, Typography } from '@mui/material'
import { getCategories } from '../../utils/api'
import { Status } from '../../types/Entites';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';


export default function AddAnime() {
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [age, setAge] = React.useState('');
    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs('2014-08-18T21:11:54'),
    );

    const handleSelectChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const { target: { value }, } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const handleDateChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };
    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = async () => {
        await getCategories()
            .then((res) => {
                console.log(res.data);
            }).catch((er) => {
                console.log(er)
            });
    }
    return (
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
                    <Button variant='outlined'>
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
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Kategoriler" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {names.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={personName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
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
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    )
}
const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
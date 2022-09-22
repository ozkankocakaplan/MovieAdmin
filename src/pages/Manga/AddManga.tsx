import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Status } from '../../types/Entites';

export default function AddManga() {
    const [age, setAge] = useState('');
    const handleSelectChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
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
                        Yeni Manga Ekle
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
                                    label="Manga Adı"
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
                            <Grid item sm={12} md={12} xs={12} >
                                <TextField
                                    label="Yaş Sınırı"
                                    fullWidth
                                ></TextField>
                            </Grid>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    )
}

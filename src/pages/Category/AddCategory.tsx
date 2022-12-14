import { Add } from '@mui/icons-material'
import { Box, Button, Grid, Paper, TextField, Toolbar, Typography } from '@mui/material'
import { AxiosError } from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import ResultSnackbar, { Result } from '../../components/ResultSnackbar';
import { Categories } from '../../types/Entites';
import { postCategory } from '../../utils/api';

export default function AddCategory() {
    var navigate = useNavigate();
    const [categoryForm, setCategoryForm] = useState<Categories>({ name: '' } as Categories);
    const [formCheck, setFormCheck] = useState<boolean>(false);
    const [result, setResult] = useState<Result>({ status: false, text: '' });
    const [open, setOpen] = useState(false);
    const saveButon = async () => {
        if (categoryForm.name?.length != 0) {
            setFormCheck(false);
            await postCategory(categoryForm).then((res) => {
                if (res.data.isSuccessful) {
                    setResult({ status: true, text: "Kategori Eklendi" });
                    setTimeout(() => {
                        navigate("/categories");
                    }, 700);
                }
                else {
                    setResult({ status: false, text: "Kategori mevcut" })
                }
            }).catch((er: AxiosError) => {
                setResult({ status: false, text: er.message })
            })
            setOpen(true);

        }
        else {
            setFormCheck(true)
        }
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
                        Yeni Kategori Ekle
                    </Typography>
                    <Button onClick={saveButon} variant='outlined' startIcon={<Add />}>
                        Kaydet
                    </Button>
                </Toolbar>
            </Paper>
            <Grid container spacing={4}>
                <Grid item xs={12} md={12} sm={12} >
                    <Paper sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 }, '& .MuiFormHelperText-root': { ml: '2px' } }}>
                        <div style={{ padding: 10 }}>
                            <Box
                                sx={{
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    onChange={(e) => {
                                        if (e.currentTarget.value.length != 0) {
                                            setFormCheck(false);
                                        }
                                        setCategoryForm({ ...categoryForm, name: e.currentTarget.value })
                                    }}
                                    value={categoryForm.name}
                                    error={formCheck}
                                    label="Kategori Adı"
                                    fullWidth size='small'
                                ></TextField>
                            </Box>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
            <ResultSnackbar
                props={{ anchorOrigin: { horizontal: 'center', vertical: 'bottom' }, autoHideDuration: 700 }}
                result={result} open={open} closeOpen={() => setOpen(false)} />
        </Grid>
    )
}

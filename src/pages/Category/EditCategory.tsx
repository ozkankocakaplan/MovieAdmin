import React, { useEffect, useState } from 'react'

import { Box } from '@mui/system';
import { Button, Grid, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { Categories } from '../../types/Entites';
import { getCategory, putCategory } from '../../utils/api';
import { Save } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { AxiosError } from 'axios';
import ResultSnackbar, { Result } from '../../components/ResultSnackbar';
import DeleteDialog from '../../components/DeleteDialog';

export default function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState({} as Categories);
    const [formCheck, setFormCheck] = useState<boolean>(false);
    const [result, setResult] = useState<Result>({ status: false, text: '' });
    const [open, setOpen] = useState(false);
    useEffect(() => {
        loadCategory();
        return () => {
            setLoading(true);
        }
    }, [id])

    const loadCategory = async () => {
        if (id != null) {
            await getCategory(parseInt(id)).then((res) => {
                setCategory(res.data.entity);
            }).catch((er) => {

            });
            setLoading(false);
        }
    }
    const saveButon = async () => {
        if (category.name?.length != 0) {
            setFormCheck(false);
            await putCategory(category).then((res) => {
                if (res.data.isSuccessful) {
                    setResult({ status: true, text: "Değişiklikler Kaydedildi." })
                }
                else {
                    setResult({ status: false, text: res.data.exceptionMessage.toString() })
                }
            }).catch((er: AxiosError) => {
                setResult({ status: false, text: er.message })
            });
            setOpen(true);
            setTimeout(() => {
                navigate("/categories");
            }, 700);
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
                        Kategori Düzenle
                    </Typography>
                    <Button onClick={saveButon} variant='outlined' startIcon={<Save />}>
                        Kaydet
                    </Button>
                </Toolbar>
            </Paper>
            <Grid container spacing={4}>
                <Grid item xs={12} md={12} sm={12} >
                    <Paper sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 }, '& .MuiFormHelperText-root': { ml: '2px' } }}>
                        {!loading && <div style={{ padding: 10 }}>
                            <Box
                                sx={{
                                    maxWidth: '100%',
                                }}>
                                <TextField
                                    onChange={(e) => {
                                        if (e.currentTarget.value.length != 0) {
                                            setFormCheck(false);
                                        }
                                        setCategory({ ...category, name: e.currentTarget.value })
                                    }}
                                    value={category.name}
                                    error={formCheck}
                                    label="Kategori Adı"
                                    fullWidth size='small'
                                ></TextField>
                            </Box>
                        </div>}
                    </Paper>
                </Grid>

            </Grid>

            <ResultSnackbar
                props={{ anchorOrigin: { horizontal: 'center', vertical: 'bottom' }, autoHideDuration: 700 }}
                result={result} open={open} closeOpen={() => setOpen(false)} />

        </Grid>
    )
}

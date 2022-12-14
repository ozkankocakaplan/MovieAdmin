import { Book, Movie, People, PersonPin, SchemaRounded } from '@mui/icons-material';
import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { ReportModels } from '../types/Entites';
import { getDashboardReport } from '../utils/api';
import Anime from './Anime';





export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardReport, setDashboardReport] = useState<ReportModels>({} as ReportModels);
    useEffect(() => {
        loadDashboardReport();
        return () => {
            setLoading(true);
        }
    }, [])
    const loadDashboardReport = async () => {
        await getDashboardReport()
            .then((res) => {
                setDashboardReport(res.data.entity);
            }).catch((er) => {
                console.log(er)
            });
        setLoading(false);
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: '10px' }} spacing={3}>


                <Grid item sm={12} xs={12} md={4}>
                    <Paper>
                        <Grid container sx={{ padding: '10px' }}>
                            <Grid item sm={12} xs={12} md={12}>
                                <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Movie sx={{ fontSize: '40px' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Toplam Anime Sayısı"
                                            secondary={dashboardReport.animeCount + ' adet anime bulunmaktadır'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item sm={12} xs={12} md={4}>
                    <Paper>
                        <Grid container sx={{ padding: '10px' }}>
                            <Grid item sm={12} xs={12} md={12}>
                                <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Book sx={{ fontSize: '40px' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Toplam Manga Sayısı"
                                            secondary={dashboardReport.mangaCount + ' adet manga bulunmaktadır'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item sm={12} xs={12} md={4}>
                    <Paper>
                        <Grid container sx={{ padding: '10px' }}>
                            <Grid item sm={12} xs={12} md={12}>
                                <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <People sx={{ fontSize: '40px' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Toplam Kullanıcı Sayısı"
                                            secondary={dashboardReport.userCount + ' adet kullanıcı bulunmaktadır'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item sm={12} xs={12} md={6}>
                    <Paper>
                        <Grid container sx={{ padding: '10px' }}>
                            <Grid item sm={12} xs={12} md={12}>
                                <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonPin sx={{ fontSize: '40px' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Toplam Rozet Sayısı"
                                            secondary={dashboardReport.rosetteCount + ' adet rozet bulunmaktadır'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item sm={12} xs={12} md={6}>
                    <Paper>
                        <Grid container sx={{ padding: '10px' }}>
                            <Grid item sm={12} xs={12} md={12}>
                                <List dense={true}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <SchemaRounded fontSize='large' style={{ transform: 'rotate(90deg)' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Toplam Kategori Sayısı"
                                            secondary={dashboardReport.categoriesCount + ' adet kategori bulunmaktadır'}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item sm={12} xs={12} md={12}>
                <Anime />
            </Grid>
        </Loading>
    )
}

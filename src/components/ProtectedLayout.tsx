import React from "react";
import { Link, Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Home, Settings, PersonPin, People, Movie, Book, ChevronLeft, Menu, Logout, Dashboard, SchemaRounded, Feedback } from '@mui/icons-material';
import { AppBar, Drawer } from "./AppBar";
import { Button } from "@mui/material";
import { RoleType } from "../types/Entites";


const mdTheme = createTheme();
export const ProtectedLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    if (!user) {
        return <Navigate to="/" />;
    }
    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                            <Box component={"span"}>{user.nameSurname}</Box>
                            <Box component={"span"} sx={{ fontSize: 12 }}>{
                                user.roleType == RoleType.Admin ? "Yönetici" : "Moderatör"
                            }</Box>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeft />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <MainListItems />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    {outlet}
                </Box>
            </Box>
        </ThemeProvider>
    );
};
export const MainListItems = () => {
    const { logout, goLoginPage } = useAuth();
    return (
        <React.Fragment>
            <ListItemButton href="/dashboard">
                <ListItemIcon>
                    <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Gösterge Paneli" />
            </ListItemButton>
            <ListItemButton href="/anime">
                <ListItemIcon>
                    <Movie />
                </ListItemIcon>
                <ListItemText primary="Anime" />
            </ListItemButton>
            <ListItemButton href="/manga">
                <ListItemIcon>
                    <Book />
                </ListItemIcon>
                <ListItemText primary="Manga" />
            </ListItemButton>
            <ListItemButton href="/users">
                <ListItemIcon>
                    <People />
                </ListItemIcon>
                <ListItemText primary="Kullanıcılar" />
            </ListItemButton>
            <ListItemButton href="/rosette">
                <ListItemIcon>
                    <PersonPin />
                </ListItemIcon>
                <ListItemText primary="Rozetler" />
            </ListItemButton>
            <ListItemButton href="/categories">
                <ListItemIcon>
                    <SchemaRounded style={{ transform: 'rotate(90deg)' }} />
                </ListItemIcon>
                <ListItemText primary="Kategoriler" />
            </ListItemButton>
            <ListItemButton href="/complaint">
                <ListItemIcon>
                    <Feedback />
                </ListItemIcon>
                <ListItemText primary="Şikayetler" />
            </ListItemButton>
            <ListItemButton href="/settings">
                <ListItemIcon>
                    <Settings />
                </ListItemIcon>
                <ListItemText primary="Ayarlar" />
            </ListItemButton>
            <ListItemButton onClick={() => {
                logout();
                goLoginPage();
            }}>
                <ListItemIcon>
                    <Logout />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" />
            </ListItemButton>
        </React.Fragment>
    );
}
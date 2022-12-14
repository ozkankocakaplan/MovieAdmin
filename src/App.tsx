import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { ProtectedLayout } from "./components/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Anime from "./pages/Anime";
import Manga from "./pages/Manga";
import Users from "./pages/Users";
import Rosette from "./pages/Rosette";
import EditAnime from "./pages/Anime/EditAnime";
import AddAnime from "./pages/Anime/AddAnime";
import EditCategory from "./pages/Category/EditCategory";
import AddCategory from "./pages/Category/AddCategory";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import AddManga from "./pages/Manga/AddManga";
import EditManga from "./pages/Manga/EditManga";
import Complaint from "./pages/Complaint";
import Web from "./pages/Web";
import FanArts from "./pages/FanArts";
import { createTheme, ThemeProvider } from "@mui/material";

const tableTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)',
          borderRadius: '0px',
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)',

        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)',
          border: 'inherit'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          color: 'rgba(255,255,255,0.87)',
          border: 'inherit',

        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          color: 'rgba(255,255,255,0.87)',
          '&:hover': {
            backgroundColor: '#1A1A1A'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          background: '#474747',
          color: 'rgba(255,255,255,0.87)',

        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#474747',
          color: 'rgba(255,255,255,0.87)',

        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)'
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)'
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)',
          '& .MuiCheckbox-indeterminate': {
            background: '#fff'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#fff'
        },
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
          '& .MuiSelect-icon': {
            color: '#fff !important'
          }
        }
      }
    }
  }
});
export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={
          <ThemeProvider theme={tableTheme}>
            <Dashboard />
          </ThemeProvider>
        } />
        <Route path="anime" element={
          <ThemeProvider theme={tableTheme}>
            <Anime />
          </ThemeProvider>
        } />
        <Route path="complaint" element={
          <ThemeProvider theme={tableTheme}>
            <Complaint />
          </ThemeProvider>
        } />
        <Route path="fanarts" element={
          <ThemeProvider theme={tableTheme}>
            <FanArts />
          </ThemeProvider>
        } />
        <Route path="web" element={
          <ThemeProvider theme={tableTheme}>
            <Web />
          </ThemeProvider>
        } />
        <Route path="/anime/add" element={
          <ThemeProvider theme={tableTheme}>
            <AddAnime />
          </ThemeProvider>
        } />
        <Route path="/anime/:id" element={
          <ThemeProvider theme={tableTheme}>
            <EditAnime />
          </ThemeProvider>
        } />
        <Route path="manga" element={
          <ThemeProvider theme={tableTheme}>
            <Manga />
          </ThemeProvider>
        } />
        <Route path="/manga/add" element={
          <ThemeProvider theme={tableTheme}>
            <AddManga />
          </ThemeProvider>
        } />
        <Route path="/manga/:id" element={
          <ThemeProvider theme={tableTheme}>
            <EditManga />
          </ThemeProvider>
        } />
        <Route path="users" element={
          <ThemeProvider theme={tableTheme}>
            <Users />
          </ThemeProvider>
        } />
        <Route path="categories" element={
          <ThemeProvider theme={tableTheme}>
            <Categories />
          </ThemeProvider>
        } />
        <Route path="/category/add" element={
          <ThemeProvider theme={tableTheme}>
            <AddCategory />
          </ThemeProvider>
        } />
        <Route path="/category/:id" element={
          <ThemeProvider theme={tableTheme}>
            <EditCategory />
          </ThemeProvider>
        } />
        <Route path="rosette" element={
          <ThemeProvider theme={tableTheme}>
            <Rosette />
          </ThemeProvider>
        } />
        <Route path="settings" element={
          <ThemeProvider theme={tableTheme}>
            <Settings />
          </ThemeProvider>
        } />
      </Route>

    </Routes >
  );
}

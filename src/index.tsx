import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { createTheme, CssBaseline, darkScrollbar, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { setupStore } from './store';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const theme = createTheme({
  palette: {
    mode: 'dark'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#161616",
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.87)',
          borderRadius: '0px'
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
          border: 'inherit'
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
    }
  }
});
const store = setupStore();
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();

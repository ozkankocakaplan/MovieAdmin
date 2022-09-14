import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAuth } from "../hooks/useAuth";
import { Alert, Snackbar } from "@mui/material";
import { postLogin } from "../utils/api";


export const LoginPage = () => {
    const { login, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [loginResult, setLoginResult] = useState({ result: false, text: '' });
    useEffect(() => {
        logout();
    }, [])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        if (email?.length != 0 && password?.length != 0) {
            await postLogin(email, password).then((res) => {
                console.log(res.data);
                if (res.data.hasExceptionError && res.data.exceptionMessage != null) {
                    setLoginResult({ result: false, text: res.data.exceptionMessage });
                }
                else {
                    setLoginResult({ result: true, text: "Giriş Başarılı" });
                    setTimeout(() => {
                        login(res.data.entity);
                    }, 2000);
                }
            }).catch((er) => {
                console.log(er)
            })
        }
        else{
            setLoginResult({ result: false, text: "Lütfen tüm alanları doldurunuz" });
        }
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={open} autoHideDuration={2000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={loginResult.result ? "success" : "warning"} sx={{ width: '100%' }}>
                        {loginResult.text}
                    </Alert>
                </Snackbar>
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Admin Girişi
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-posta adresi"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Şifre"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

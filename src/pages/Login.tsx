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
import { AxiosError } from "axios";
import ResultSnackbar, { Result } from "../components/ResultSnackbar";


export const LoginPage = () => {
    const { login, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [loginResult, setLoginResult] = useState<Result>({ status: false, text: '' });
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
                if (res.data.hasExceptionError && res.data.exceptionMessage != null) {
                    setLoginResult({ status: false, text: res.data.exceptionMessage });
                }
                else {
                    console.log(res.data);
                    setLoginResult({ status: true, text: "Giriş Başarılı" });
                    setTimeout(() => {
                        login(res.data.entity);
                    }, 2000);
                }
            }).catch((er: AxiosError) => {

                setLoginResult({ status: false, text: er.message });
            })
        }
        else {
            setLoginResult({ status: false, text: "Lütfen tüm alanları doldurunuz" });
        }
        setOpen(true);
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
                <ResultSnackbar result={loginResult} open={open} closeOpen={() => setOpen(false)} />

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

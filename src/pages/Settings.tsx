import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography, withStyles } from '@mui/material'
import { Box } from '@mui/system'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { getMe, getSocialMediaAccount, postUserEmailVertification, putEmail, putPassword, putSocialMediaAccount, putUserInfo } from '../utils/api'
import Loading from '../components/Loading'
import { SocialMediaAccount, Users } from '../types/Entites'
import { useAuth } from '../hooks/useAuth'
import ResultSnackbar, { Result } from '../components/ResultSnackbar'
import { AxiosError } from 'axios'

export default function Settings() {

    const [loading, setLoading] = useState(true);
    const [currentUserForm, setCurrentUserForm] = useState({ userName: '', nameSurname: '', userEmail: '' });
    const [userForm, setUserForm] = useState<Users>({ nameSurname: '', userName: '', email: '' } as Users);
    const [socialMediaForm, setSocialMediaForm] = useState<SocialMediaAccount>({ gmailUrl: '', instagramUrl: '', userID: userForm.id } as SocialMediaAccount);

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

    const [result, setResult] = useState<Result>({} as Result);
    const [resultOpen, setResultOpen] = useState(false);
    const [emailVertificationDialog, setEmailVertificationDialog] = useState(false);

    const [code, setCode] = useState('');

    useEffect(() => {
        loadUser();
        loadSocialMediaAccount();
        setLoading(false);
        return () => {
            setLoading(true);
        }
    }, [])

    const loadUser = async () => {
        await getMe().then((res) => {
            if (res.data.isSuccessful) {
                setUserForm(res.data.entity);
                setCurrentUserForm({
                    ...currentUserForm,
                    userEmail: res.data.entity.email,
                    userName: res.data.entity.userName,
                    nameSurname: res.data.entity.nameSurname
                });
            }
        }).catch((er) => {
            console.log(er);
        });
    }
    const loadSocialMediaAccount = async () => {
        await getSocialMediaAccount().then((res) => {
            if (res.data.isSuccessful && res.data.entity !== null) {
                setSocialMediaForm(res.data.entity);
            }
        }).catch((er) => {
            console.log(er);
        })
    }
    const saveUserInfo = async () => {
        if (userForm.nameSurname !== currentUserForm.nameSurname || userForm.userName !== currentUserForm.userName) {
            await putUserInfo(userForm.nameSurname, userForm.userName)
                .then((res) => {
                    setResult({ status: res.data.isSuccessful, text: res.data.isSuccessful ? "Bilgileriniz Güncellendi" : "Hata oluştu" } as Result);
                }).catch((er: AxiosError) => {
                    setResult({ status: false, text: er.message } as Result);
                });
            setResultOpen(true);
        }
        if (userForm.email !== currentUserForm.userEmail) {
            await postUserEmailVertification(userForm.email)
                .then((res) => {
                    if (res.data.isSuccessful) {
                        setResult({ status: res.data.isSuccessful, text: res.data.isSuccessful ? "Doğrulama kodu epostanıza gönderildi" : res.data.exceptionMessage } as Result);
                        setResultOpen(true);
                        setTimeout(() => {
                            setEmailVertificationDialog(true);
                        }, 1500);


                    }
                }).catch((er) => {
                    setResult({ status: false, text: er.message } as Result);
                    setResultOpen(true);
                })


        }
    }
    const saveSocialAccount = async () => {
        await putSocialMediaAccount(socialMediaForm).then((res) => {
            setResult({ status: res.data.isSuccessful, text: res.data.isSuccessful ? "Bilgileriniz Güncellendi" : "Hata oluştu" } as Result);
        }).catch((er: AxiosError) => {
            setResult({ status: false, text: er.message } as Result);
        });
        setResultOpen(true);
    }
    const savePassword = async () => {
        await putPassword(passwordForm.currentPassword, passwordForm.newPassword)
            .then((res) => {
                setResult({ status: res.data.isSuccessful, text: res.data.exceptionMessage } as Result);
            }).catch((er: AxiosError) => {
                setResult({ status: false, text: er.message } as Result);
            })
        setResultOpen(true);
    }
    const updateVertification = async () => {
        if (code.length != 0) {
            await putEmail(userForm.email, code)
                .then((res) => {
                    setResult({ status: res.data.isSuccessful, text: res.data.isSuccessful ? "Bilgileriniz Güncellendi" : "Hata oluştu" } as Result);
                }).catch((er) => {
                    setResult({ status: false, text: er.message } as Result);
                });
            setEmailVertificationDialog(false)
            setResultOpen(true);
        }
    }
    return (
        <Loading loading={loading}>
            <Grid container sx={{ padding: '10px' }} >
                <Grid item sm={12} md={12} xs={12}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>
                                Kullanıcı Bilgilerim
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                                <div style={{ padding: 10 }}>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={userForm.nameSurname}
                                            onChange={(e) => setUserForm({ ...userForm, nameSurname: e.target.value })}
                                            label="Ad Soyad"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={userForm.userName}
                                            onChange={(e) => setUserForm({ ...userForm, userName: e.target.value })}
                                            label="Kullanıcı adı"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                            label="E-posta"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box sx={{ margin: '15px 0px' }}>
                                        <Button onClick={saveUserInfo} fullWidth variant='contained'>
                                            Kaydet
                                        </Button>
                                    </Box>
                                </div>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '15px' }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>
                                Şifremi Değiştir
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                                <div style={{ padding: 10 }}>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            type={"password"}
                                            label="Mevcut Şifreniz"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            type={"password"}
                                            label="Yeni Şifreniz"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box sx={{ margin: '15px 0px' }}>
                                        <Button onClick={savePassword} fullWidth variant='contained'>
                                            Kaydet
                                        </Button>
                                    </Box>
                                </div>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item sm={12} md={12} xs={12} sx={{ marginTop: '15px' }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<GridExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography>
                                Sosyal Medya Hesabım
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ width: '100%', '& .MuiTextField-root': { mt: 2 } }}>
                                <div style={{ padding: 10 }}>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={socialMediaForm.gmailUrl}
                                            onChange={(e) => setSocialMediaForm({ ...socialMediaForm, gmailUrl: e.target.value })}
                                            label="Gmail Hesabım"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            maxWidth: '100%',
                                        }}>
                                        <TextField
                                            value={socialMediaForm.instagramUrl}
                                            onChange={(e) => setSocialMediaForm({ ...socialMediaForm, instagramUrl: e.target.value })}
                                            label="Instagram Hesabım"
                                            fullWidth
                                        ></TextField>
                                    </Box>
                                    <Box sx={{ margin: '15px 0px' }}>
                                        <Button onClick={saveSocialAccount} fullWidth variant='contained'>
                                            Kaydet
                                        </Button>
                                    </Box>
                                </div>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <ResultSnackbar result={result} open={resultOpen} closeOpen={() => setResultOpen(false)} />
            {
                emailVertificationDialog &&
                <Dialog open={emailVertificationDialog} onClose={() => setEmailVertificationDialog(false)}>
                    <DialogTitle>E-posta Doğrulama</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            E-postanıza gelen kodu aşağıya giriniz.
                        </DialogContentText>
                        <TextField
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Onay Kodu"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEmailVertificationDialog(false)}>Kapat</Button>
                        <Button onClick={updateVertification}>Doğrula</Button>
                    </DialogActions>
                </Dialog>
            }
        </Loading>
    )
}

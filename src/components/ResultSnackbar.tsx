import { Alert, Snackbar, SnackbarProps } from '@mui/material'
import React from 'react'
export interface Result {
    status: boolean,
    text: string
}
export default function ResultSnackbar(props: { open: boolean, closeOpen: () => void, result: Result, props?: SnackbarProps }) {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        props.closeOpen();
    };
    return (
        <Snackbar
            anchorOrigin={props.props?.anchorOrigin == undefined ? { vertical: 'bottom', horizontal: 'center' } : props.props.anchorOrigin}
            open={props.open} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={props.result.status ? "success" : "warning"} sx={{ width: '100%' }}>
                {props.result.text}
            </Alert>
        </Snackbar>
    )
}

import React from 'react'

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material'
interface IDeleteDialogProps {
    open: boolean, handleClose: () => void,
    dialogTitle: string,
    dialogContentText: string,
    yesButon?: any,
    noButon?: any
}
export default function DeleteDialog(props: IDeleteDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.dialogContentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {props.noButon}
                {props.yesButon}
            </DialogActions>

        </Dialog>
    )
}

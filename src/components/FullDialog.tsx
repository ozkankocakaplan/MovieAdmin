import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridCloseIcon } from '@mui/x-data-grid';
import React from 'react'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface IFullDialogProps {
    open: boolean,
    handleClose: () => void,
    children: React.ReactNode
}

export default function FullDialog(props: IFullDialogProps) {
    return (
        <div>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.handleClose}
                            aria-label="close"
                        >
                            <GridCloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {
                    props.children
                }
            </Dialog>
        </div>
    );
}

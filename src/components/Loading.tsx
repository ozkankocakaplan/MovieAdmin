import { Backdrop, Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function Loading(props: { loading: boolean, children: React.ReactNode }) {
    return (
        <Box component={"div"} sx={props.loading ? { display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' } : {}}>

            {props.loading ? <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
                :
                props.children
            }
        </Box>
    )
}

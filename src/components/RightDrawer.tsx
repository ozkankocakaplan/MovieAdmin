import { Drawer } from '@mui/material'
import React from 'react'

interface IRightDrawerProps {
    openDrawer: (status: boolean) => void,
    drawerState: boolean,
    children: any
}
export default function RightDrawer(props: IRightDrawerProps) {
    return (
        <Drawer
            sx={{ '& .MuiDrawer-paper': { top: '55px' } }}
            anchor={'right'}
            open={props.drawerState}
            onClose={() => props.openDrawer(false)}
        >
            {props.children}
        </Drawer>
    )
}

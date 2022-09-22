import React, { useEffect, useState } from 'react'
import { Add, Delete, Edit } from '@mui/icons-material';
import { alpha, Box, Checkbox, Grid, IconButton, TableBody, TableCell, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import DataTable, { EnhancedTableToolbarProps } from './DataTable';
import { getComparator, Order, stableSort } from './TableHelper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AnimeEpisodes, AnimeSeason } from '../types/Entites';
import { getAnimeEpisodesBySeasonID } from '../utils/api';
import { animeEpisodesCells } from '../utils/HeadCells';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ISeasonTabsProps {
    tabsHeader: Array<AnimeSeason>,
    addShowDrawer?: () => void,
    editShowDrawer?: () => void,
    deleteShowModal?: () => void,
}
const SeasonTabs = (props: ISeasonTabsProps) => {
    const [value, setValue] = React.useState(0);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AnimeSeason>('seasonName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [loading, setLoading] = useState(false);

    const [animeEpisodesService, setAnimeEpisodesService] = useState<Array<AnimeEpisodes>>([
        {
            id: 1,
            seasonID: 1,
            episodeName: 'Bölüm 1',
            episodeDescription: 'aa',
            createTime: new Date().toString(),
        },
        {
            id: 2,
            seasonID: 1,
            episodeName: 'Bölüm 2',
            episodeDescription: 'aa',
            createTime: new Date().toString(),
        }
    ]);
    useEffect(() => {
        loadAnimeEpisodesBySeasonID();
    }, [value]);




    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - animeEpisodesService.length) : 0;
    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const { numSelected } = props;
        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {/* {numSelected} */}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {props.tableName}
                    </Typography>
                )}
                {numSelected == 0 && <IconButton onClick={props.goAddPage}>
                    <Add />
                </IconButton>}
                {numSelected > 0 && (
                    <>
                        {numSelected == 1 && <Tooltip title="Edit">
                            <IconButton onClick={props.goEditPage}>
                                <Edit />
                            </IconButton>
                        </Tooltip>}
                        <Tooltip title="Delete">
                            <IconButton onClick={props.handleDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
        );
    };
    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };





    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const loadAnimeEpisodesBySeasonID = async () => {
        await getAnimeEpisodesBySeasonID(props.tabsHeader[value].id)
            .then((res) => {
                // setAnimeEpisodesService(res.data.list);
            }).catch((er) => {
                console.log(er);
            });
    }
    return (
        <Grid>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', '& .MuiBox-root ': { padding: 0 } }}>
                <Tabs
                    sx={{ width: '100%' }}
                    value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        props.tabsHeader.map((item, index) => {
                            return <Tab key={index} label={item.seasonName} {...a11yProps(index)} />
                        })
                    }
                </Tabs>
            </Box>
            {
                props.tabsHeader.map((item, index) => {
                    return <TabPanel key={index} value={value} index={index}>
                        {
                            <DataTable
                                EnhancedTableToolbar={EnhancedTableToolbar}
                                rows={animeEpisodesService.map((item) => item.id.toString())}
                                HeadCell={animeEpisodesCells}
                                order={order}
                                setOrder={(data) => setOrder(data)}
                                orderBy={orderBy}
                                setOrderBy={(data) => setOrderBy(data)}
                                selected={selected}
                                setSelected={(data) => setSelected(data)}
                                page={page}
                                setPage={(page) => setPage(page)}
                                rowsPerPage={rowsPerPage}
                                setRowsPerPage={(data) => setRowsPerPage(data)}
                                goAddPage={() => {
                                    if (props.addShowDrawer != undefined) {
                                        props.addShowDrawer();
                                    }
                                }}
                                goEditPage={() => {
                                    if (props.editShowDrawer != undefined) {
                                        props.editShowDrawer();
                                    }
                                }}
                                handleDelete={() => {
                                    if (props.deleteShowModal != undefined) {
                                        props.deleteShowModal();
                                    }
                                }}
                                tableName="Bölümler"
                                tableBody={!loading &&
                                    <TableBody>
                                        {animeEpisodesService
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.episodeName);
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleClick(event, row.episodeName)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.id}
                                                        selected={isItemSelected}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                color="primary"
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    'aria-labelledby': labelId,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.episodeName}
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                        >
                                                            {row.episodeDescription}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                }
                            />
                        }
                    </TabPanel>
                })
            }

        </Grid >
    );
}
export default SeasonTabs;
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

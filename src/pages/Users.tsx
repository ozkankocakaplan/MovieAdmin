import { alpha, Avatar, Box, Checkbox, createTheme, Drawer, Grid, IconButton, Paper, TableBody, TableCell, TableRow, ThemeProvider, Toolbar, Tooltip, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import DataTable, { EnhancedTableToolbarProps } from '../components/DataTable';
import Loading from '../components/Loading'
import { getComparator, Order, stableSort } from '../components/TableHelper';
import { RoleType, Users as User } from '../types/Entites';
import { getPaginatedUsers } from '../utils/api';
import { userCells } from '../utils/HeadCells';
import { Edit, Delete, Block } from '@mui/icons-material';

export default function Users() {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof User>('nameSurname');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [serviceResponse, setServiceResponse] = useState<Array<User>>([]);
  const [loading, setLoading] = useState(true);

  const [userDetails, setUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState({} as User);


  useEffect(() => {
    loadUsers();
    return () => {
      setLoading(true);
    }
  }, [])
  const loadUsers = async () => {
    await getPaginatedUsers(page + 1, rowsPerPage).then((res) => {
      setServiceResponse(res.data.list);
    })
      .catch((er: AxiosError) => {
        console.log(er.message);
      });
    setLoading(false);
  }
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
  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - serviceResponse.length) : 0;
  const toggleDrawer = (open: boolean) => {
    setUserDetails(open);
  };
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
        {numSelected > 0 && (
          <>
            {numSelected == 1 && <Tooltip title="Düzenle">
              <IconButton onClick={props.goEditPage}>
                <Edit />
              </IconButton>
            </Tooltip>}
            <Tooltip title="Sil">
              <IconButton onClick={props.handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
            {
              selectedUser.roleType != RoleType.Admin &&
              <Tooltip title="Engelle">
                <IconButton sx={{ color: 'red' }} onClick={props.handleDelete}>
                  <Block />
                </IconButton>
              </Tooltip>
            }
          </>
        )}
      </Toolbar>
    );
  };
  return (
    <Loading loading={loading}>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={12} sx={{ height: 400, outline: 0 }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <DataTable
              EnhancedTableToolbar={EnhancedTableToolbar}
              rows={serviceResponse.map((item) => item.id.toString())}
              HeadCell={userCells}
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
              goAddPage={() => navigate("/user/add")}
              goEditPage={() => {
                setUserDetails(true);
              }}
              handleDelete={() => { console.log(selectedUser) }}
              tableName="Kullanıcılar"
              tableBody={!loading && serviceResponse.length != 0 &&
                <TableBody>
                  {stableSort(serviceResponse, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id.toString());
                      const labelId = `enhanced-table-checkbox-${index}`;
                      if (selected.length === 1 && Object.keys(selectedUser).length === 0) {
                        setSelectedUser(row);
                      }
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id.toString())}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.seoUrl}
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
                          <TableCell >{row.nameSurname}</TableCell>
                          <TableCell >{row.userName}</TableCell>
                          <TableCell >{row.email}</TableCell>
                          <TableCell >{row.gender}</TableCell>
                          <TableCell >{!row.isBanned ? "Hesap Aktif" : "Hesap Pasif"}</TableCell>
                          <TableCell >{new Date(row.createTime).toLocaleDateString()}</TableCell>
                          <TableCell >{row.roleType === RoleType.Admin
                            ? "Yönetici"
                            : row.roleType == RoleType.User ? "Kullanıcı"
                              : "Moderatör"

                          }</TableCell>
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
          </Paper>
        </Grid>

      </Grid>
      <UserDetails selectedUser={selectedUser} drawerState={userDetails} openDrawer={toggleDrawer} />
    </Loading>
  )
}

const UserDetails = (props: { openDrawer: (status: boolean) => void, drawerState: boolean, selectedUser: User }) => {
  const theme = createTheme({
    typography: {
      subtitle1: {
        color: '#474747',
        fontFamily: 'sans-serif',
        fontWeight: '400'
      }
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Drawer
          sx={{ '& .MuiDrawer-paper': { top: '65px' } }}
          anchor={'right'}
          open={props.drawerState}
          onClose={() => props.openDrawer(false)}
        >
          <Box
            sx={{ width: 650 }}
            role="presentation"
          // onClick={() => props.openDrawer(false)}
          // onKeyDown={() => props.openDrawer(false)}
          >
            <Grid container sx={{ margin: '15px' }}>
              <Grid item sm={12} md={2} xs={12}>
                <Avatar
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 90, height: 90 }}
                />
              </Grid>
              <Grid item sx={{ justifyContent: 'center', alignItems: 'flex-start', display: 'flex', flex: 1, flexDirection: 'column' }} sm={12} md={10} xs={12}>
                <Typography variant='subtitle1'>Özkan Kocakaplan</Typography>
                <Typography variant='subtitle1'>ozkankocakaplan07@gmail.com</Typography>
                <Typography variant='subtitle1'>Aktif</Typography>
              </Grid>

            </Grid>
          </Box>
        </Drawer>
      </React.Fragment>
    </ThemeProvider>
  );
}

import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import {alpha} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/AppNavbar';
import SideMenu from '../components/dashboard/SideMenu';
import AppTheme from '../theme/AppTheme';
import {chartsCustomizations} from "../theme/customizations/charts";
import {dataGridCustomizations} from "../theme/customizations/dataGrid";
import {datePickersCustomizations} from "../theme/customizations/datePickers";
import {treeViewCustomizations} from "../theme/customizations/treeView";
import Grid from "@mui/material/Grid2";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect} from "react";
import {Copyright} from "../components/Footer";
import axios from "../axios";
import Chip from "@mui/material/Chip";

const columns: GridColDef[] = [
  {field: 'createdAt', headerName: 'Дата', flex: 1, minWidth: 170},
  {
    field: 'role',
    headerName: 'Р',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 50,
    renderCell: (n) => <Chip label={n.value} color={n.row.role === 'М' || n.row.role === 'Д'? 'default' : 'error'} variant="outlined"/>,
  },
  {
    field: 'winner',
    headerName: 'П',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 50,
    renderCell: (n) => <Chip label={n.value} color={n.row.winner === 'Мафія' ? 'default' : 'default'} variant="outlined"/>,
  },
  {
    field: 'bestTurnGuess',
    headerName: 'КХ',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 50,
  },
  {
    field: 'rating',
    headerName: 'Рейтинг',
    headerAlign: 'left',
    align: 'left',
    flex: .5,
    minWidth: 80,
  },
  // {
  //   field: 'viewsPerUser',
  //   headerName: 'Views per User',
  //   headerAlign: 'right',
  //   align: 'right',
  //   flex: 1,
  //   minWidth: 120,
  // },
  // {
  //   field: 'averageTime',
  //   headerName: 'Average Time',
  //   headerAlign: 'right',
  //   align: 'right',
  //   flex: 1,
  //   minWidth: 100,
  // },
  // {
  //   field: 'conversions',
  //   headerName: 'Daily Conversions',
  //   flex: 1,
  //   minWidth: 150,
  //   renderCell: renderSparklineCell,
  // },
];


const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DashboardGames(props: { disableCustomTheme?: boolean }) {
  const [games, setGames] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get('http://localhost:3000/user/games');
        const array = (data.items || []).map((item: any, i: number) => {
          return {...item, id: i + 1};
        })
        setGames(array || []);
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, [])

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme/>
      {/*<AppAppBar />*/}
      <Box sx={{display: 'flex'}}>
        <SideMenu/>
        <AppNavbar/>
        {/* Main content */}

        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: {xs: 8, md: 0},
            }}
          >
            {/*<Header />*/}
            <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
              {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>*/}
              {/*  Details*/}
              {/*</Typography>*/}
              <Grid sx={{mt: '2rem'}} size={{xs: 12, lg: 9}}>
                <DataGrid
                  disableColumnSelector
                  // checkboxSelection
                  disableColumnSorting
                  disableColumnMenu
                  rows={games}
                  columns={columns}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                  initialState={{
                    pagination: {paginationModel: {pageSize: 20}},
                  }}
                  pageSizeOptions={[10, 20, 50]}
                  disableColumnResize
                  density="compact"
                />
              </Grid>
              <Copyright/>
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

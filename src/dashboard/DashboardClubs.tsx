import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/AppNavbar';
import Header from '../components/dashboard/Header';
import MainGrid from '../components/dashboard/MainGrid';
import SideMenu from '../components/dashboard/SideMenu';
import AppTheme from '../theme/AppTheme';
import {chartsCustomizations} from "../theme/customizations/charts";
import {dataGridCustomizations} from "../theme/customizations/dataGrid";
import {datePickersCustomizations} from "../theme/customizations/datePickers";
import {treeViewCustomizations} from "../theme/customizations/treeView";
import AppAppBar from "../components/AppAppBar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import StatCard from "../components/dashboard/StatCard";
import HighlightedCard from "../components/dashboard/HighlightedCard";
import SessionsChart from "../components/dashboard/SessionsChart";
import PageViewsBarChart from "../components/dashboard/PageViewsBarChart";
import CustomizedDataGrid from "../components/dashboard/CustomizedDataGrid";
import CustomizedTreeView from "../components/dashboard/CustomizedTreeView";
import ChartUserByCountry from "../components/dashboard/ChartUserByCountry";
// import Copyright from "../internals/components/Copyright";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect} from "react";
import {Copyright} from "../components/Footer";
import axios from "../axios";

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Назва клубу', flex: 1, minWidth: 200 },
  // {
  //   field: 'status',
  //   headerName: 'Status',
  //   flex: 0.5,
  //   minWidth: 80,
  //   renderCell: (params) => renderStatus(params.value as any),
  // },
  {
    field: 'address',
    headerName: 'Адреса',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'email',
    headerName: 'Email',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'usersAmount',
    headerName: 'Учасники',
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

export default function DashboardClubs(props: { disableCustomTheme?: boolean }) {
  const [clubs, setClubs] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('https://c5prlhy2nh.execute-api.us-west-2.amazonaws.com/user/clubs');
        const array = (data.items || []).map((item: any, i: number) => {
          return { ...item, id: i + 1 };
        })
        setClubs(array || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [])

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      {/*<AppAppBar />*/}
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
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
              mt: { xs: 8, md: 0 },
            }}
          >
            {/*<Header />*/}
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
              {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>*/}
              {/*  Details*/}
              {/*</Typography>*/}
              <Grid sx={{ mt: '2rem' }} size={{ xs: 12, lg: 9 }}>
                <DataGrid
                  disableColumnSelector
                  // checkboxSelection
                  disableColumnSorting
                  disableColumnMenu
                  rows={clubs}
                  columns={columns}
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                  initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                  }}
                  pageSizeOptions={[10, 20, 50]}
                  disableColumnResize
                  density="compact"
                  // slotProps={{
                  //   filterPanel: {
                  //     filterFormProps: {
                  //       logicOperatorInputProps: {
                  //         variant: 'outlined',
                  //         size: 'small',
                  //       },
                  //       columnInputProps: {
                  //         variant: 'outlined',
                  //         size: 'small',
                  //         sx: { mt: 'auto' },
                  //       },
                  //       operatorInputProps: {
                  //         variant: 'outlined',
                  //         size: 'small',
                  //         sx: { mt: 'auto' },
                  //       },
                  //       valueInputProps: {
                  //         InputComponentProps: {
                  //           variant: 'outlined',
                  //           size: 'small',
                  //         },
                  //       },
                  //     },
                  //   },
                  // }}
                />
              </Grid>
              <Copyright />
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}

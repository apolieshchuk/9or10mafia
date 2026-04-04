import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/AppNavbar';
import SideMenu from '../components/dashboard/SideMenu';
import AppTheme from '../theme/AppTheme';
import { chartsCustomizations } from '../theme/customizations/charts';
import { dataGridCustomizations } from '../theme/customizations/dataGrid';
import { datePickersCustomizations } from '../theme/customizations/datePickers';
import { treeViewCustomizations } from '../theme/customizations/treeView';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { Copyright } from '../components/Footer';
import axios from '../axios';
import { useAuth } from '../AuthProvider';
import { formatDateUkVancouver } from '../utils/vancouverDate';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const statusUa: Record<string, string> = {
  draft: 'Чернетка',
  in_progress: 'Йде',
  completed: 'Завершено',
};

export default function DashboardTournaments(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/tournaments');
        const items = (data.items || []).map((t: any) => ({
          ...t,
          id: t.id,
        }));
        setRows(items);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Назва', flex: 1.2, minWidth: 140 },
    { field: 'numGames', headerName: 'Ігор', width: 70 },
    {
      field: 'scheduledDate',
      headerName: 'Дата',
      flex: 0.8,
      minWidth: 110,
      valueFormatter: (v) => formatDateUkVancouver(v),
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 110,
      valueFormatter: (v) => statusUa[String(v)] || String(v),
    },
    { field: 'gamesSaved', headerName: 'Зіграно', width: 90 },
    {
      field: 'winnerNickname',
      headerName: 'Переможець',
      flex: 0.8,
      minWidth: 100,
      valueFormatter: (v) => v || '—',
    },
  ];

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
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
            sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}
          >
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: '2rem', mb: 1 }}>
                <Typography component="h1" variant="h5">
                  Турніри
                </Typography>
                {user?.authType === 'Клуб' && (
                  <Button variant="contained" onClick={() => navigate('/profile/tournaments/new')}>
                    Новий турнір
                  </Button>
                )}
              </Stack>
              <Grid size={{ xs: 12, lg: 9 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  disableColumnSorting
                  disableColumnMenu
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                  onRowClick={(params) => navigate(`/profile/tournaments/${params.row.id}`)}
                  sx={{ cursor: 'pointer' }}
                  initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                  pageSizeOptions={[10, 20, 50]}
                  density="compact"
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

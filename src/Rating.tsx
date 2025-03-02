import * as React from 'react';
import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import AppAppBar from "./components/AppAppBar";
import StatCard, {StatCardProps} from "./components/dashboard/StatCard";
import HighlightedCard from "./components/dashboard/HighlightedCard";
import SessionsChart from "./components/dashboard/SessionsChart";
import PageViewsBarChart from "./components/dashboard/PageViewsBarChart";
import Chip from "@mui/material/Chip";
import StarsIcon from "@mui/icons-material/Stars";
import Face5Icon from "@mui/icons-material/Face5";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MvpStatCard from "./components/dashboard/MvpStatCard";
import GameStatsBarChart from "./components/dashboard/GameStatsBarChart";


export const columns: GridColDef[] = [
  { field: 'rank', headerName: '№', flex: 1, minWidth: 10 },
  { field: 'nickname', headerName: 'Нік', flex: 1, minWidth: 100 },
  { field: 'rating', headerName: 'Рейт', flex: 1, minWidth: 60 },
  {
    field: 'totalGames',
    headerName: 'Ігри',
    flex: 1,
    minWidth: 90,
    renderCell: (n) => `${n.row.totalGames}/${n.row.totalWins} (${n.row.totalWinsRate}%)`
  },
  {
    field: 'firsDie',
    headerName: 'ПВ',
    flex: 1,
    minWidth: 30,
  },
  {
    field: 'bestTurn2_3',
    headerName: 'КХ2/3',
    flex: 1,
    minWidth: 60,
    // renderCell: (n) => `${n.row.bestTurn2_3}/${n.row.bestTurn3_3}`
  },
  {
    field: 'bestTurn3_3',
    headerName: 'КХ3/3',
    flex: 1,
    minWidth: 60,
  },
  {
    field: 'citizenGames',
    headerName: 'Мир',
    flex: 1,
    minWidth: 90,
    renderCell: (n) => `${n.row.citizenGames}/${n.row.citizenWins} (${n.row.citizenWinsRate}%)`
  },
  {
    field: 'mafiaGames',
    headerName: 'Маф',
    flex: 1,
    minWidth: 90,
    renderCell: (n) => `${n.row.mafiaGames}/${n.row.mafiaWins} (${n.row.mafiaWinsRate}%)`
  },
  {
    field: 'sheriffGames',
    headerName: 'Шер',
    flex: 1,
    minWidth: 90,
    renderCell: (n) => `${n.row.sheriffGames}/${n.row.sheriffWins} (${n.row.sheriffWinsRate}%)`
  },
  {
    field: 'donGames',
    headerName: 'Дон',
    flex: 1,
    minWidth: 90,
    renderCell: (n) => `${n.row.donGames}/${n.row.donWins} (${n.row.donWinsRate}%)`
  }
];


const MembersContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  // minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Rating(props: { disableCustomTheme?: boolean }) {
  const [rating, setRating] = React.useState([]);
  const [mvp, setMvp] = React.useState({
    title: 'MVP Гравець',
    value: '',
    description: '',
    citizenWinsRate: 0,
    mafiaWinsRate: 0,
    donWinsRate: 0,
    sheriffWinsRate: 0,
  });
  const [gamesStats, setGamesStats] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.post('https://c5prlhy2nh.execute-api.us-west-2.amazonaws.com/club/rating', {
          clubId: '67c0dc3b110964e2fdac7b37' // ToDO
        });
        const mvpPlayer = data.players[0];
        setMvp({
          title: 'MVP Гравець',
          value: mvpPlayer.nickname,
          description: `Коефіцієнт перемог - ${mvpPlayer.totalWinsRate}%`,
          citizenWinsRate: mvpPlayer.citizenWinsRate,
          mafiaWinsRate: mvpPlayer.mafiaWinsRate,
          donWinsRate: mvpPlayer.donWinsRate,
          sheriffWinsRate: mvpPlayer.sheriffWinsRate,
        });
        setGamesStats(data.stats || {});
        setRating(data.players || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [])
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <MembersContainer direction="column" justifyContent="space-between">
        <AppAppBar />
        <Box sx={{ mt: '5rem' }}>
          <Grid
            container
            spacing={2}
            columns={12}
            sx={{ mb: (theme) => theme.spacing(2) }}
          >
            {/*<Grid size={{ xs: 12, sm: 6, lg: 3 }}>*/}
            {/*  <HighlightedCard />*/}
            {/*</Grid>*/}
            {/*<Grid size={{ xs: 12, md: 6 }}>*/}
            {/*  <SessionsChart />*/}
            {/*</Grid>*/}
            <Grid size={{ xs: 12, md: 6 }}>
              <GameStatsBarChart stats={gamesStats} />
            </Grid>
            <Grid  size={{ xs: 12, md: 6 }}>
              <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                {/*{data.map((card, index) => (*/}
                  <MvpStatCard {...mvp} />
                {/*))}*/}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <DataGrid
                // checkboxSelection
                rows={rating}
                columns={columns}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                  pagination: { paginationModel: { pageSize: 15 } },
                }}
                pageSizeOptions={[15]}
                disableColumnResize
                disableColumnMenu
                disableColumnSorting
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
            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
                {/*<CustomizedTreeView />*/}
                {/*<ChartUserByCountry />*/}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MembersContainer>
    </AppTheme>
  );
}
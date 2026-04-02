import * as React from 'react';
import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect, useCallback} from "react";
import axios from "./axios";
import Box from "@mui/material/Box";
import AppAppBar from "./components/AppAppBar";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleIcon from "@mui/icons-material/People";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import Face5Icon from "@mui/icons-material/Face5";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import MvpStatCard from "./components/dashboard/MvpStatCard";
import GameStatsBarChart from "./components/dashboard/GameStatsBarChart";


const MembersContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  // minHeight: '100%',
  // height: '200vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    // height: '200vh',
    // [theme.breakpoints.up('xs')]: {
    //   height: '100vh',
    // },
    [theme.breakpoints.up('md')]: {
      height: '140vh',
    },
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

const roleStatLine = (icon: React.ReactNode, wins: number, games: number, rate: number) => (
  <Box sx={{display: 'flex', alignItems: 'center', gap: 1, py: 0.3}}>
    {icon}
    <Typography variant="body2">{wins}/{games} ({rate}%)</Typography>
  </Box>
);

export default function Rating(props: { disableCustomTheme?: boolean }) {
  const [rating, setRating] = React.useState([]);
  const [infoAnchor, setInfoAnchor] = React.useState<null | HTMLElement>(null);
  const [infoPlayer, setInfoPlayer] = React.useState<any>(null);
  const [mvp, setMvp] = React.useState({
    title: 'MVP Гравець',
    value: '',
    description: '',
    citizenWinsRate: 0,
    mafiaWinsRate: 0,
    donWinsRate: 0,
    sheriffWinsRate: 0,
  });
  const [gamesStats, setGamesStats] = React.useState({} as any);

  const openInfo = useCallback((e: React.MouseEvent<HTMLElement>, row: any) => {
    e.stopPropagation();
    setInfoAnchor(e.currentTarget);
    setInfoPlayer(row);
  }, []);

  const columns: GridColDef[] = [
    { field: 'rank', headerName: '№', flex: 0.5, minWidth: 35 },
    { field: 'nickname', headerName: 'Нік', flex: 1.2, minWidth: 100 },
    { field: 'rating', headerName: 'Рейт', flex: 0.8, minWidth: 55 },
    {
      field: 'totalGames',
      headerName: 'Ігри',
      flex: 1.5,
      minWidth: 120,
      renderCell: (n) => (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer'}} onClick={(e) => openInfo(e, n.row)}>
          {n.row.totalWins}/{n.row.totalGames} ({n.row.totalWinsRate}%)
          <InfoOutlinedIcon sx={{fontSize: 14, opacity: 0.4}}/>
        </Box>
      )
    },
    { field: 'firsDie', headerName: 'ПВ', flex: 0.5, minWidth: 30 },
    {
      field: 'supportFivePoints',
      headerName: 'ОП5',
      flex: 0.7,
      minWidth: 50,
      renderCell: (n) => n.row.supportFiveCount > 0
        ? `${n.row.supportFivePoints > 0 ? '+' : ''}${n.row.supportFivePoints} (${n.row.supportFiveCount})`
        : '-'
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.post('/club/rating', {
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
              <GameStatsBarChart stats={gamesStats.yearStats} avgGames={gamesStats.avgGames}/>
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
              </Stack>
            </Grid>
          </Grid>
          <Popover
            open={Boolean(infoAnchor)}
            anchorEl={infoAnchor}
            onClose={() => setInfoAnchor(null)}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          >
            {infoPlayer && <Box sx={{p: 2, minWidth: 180}}>
              <Typography variant="subtitle2" sx={{mb: 1}}>{infoPlayer.nickname}</Typography>
              {roleStatLine(<PeopleIcon sx={{fontSize: 18, color: '#4caf50'}}/>, infoPlayer.citizenWins, infoPlayer.citizenGames, infoPlayer.citizenWinsRate)}
              {roleStatLine(<GpsFixedIcon sx={{fontSize: 18, color: '#9e9e9e'}}/>, infoPlayer.mafiaWins, infoPlayer.mafiaGames, infoPlayer.mafiaWinsRate)}
              {roleStatLine(<LocalPoliceIcon sx={{fontSize: 18, color: '#f44336'}}/>, infoPlayer.sheriffWins, infoPlayer.sheriffGames, infoPlayer.sheriffWinsRate)}
              {roleStatLine(<Face5Icon sx={{fontSize: 18, color: '#757575'}}/>, infoPlayer.donWins, infoPlayer.donGames, infoPlayer.donWinsRate)}
            </Box>}
          </Popover>
        </Box>
      </MembersContainer>
    </AppTheme>
  );
}
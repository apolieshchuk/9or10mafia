import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WarningIcon from '@mui/icons-material/Warning';
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import CustomizedDataGrid from "./components/dashboard/CustomizedDataGrid";
import CustomizedTreeView from "./components/dashboard/CustomizedTreeView";
import ChartUserByCountry from "./components/dashboard/ChartUserByCountry";
import {DataGrid} from "@mui/x-data-grid";
import {columns, rows} from "./internals/data/gridDataClubs";
import {use, useEffect, useMemo} from "react";
import axios from "axios";
import AppAppBar from "./components/AppAppBar";
import {Autocomplete, createFilterOptions} from "@mui/material";
import Box from "@mui/material/Box";

const filter = createFilterOptions();

const ClubsContainer = styled(Stack)(({ theme }) => ({
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

const RolesPoolDefault = ['М1', 'М2', 'Д', 'Ш']

export default function NewGame(props: { disableCustomTheme?: boolean }) {
  const [clubUsers, setClubUsers] = React.useState([]);
  const [players, _setPlayers] = React.useState([1,2,3,4,5,6,7,8,9,10].reduce((acc, n) => {
    acc[n] = { n, title: '', warnings: 0, role: '' };
    return acc
  }, {} as Record<number, any>));
  const setPlayers = (item: any) => _setPlayers(() => item);

  const setPlayerNickname = (n: number, title: string, id: string) => {
    setPlayers({ ...players, [n]: { ...players[n], title, id } });
  }

  const addWarning = (n: number) => {
    setPlayers({ ...players, [n]: { ...players[n], warnings: Math.min(players[n].warnings + 1, 4) } });
  }

  const addRole = (n: number) => {
    const pool = RolesPoolDefault.filter(role => !rolesPool.includes(role));
    const role = pool.pop()
    setPlayers({ ...players, [n]: { ...players[n], role: role } });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get('http://localhost:3000/club/users');
        const array = (data.items || []).map((item: any, i: number) => {
          return { ...item, id: i + 1 };
        })
        setClubUsers(() => array || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [])

  // get active players nickname list
  const activePlayers = useMemo(() => {
    return Object.values(players).filter(player => player.title).map(player => player.title)
  }, [players]);

  const rolesPool = useMemo(() => {
    return Object.values(players).filter(player => player.role).map(player => player.role)
  }, [players]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ClubsContainer direction="column" justifyContent="space-between" alignItems="center">
        <AppAppBar />
        {/*<Box sx={{ width: '100%', gap: 3, display: 'flex', justifyContent: 'space-between' }}>*/}
        {/*  <Button*/}
        {/*    href={'/'}*/}
        {/*    variant="outlined"*/}
        {/*    color="primary"*/}
        {/*    size="small"*/}
        {/*    fullWidth={true}*/}
        {/*    // sx={{minWidth: 'fit-content'}}*/}
        {/*    // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}*/}
        {/*  >*/}
        {/*    Головна*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    href={'/members'}*/}
        {/*    variant="outlined"*/}
        {/*    color="primary"*/}
        {/*    size="small"*/}
        {/*    fullWidth={true}*/}
        {/*    // sx={{minWidth: 'fit-content'}}*/}
        {/*    // sx={{ position: 'fixed', top: '1rem', left: '1rem' }}*/}
        {/*  >*/}
        {/*    Учасники*/}
        {/*  </Button>*/}
        {/*</Box>*/}
        {/*<ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />*/}
        {/*<Typography component="h2" variant="h6" sx={{ mb: 2 }}>*/}
        {/*  Details*/}
        {/*</Typography>*/}
        <Grid minHeight={30} container columns={12} sx={{
          p: 0,
          // justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1200px',
          width: '100%',
          mt: '5rem',
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }}>
          {
            [{ n: 0 }, ...Object.values(players)].map(({ n }) => (
              // <Grid sx={{
              //   // '--Grid-borderWidth': '1px',
              //   // borderTop: 'var(--Grid-borderWidth) solid',
              //   // borderLeft: 'var(--Grid-borderWidth) solid',
              //   // borderColor: 'divider',
              //   // '& > div': {
              //   //   borderRight: 'var(--Grid-borderWidth) solid',
              //   //   borderBottom: 'var(--Grid-borderWidth) solid',
              //   //   borderColor: 'divider',
              //   // },
              //   p: 0, justifyContent: 'center', width: '100%', textAlign: 'center' }} columns={12} minHeight={30} container gap={0}>
              //
              // </Grid>
              <>
                <Grid sx={{ p: '.2rem' }}  size={{ xs: 1.5, sm: 1, lg: 1 }}>
                  {n === 0 ? <ThumbUpIcon/> : n}
                </Grid>
                <Grid sx={{ p: '.3rem' }} size={{ xs: 5.5, sm: 7.5, lg: 7.5 }}>
                  {n === 0 ? 'Нік' : <Autocomplete
                    size={'small'}
                    value={players[n].title}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setPlayerNickname(n, newValue, '');
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setPlayerNickname(n, newValue.inputValue?.title || '', newValue.inputValue?.id || '');
                      } else {
                        setPlayerNickname(n, newValue?.title || "", newValue?._id);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option.title);
                      if (inputValue !== '' && !isExisting) {
                        filtered.push({
                          inputValue,
                          title: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={
                      clubUsers
                        .filter((user: any) => !activePlayers.includes(user.nickname))
                        .map((option: { nickname: string}) => ({...option, title: option.nickname}))
                    }
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          {option.title}
                        </li>
                      );
                    }}
                    // sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} />
                    )}
                  />}
                </Grid>
                <Grid sx={{ cursor: 'pointer', p: '.5rem' }} onClick={() => n && addWarning(n) } size={{ xs: 3.5, sm: 2, lg: 1.5 }}>
                  {n === 0 ? "Фоли" : new Array(players[n].warnings).fill('⚠️').join('  ')}
                </Grid>
                <Grid sx={{ cursor: 'pointer', py: '.4rem' }} size={{ xs: 1.5, sm: 1.5, lg: 2 }} onClick={() => n && addRole(n)} >
                  {n === 0 ? 'Роль' : `${players[n].role} `}
                </Grid>
              </>
            ))
          }
        </Grid>
      </ClubsContainer>
    </AppTheme>
  );
}
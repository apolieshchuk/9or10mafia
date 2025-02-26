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
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
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
import Button from "@mui/material/Button";

const filter = createFilterOptions();

const NewGameContainer = styled(Stack)(({theme}) => ({
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

const RolesPoolDefault = [1, 2, 3, 4]
const RolesPoolMap: Record<number, string> = {
  0: '',
  1: 'М1',
  2: 'М2',
  3: 'Д',
  4: 'Ш'
}

export default function NewGame(props: { disableCustomTheme?: boolean }) {
  const [clubUsers, setClubUsers] = React.useState([]);
  const [winState, setWinState] = React.useState('');
  const [hideRoles, setHideRoles] = React.useState(false);
  const [votings, setVotings] = React.useState([1, 2, 3, 4].reduce((acc, c) => {
    acc[c] = {c, title: `День ${c}`, candidates: {}};
    return acc
  }, {} as Record<number, any>));
  const [activeVoting, setActiveVoting] = React.useState(null as { c: number, candidates: number[] } | null);

  const [players, _setPlayers] = React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, n) => {
    acc[n] = {n, title: `Гість ${n}`, warnings: 0, role: 0, killed: 0, bestTurn: []};
    return acc
  }, {} as Record<number, any>));
  const setPlayers = (item: any) => _setPlayers(() => item);

  const setPlayerNickname = (n: number, title: string, id: string) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    setPlayers({...players, [n]: {...players[n], title, id}});
  }

  const addWarning = (n: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    setPlayers({...players, [n]: {...players[n], warnings: (players[n].warnings + 1) % 5}});
  }

  const addRole = (n: number) => {
    if (n === 0) {
      return setHideRoles(!hideRoles);
    }
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    const currentRole = players[n].role || 0;
    const pool = RolesPoolDefault.filter(role => !rolesPool.includes(role));
    let role = pool.length ? pool.find((r) => r > currentRole) : 0;
    role = role || 0;
    setPlayers({...players, [n]: {...players[n], role}});
  }

  const killPlayer = (n: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    const currentKilledStatus = players[n].killed || 0;
    const pool = [1, 2, 3].filter(killed => !killedPool.includes(killed));
    let killed = pool.length ? pool.find((r) => r > currentKilledStatus) : 0;
    killed = killed || 0;
    setPlayers({...players, [n]: {...players[n], killed}});
  }

  const bestTurn = (n: number, i: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    const currentBestTurn = [...players[n].bestTurn || []] ;
    if (currentBestTurn.length >= 3) {
      return;
    }

    // set all other players bestTurn to default []
    Object.keys(players).forEach((key) => {
      players[Number(key)].bestTurn = [];
    });

    if (currentBestTurn.includes(i)) {
      setPlayers({...players, [n]: {...players[n], bestTurn: currentBestTurn.filter((turn: number) => turn !== i)}});
      return;
    }
    if (currentBestTurn.length >= 3) {
      return;
    }
    setPlayers({...players, [n]: {...players[n], bestTurn: [...currentBestTurn, i]}});
  }

  const promoteVote = (n: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    if (!n) return;
    const currentVoting = activeVoting || votings[1];
    // if (!activeVoting) setActiveVoting(() => votings[0]);
    const activeVotingCandidates = currentVoting?.candidates
    activeVotingCandidates[n] = 0;

    setVotings(() => ({...votings, [currentVoting?.c]: {...currentVoting, candidates: activeVotingCandidates}}));
    setActiveVoting(() => ({ ...currentVoting }));
  }

  const voteForPlayer = (candidate: number, votes: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    if (!activeVoting) return;
    const activeVotingCandidates = activeVoting?.candidates
    if (activeVotingCandidates[candidate] === votes) {
      votes = 0;
    }
    activeVotingCandidates[candidate] = votes;
    setVotings(() => ({...votings, [activeVoting.c]: {...activeVoting, candidates: activeVotingCandidates}}));
  }

  const win = (winner: string) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    if (rolesPool.length !== 4) {
      alert('Не всім розподілено ролі');
      return;
    }
    if (Object.values(players).filter(player => player.title).length < 10) {
      alert('Не всім розподілено нікнейми');
      return
    }
    setWinState(() => winner === winState ? '' : winner);
    setTimeout(async () => {
      if (confirm("Відправити результати гри?")) {
        await axios.post(`http://localhost:3000/club/rating-game`, {
          players: Object.values(players).map(player => {
            return {
              title: player.title,
              role: RolesPoolMap[player.role],
              killed: player.killed,
              bestTurn: player.bestTurn,
              warnings: player.warnings,
              id: player.id
            }
          }),
          winState: winner,
          votings
        });
      } else {
        setWinState(() => '');
      }
    }, 200);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const urlPath = window.location.pathname.includes('new-game-rating') ? 'club/users' : 'users'
        const {data} = await axios.get(`http://localhost:3000/${urlPath}`);
        const array = (data.items || []).map((item: any, i: number) => {
          return {...item, id: i + 1};
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

  const killedPool = useMemo(() => {
    return Object.values(players).filter(player => player.killed).map(player => player.killed)
  }, [players]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme/>
      <NewGameContainer direction="column" justifyContent="space-between" alignItems="center">
        <AppAppBar/>
        <Box sx={{mt: '5.3rem', display: {xs: 'flex', md: 'flex'}, justifyContent: 'space-between', flexGrow: 1}}>
          <Button onClick={() => !winState && win('mafia')} sx={{mr: '1rem'}} variant="outlined"
                  color={winState === 'mafia' ? 'secondary' : 'info'} size="small">
            Перемога мафії
          </Button>
          <Button onClick={() => !winState && win('citizens')} variant="outlined"
                  color={winState === 'citizens' ? 'secondary' : 'info'} size="small">
            Перемога мирних
          </Button>
        </Box>
        <Grid minHeight={30} container columns={12} sx={{
          p: 0,
          // justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1200px',
          width: '100%',
          mt: '.5rem',
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
            [{n: 0}, ...Object.values(players)].map(({n}) => (
              <>
                {
                  players[n]?.killed !== 1 && <>
                        <Grid onClick={() => promoteVote(n)} sx={{cursor: 'pointer', p: '.2rem'}}
                              size={{xs: 1.5, sm: 1, lg: 1}}>
                          {n === 0 ? <ThumbUpIcon/> : n}
                        </Grid>
                        <Grid sx={{p: '.3rem'}} size={{xs: 5.5, sm: 7.5, lg: 7.5}}>
                          {n === 0 ? 'Нік' : <Autocomplete
                            size={'small'}
                            value={players[n].title}
                            onChange={(event, newValue) => {
                              if (typeof newValue === 'string') {
                                setPlayerNickname(n, newValue, '');
                              } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setPlayerNickname(n, newValue.inputValue || newValue.inputValue?.title || '', newValue.inputValue?.id || '');
                              } else {
                                setPlayerNickname(n, newValue?.title || `Гість ${n}`, newValue?._id);
                              }
                            }}
                            filterOptions={(options, params) => {
                              const filtered = filter(options, params);

                              const {inputValue} = params;
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
                                .map((option: { nickname: string }) => ({...option, title: option.nickname}))
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
                              const {key, ...optionProps} = props;
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
                        <Grid sx={{
                          p: n === 0 ? '.5rem' : '.1rem',
                          backgroundColor: players[n]?.warnings === 3 ? 'rgba(255,165,0, 0.2)' : players[n]?.warnings === 4 ? 'rgba(255,0,0, 0.3)' : 'transparent',
                          cursor: 'pointer'
                        }} onClick={() => addWarning(n)} size={{xs: 1.75, sm: 2, lg: 1.5}}>
                          {n === 0 ? "Ф" : new Array(players[n].warnings).fill('⚠️').join('  ')}
                        </Grid>
                        <Grid sx={{
                          p: '.5rem',
                          fontWeight: n !== 0 ? 800 : '',
                          cursor: 'pointer',
                        }} size={{xs: 2, sm: 1, lg: 1.5}} onClick={() => addRole(n)}>
                          {n === 0 ? 'Р' : hideRoles ? '?' : `${RolesPoolMap[players[n].role]} `}
                        </Grid>
                    </>
                }
                {
                  n !== 0 && players[n]?.killed === 1 &&
                    <Grid container columns={12} sx={{p: '.3rem'}} size={{xs: 10.75, sm: 11.5, lg: 11.5}}>
                      {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                          return <Grid sx={{
                            backgroundColor: players[n].bestTurn.includes(i) ? 'rgb(0, 54, 107)' : 'transparent',
                            borderColor: 'gray !important',
                            borderRight: 'var(--Grid-borderWidth) solid',
                            cursor: 'pointer'
                          }} size={{xs: 12 / 10}} onClick={() => bestTurn(n, i)}>
                            {i}
                          </Grid>
                        })
                      }
                    </Grid>
                }
                <Grid sx={{
                  fontWeight: n !== 0 ? 800 : '',
                  cursor: 'pointer',
                  py: '.4rem'
                }} size={{xs: 1.25, sm: 0.5, lg: 0.5}} onClick={() => n && killPlayer(n)}>
                  {n === 0 ? <HeartBrokenIcon/> : players[n].killed ? `${players[n].killed}` : ''}
                </Grid>
              </>
            ))
          }
        </Grid>

        {
          activeVoting && Boolean(Object.keys(activeVoting.candidates)?.length) && <>
                <Grid minHeight={30} container columns={12} sx={{
                  p: 0,
                  // justifyContent: 'center',
                  textAlign: 'center',
                  maxWidth: '1200px',
                  width: '100%',
                  mt: '.5rem',
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
                    Object.keys(activeVoting?.candidates).map((candidate: string) => {
                      return <>
                        <Grid sx={{cursor: 'pointer', p: '.3rem'}} size={{xs: 1}}> <strong>{candidate}</strong> </Grid>
                        {
                          [1, 2, 3, 4, 5, 6].map((i) => {
                            return <Grid sx={{
                              p: '.3rem',
                              fontStyle: 'italic',
                              backgroundColor: activeVoting?.candidates?.[Number(candidate)] === i ? 'rgb(0, 54, 107)' : 'transparent',
                              // borderColor: 'gray !important',
                              // borderRight: 'var(--Grid-borderWidth) solid',
                              cursor: 'pointer'
                            }} size={{xs: 11 / 6}} onClick={() => voteForPlayer(Number(candidate), i)}>
                              {i === 6 ? '6+' : i }
                            </Grid>
                          })
                        }
                      </>
                    })
                  }
                </Grid>
                <Button onClick={() => setActiveVoting(votings[activeVoting.c ? activeVoting.c + 1 : 1])} sx={{mt: '1rem'}} variant="outlined"
                        color={winState === 'mafia' ? 'secondary' : 'info'} size="small">
                    Зберегти голосування
                </Button>
            </>
        }
      </NewGameContainer>
    </AppTheme>
  );
}
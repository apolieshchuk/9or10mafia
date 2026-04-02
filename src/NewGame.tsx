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
import axios from "./axios";
import AppAppBar from "./components/AppAppBar";
import {Autocomplete, createFilterOptions, Popover} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useAuth} from "./AuthProvider";

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

const createInitialPlayers = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, n) => {
  acc[n] = {n, title: `Гість ${n}`, warnings: 0, role: 0, killed: 0, bestTurn: {} as Record<number, string>, bonusPoints: 0};
  return acc
}, {} as Record<number, any>);

const createInitialVotings = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, c) => {
  acc[c] = {c, title: `День ${c}`, candidates: []};
  return acc
}, {} as Record<number, any>);

export default function NewGame(props: { disableCustomTheme?: boolean }) {
  const { user } = useAuth();
  const [path, setPath] = React.useState(window.location.pathname);
  const [clubUsers, setClubUsers] = React.useState([]);
  const [winState, setWinState] = React.useState('');
  const [hideRoles, setHideRoles] = React.useState(false);
  const [preventSleepMode, setPreventSleepMode] = React.useState(true);
  const [votings, setVotings] = React.useState(createInitialVotings());
  const [activeVoting, setActiveVoting] = React.useState(null as { c: number, candidates: [] } | null);

  const [players, _setPlayers] = React.useState(createInitialPlayers());
  const setPlayers = (item: any) => _setPlayers(() => item);
  const [bonusAnchorEl, setBonusAnchorEl] = React.useState<HTMLElement | null>(null);
  const [bonusPlayerN, setBonusPlayerN] = React.useState<number>(0);

  const resetGame = () => {
    setPlayers(createInitialPlayers());
    setVotings(createInitialVotings());
    setActiveVoting(null);
    setWinState('');
    setHideRoles(false);
    setBonusAnchorEl(null);
    setBonusPlayerN(0);
  };

  const setPlayerNickname = (n: number, title: string, id: string) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    setPlayers({...players, [n]: {...players[n], title, id}});
  }

  const addWarning = (n: number) => {
    if (!n) return;
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
    const hasFirstKilled = Object.values(players).some((p: any) => p.n !== n && p.killed === 1);
    if (hasFirstKilled && players[n].killed !== 1) return;
    setPlayers({...players, [n]: {...players[n], killed: players[n].killed === 1 ? 0 : 1, bestTurn: players[n].killed === 1 ? {} : players[n].bestTurn}});
  }

  const isPlayerWinner = (n: number) => {
    const role = players[n]?.role;
    return winState === 'mafia' ? [1, 2, 3].includes(role) : [0, 4].includes(role);
  };

  const openBonusPopover = (e: React.MouseEvent<HTMLElement>, n: number) => {
    setBonusAnchorEl(e.currentTarget);
    setBonusPlayerN(n);
  };

  const selectBonus = (pts: number) => {
    const current = players[bonusPlayerN].bonusPoints;
    setPlayers({...players, [bonusPlayerN]: {...players[bonusPlayerN], bonusPoints: current === pts ? 0 : pts}});
    setBonusAnchorEl(null);
  };

  const supportFive = (n: number, i: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    const current = {...(players[n].bestTurn || {})};

    Object.keys(players).forEach((key) => {
      if (Number(key) !== n) {
        players[Number(key)].bestTurn = {};
      }
    });

    const currentColor = current[i];
    if (currentColor === 'black') {
      current[i] = 'red';
    } else if (currentColor === 'red') {
      delete current[i];
    } else {
      if (Object.keys(current).length >= 5) return;
      current[i] = 'black';
    }

    setPlayers({...players, [n]: {...players[n], bestTurn: current}});
  }

  const promoteVote = (n: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    if (!n) return;
    const currentVoting = activeVoting || votings[1];
    // if (!activeVoting) setActiveVoting(() => votings[0]);
    const activeVotingCandidates = currentVoting?.candidates || []
    const isExists = activeVotingCandidates.find(([candidate]: [number, number]) => candidate === n);
    if (isExists) {
      return;
    }
    activeVotingCandidates.push([n, 0]);
    // activeVotingCandidates[n] = 0;

    setVotings(() => ({...votings, [currentVoting?.c]: {...currentVoting, candidates: activeVotingCandidates}}));
    setActiveVoting(() => ({ ...currentVoting }));
  }

  const voteForPlayer = (candidateIndex: number, votes: number) => {
    if (winState) {
      alert('Гра закінчена');
      return;
    }
    if (!activeVoting) return;
    const activeVotingCandidates: Array<[number, number]> = activeVoting?.candidates
    // const findCandidate = Object.keys(activeVotingCandidates).find(key => Number(key) === candidate);
    if (activeVotingCandidates && activeVotingCandidates[candidateIndex][1] === votes) {
      activeVotingCandidates[candidateIndex][1] = 0;
      return;
    }
    activeVotingCandidates[candidateIndex][1] = votes;
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
    setWinState(() => winner);
  }

  const submitGame = async () => {
    if (!winState) return;
    if (!confirm("Відправити результати гри?")) return;
    const playersPayload = Object.values(players).map(p => ({
      ...p,
      bestTurn: Object.entries(p.bestTurn || {}).map(([seat, color]) => ({n: Number(seat), color})),
    }));
    await axios.post('/club/rating-game', {
      players: playersPayload,
      winState,
      votings
    });
    alert('Гру збережено');
    resetGame();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const urlPath = window.location.pathname.endsWith('new-game-rating') ? 'club/users' : 'users'
        const {data} = await axios.get(`/${urlPath}`);
        const array = (data.items || []).map((item: any, i: number) => {
          return {...item, id: i + 1};
        })
        setClubUsers(() => array || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
    //
    // const iosSleepPreventInterval = setInterval(function () {
    //   setPreventSleepMode(() => false);
    //   setTimeout(() => {
    //     window.location.href = "/new/page";
    //     window.setTimeout(function () {
    //       window.stop()
    //       setPreventSleepMode(() => true);
    //     }, 0);
    //   }, 0)
    // }, 30000);

    const preventRefresh = function () {
      if (confirm("Якщо ви залишите цю сторінку, ваші зміни не будуть збережені.")){
      } else {
        return false;
      }
    };
    window.onbeforeunload = preventRefresh;
    // @ts-ignore For mobile devices
    window.unload = preventRefresh;
    // @ts-ignore For mobile devices
    window.pagehide = preventRefresh;
    return () => {
      window.onbeforeunload = null
    };
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
        <Box sx={{mt: '5.3rem', display: 'flex', justifyContent: 'space-between', flexGrow: 1, gap: 1}}>
          <Button onClick={() => !winState && win('mafia')} variant="outlined"
                  color={winState === 'mafia' ? 'secondary' : 'info'} size="small">
            Перемога мафії
          </Button>
          <Button onClick={() => !winState && win('citizens')} variant="outlined"
                  color={winState === 'citizens' ? 'secondary' : 'info'} size="small">
            Перемога мирних
          </Button>
          {winState && user?.authType === 'Клуб' && path.endsWith('new-game-rating') && (
            <Button onClick={submitGame} variant="contained" color="success" size="small">
              Зберегти гру
            </Button>
          )}
        </Box>
        <Grid minHeight={30} container columns={12} sx={{
          p: 0,
          // fontSize: '16px !important',
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
                    <Grid container columns={12} sx={{p: '.3rem', backgroundColor: 'rgba(200, 200, 210, 0.25)'}} size={{xs: 10.75, sm: 11.5, lg: 11.5}}>
                      {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                          const color = players[n].bestTurn?.[i];
                          return <Grid sx={{
                            backgroundColor: color === 'black' ? 'rgba(0, 0, 0, 1)'
                              : color === 'red' ? 'rgba(180, 0, 0, 0.6)'
                              : 'transparent',
                            color: color ? '#fff' : 'inherit',
                            borderColor: 'gray !important',
                            borderRight: 'var(--Grid-borderWidth) solid',
                            cursor: 'pointer',
                            fontWeight: color ? 700 : 400,
                          }} size={{xs: 12 / 10}} onClick={() => supportFive(n, i)}>
                            {i}
                          </Grid>
                        })
                      }
                    </Grid>
                }
                <Grid sx={{
                  fontWeight: n !== 0 ? 800 : '',
                  cursor: winState && n !== 0
                    ? 'pointer'
                    : n !== 0 && (!killedPool.includes(1) || players[n]?.killed === 1) ? 'pointer' : 'default',
                  py: '.4rem',
                  opacity: !winState && n !== 0 && killedPool.includes(1) && players[n]?.killed !== 1 ? 0.3 : 1,
                  fontSize: players[n]?.killed === 1 && !winState ? '0.7rem' : 'inherit',
                }} size={{xs: 1.25, sm: 0.5, lg: 0.5}}
                   onClick={(e: any) => {
                     if (!n) return;
                     if (winState) {
                       openBonusPopover(e, n);
                     } else {
                       killPlayer(n);
                     }
                   }}>
                  {winState && n !== 0
                    ? (players[n].bonusPoints
                      ? <span style={{fontSize: '0.7rem', color: '#4caf50'}}>+{players[n].bonusPoints}</span>
                      : <ThumbUpIcon sx={{fontSize: '0.9rem', opacity: 0.5}}/>)
                    : n === 0
                      ? <HeartBrokenIcon/>
                      : players[n]?.killed === 1
                        ? `${Object.keys(players[n].bestTurn || {}).length}/5`
                        : ''
                  }
                </Grid>
              </>
            ))
          }
        </Grid>

        <Popover
          open={Boolean(bonusAnchorEl)}
          anchorEl={bonusAnchorEl}
          onClose={() => setBonusAnchorEl(null)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Stack direction="row" spacing={1} sx={{p: 1.5}}>
            {(isPlayerWinner(bonusPlayerN) ? [0.3, 0.4, 0.5] : [0.1, 0.2, 0.3]).map(p => (
              <Button
                key={p}
                variant={players[bonusPlayerN]?.bonusPoints === p ? 'contained' : 'outlined'}
                size="small"
                onClick={() => selectBonus(p)}
              >
                +{p}
              </Button>
            ))}
          </Stack>
        </Popover>

        {
          activeVoting && Boolean(activeVoting.candidates?.length) && <>
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
                    activeVoting?.candidates.map(([candidate]: [number, number], i) => {
                      return <>
                        <Grid sx={{cursor: 'pointer', p: '.3rem'}} size={{xs: 1}}> <strong>{candidate}</strong> </Grid>
                        {
                          [1, 2, 3, 4, 5, 6].map((j) => {
                            return <Grid sx={{
                              p: '.3rem',
                              fontStyle: 'italic',
                              backgroundColor: activeVoting?.candidates?.[i]?.[1] === j ? 'rgb(0, 54, 107)' : 'transparent',
                              // borderColor: 'gray !important',
                              // borderRight: 'var(--Grid-borderWidth) solid',
                              cursor: 'pointer'
                            }} size={{xs: 11 / 6}} onClick={() => voteForPlayer(i, j)}>
                              {j === 6 ? '6+' : j }
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